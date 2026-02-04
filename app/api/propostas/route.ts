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

        const unitPrefix = unit.nome.substring(0, 3).toUpperCase();
        const year = new Date().getFullYear();

        // Simple sequential count for MVP
        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(propostas)
            .where(eq(propostas.unidadeId, unit.id));

        const nextNum = Number(countResult[0].count) + 1;
        const proposalNumber = `${unitPrefix}-${year}-${nextNum.toString().padStart(5, '0')}`;

        // 2. Create Proposal Record
        // Initialize with 0 totals, update later
        const [newProposal] = await db.insert(propostas).values({
            numero: proposalNumber,
            tipo: data.tipo,
            status: 'gerada',
            clienteNome: data.clienteNome,
            clienteLocalEntrega: data.clienteLocalEntrega,
            locacaoAtiva: data.locacaoAtiva,
            locacaoQuantidade: data.locacaoQuantidade ? data.locacaoQuantidade.toString() : null,
            locacaoValorUnitario: data.locacaoValorUnitario ? data.locacaoValorUnitario.toString() : null,
            locacaoValorTotal: data.locacaoValorTotal ? data.locacaoValorTotal.toString() : null,
            subtotalItens: "0",
            valorTotal: "0",
            unidadeId: unit.id,
            usuarioId: user.id,
            snapshot: JSON.stringify(data), // Save full raw payload
        }).returning();

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

        let itemsTotal = 0;

        // Iterate and Insert Items
        // Using simple loop for logic clarity. 
        if (data.itens && Array.isArray(data.itens)) {
            for (const item of data.itens) {
                if (!item.tipoGasId) continue;

                const gasNome = await getGasName(Number(item.tipoGasId));
                const capTexto = item.capacidadeId ? await getCapText(Number(item.capacidadeId)) : null;
                const umNome = await getUMName(Number(item.unidadeMedidaId));
                const payDesc = await getPayDesc(Number(item.condicaoPagamentoId));
                const valUnit = Number(item.valorUnitario || 0);

                await db.insert(propostaItens).values({
                    propostaId: newProposal.id,
                    tipoGasId: Number(item.tipoGasId),
                    tipoGasNome: gasNome,
                    capacidadeId: item.capacidadeId ? Number(item.capacidadeId) : null,
                    capacidadeTexto: capTexto,
                    unidadeMedidaId: Number(item.unidadeMedidaId),
                    unidadeMedidaNome: umNome,
                    valorUnitario: valUnit.toString(),
                    condicaoPagamentoId: Number(item.condicaoPagamentoId),
                    condicaoPagamentoDescricao: payDesc,
                    ordem: 0
                });

                itemsTotal += valUnit;
            }
        }

        // 4. Update Proposal with Totals
        const totalGeral = (Number(data.locacaoValorTotal || 0)) + itemsTotal;

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
