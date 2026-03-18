import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { propostas, propostaItens, unidades, tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { eq, sql, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();

        // 1. Generate Proposal Number (UNIDADE-YYYY-####)
        const [unit] = await db.select().from(unidades).where(eq(unidades.id, user.unidadeId || 0));

        if (!unit) {
            return NextResponse.json({ error: "Unidade not found" }, { status: 400 });
        }

        // Extract city abbreviation from unit name to avoid prefix collisions.
        // Format: "Matriz – Joaçaba/SC" → "JOA"  |  "Filial – Caxias do Sul/RS" → "CXS"
        // Fallback: first 3 chars of name + unit ID (e.g. FIL3) if no " – " separator found.
        let unitPrefix: string;
        const dashSeparatorIdx = unit.nome.indexOf(' – ');
        if (dashSeparatorIdx !== -1) {
            // Take the city part after " – " and before "/" (if any)
            const afterDash = unit.nome.substring(dashSeparatorIdx + 3); // e.g. "Caxias do Sul/RS" or "Joaçaba/SC"
            const cityName = afterDash.split('/')[0].trim(); // e.g. "Caxias do Sul" or "Joaçaba"
            // Build 3-char abbreviation from the city name words
            const words = cityName.split(' ').filter(w => w.length > 0);
            if (words.length === 1) {
                unitPrefix = words[0].substring(0, 3).toUpperCase();
            } else {
                // Multi-word city: take first letter of each word up to 3
                unitPrefix = words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
                // Pad to at least 3 chars if needed
                if (unitPrefix.length < 3) {
                    unitPrefix = (unitPrefix + words[0].substring(1, 3).toUpperCase()).substring(0, 3);
                }
            }
        } else {
            // Fallback: first 3 chars + unit ID to guarantee uniqueness
            unitPrefix = unit.nome.substring(0, 3).toUpperCase() + unit.id;
        }
        const year = new Date().getFullYear();

        // Find the MAX sequential number from ALL existing proposals of this unit
        // This handles deletions and prefix changes correctly
        const maxResult = await db.select({ 
            maxNum: sql<string>`MAX(CAST(SPLIT_PART(numero, '-', 3) AS INTEGER))` 
        })
            .from(propostas)
            .where(eq(propostas.unidadeId, unit.id));

        const lastNum = Number(maxResult[0]?.maxNum) || 0;
        let nextNum = lastNum + 1;
        let proposalNumber = `${unitPrefix}-${year}-${nextNum.toString().padStart(5, '0')}`;

        // Calculate total freight from items
        const totalFreteItens = data.itens.reduce((acc: number, item: any) => acc + (Number(item.freteValor) || 0), 0);

        // 2. Create Proposal Record with retry for UNIQUE collisions
        let newProposal: any;
        const MAX_RETRIES = 5;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const [result] = await db.insert(propostas).values({
                    numero: proposalNumber,
                    tipo: data.tipo,
                    status: 'gerada',
                    clienteNome: data.clienteNome,
                    clienteLocalEntrega: data.clienteLocalEntrega,
                    locacaoAtiva: data.locacaoAtiva,
                    locacaoQuantidade: data.locacaoQuantidade ? data.locacaoQuantidade.toString() : null,
                    locacaoValorUnitario: data.locacaoValorUnitario ? data.locacaoValorUnitario.toString() : null,
                    locacaoValorTotal: data.locacaoValorTotal ? data.locacaoValorTotal.toString() : null,
                    freteValor: totalFreteItens.toString(),
                    subtotalItens: "0",
                    valorTotal: "0",
                    unidadeId: unit.id,
                    usuarioId: user.id,
                    snapshot: JSON.stringify(data),
                }).returning();
                newProposal = result;
                break; // Success, exit retry loop
            } catch (insertError: any) {
                // If UNIQUE violation, increment and retry
                if (insertError?.message?.includes('unique') || insertError?.message?.includes('duplicate') || insertError?.code === '23505') {
                    nextNum++;
                    proposalNumber = `${unitPrefix}-${year}-${nextNum.toString().padStart(5, '0')}`;
                    console.warn(`Proposal number collision, retrying with ${proposalNumber} (attempt ${attempt + 2})`);
                    continue;
                }
                throw insertError; // Re-throw non-UNIQUE errors
            }
        }

        if (!newProposal) {
            return NextResponse.json({ error: "Failed to generate unique proposal number after retries" }, { status: 500 });
        }

        // 3. Process Items
        // We need to fetch names to save snapshot data into columns

        // Helpers to fetch names (caching could be added here, but simple queries are fine for now)
        const getGasName = async (id: number) => {
            const [res] = await db.select().from(tiposGas).where(eq(tiposGas.id, id));
            return res?.nome || "Desconhecido";
        };
        const getCapText = async (id: number) => {
            if (!id) return null;
            const [res] = await db.select().from(capacidades).where(eq(capacidades.id, id));
            return res ? res.tamanho : null;
        };
        const getUMName = async (id: number) => {
            const [res] = await db.select().from(unidadesMedida).where(eq(unidadesMedida.id, id));
            return res?.nome || "Un";
        };
        const getPayDesc = async (id: number) => {
            const [res] = await db.select().from(condicoesPagamento).where(eq(condicoesPagamento.id, id));
            return res?.descricao || "";
        };

        let itemsTotal = 0; // This will be the sum of valorUnitario for all items

        // Iterate and Insert Items
        // Using simple loop for logic clarity. 
        if (data.itens && Array.isArray(data.itens)) {
            for (const item of data.itens) {
                if (!item.tipoGasId) continue;

                const gasNome = await getGasName(Number(item.tipoGasId));
                let capTexto = null;
                let capId = null;

                // Handle Multiple Capacities
                if (item.capacidadeIds && Array.isArray(item.capacidadeIds) && item.capacidadeIds.length > 0) {
                    const names = await Promise.all(item.capacidadeIds.map((id: string) => getCapText(Number(id))));
                    capTexto = names.filter(Boolean).join(", ");
                    capId = Number(item.capacidadeIds[0]); // Use first as primary reference
                } else if (item.capacidadeId) {
                    // Legacy/Single support
                    capTexto = await getCapText(Number(item.capacidadeId));
                    capId = Number(item.capacidadeId);
                }

                const umNome = await getUMName(Number(item.unidadeMedidaId));
                const payDesc = await getPayDesc(Number(item.condicaoPagamentoId));
                const valUnit = Number(item.valorUnitario || 0);
                const itemFreteValor = Number(item.freteValor || 0);

                await db.insert(propostaItens).values({
                    propostaId: newProposal.id,
                    tipoGasId: Number(item.tipoGasId),
                    tipoGasNome: gasNome,
                    capacidadeId: capId,
                    capacidadeTexto: capTexto,
                    unidadeMedidaId: Number(item.unidadeMedidaId),
                    unidadeMedidaNome: umNome,
                    valorUnitario: valUnit.toString(),
                    freteValor: itemFreteValor.toString(), // Add freteValor to item
                    condicaoPagamentoId: Number(item.condicaoPagamentoId),
                    condicaoPagamentoDescricao: payDesc,
                    ordem: 0
                });

                itemsTotal += valUnit;
            }
        }

        // 4. Update Proposal with Totals
        // subtotalItens is the sum of valorUnitario from items
        // valorTotal is locacaoValorTotal + subtotalItens + totalFreteItens
        const totalGeral = (Number(data.locacaoValorTotal || 0)) + itemsTotal + totalFreteItens;

        await db.update(propostas)
            .set({
                subtotalItens: itemsTotal.toString(),
                valorTotal: totalGeral.toString()
            })
            .where(eq(propostas.id, newProposal.id));

        return NextResponse.json({ success: true, id: newProposal.id, number: proposalNumber });

    } catch (error) {
        console.error("Error creating proposal:", error);
        return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
    }
}
