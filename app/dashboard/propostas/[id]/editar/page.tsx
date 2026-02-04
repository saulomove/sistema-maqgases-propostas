import { db } from "@/lib/db";
import { propostas, propostaItens, tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ProposalWizard } from "@/components/proposal-wizard";
import { asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function EditarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const { id } = await params;
    const proposalId = parseInt(id);
    if (isNaN(proposalId)) notFound();

    // Fetch Proposal
    const [proposal] = await db.select().from(propostas).where(eq(propostas.id, proposalId));
    if (!proposal) notFound();

    // Check permissions
    if (user.role !== 'superadmin' && proposal.unidadeId !== user.unidadeId) {
        redirect('/dashboard/propostas');
    }

    // Fetch Items
    const items = await db.select().from(propostaItens).where(eq(propostaItens.propostaId, proposalId));

    // Fetch Catalogs
    const [
        gasTypesList,
        capacitiesList,
        unitMeasuresList,
        paymentTermsList
    ] = await Promise.all([
        db.select().from(tiposGas).orderBy(asc(tiposGas.ordem)),
        db.select().from(capacidades).orderBy(asc(capacidades.ordem)),
        db.select().from(unidadesMedida).orderBy(asc(unidadesMedida.ordem)),
        db.select().from(condicoesPagamento).orderBy(asc(condicoesPagamento.ordem)),
    ]);

    // Prepare Initial Data
    const initialData = {
        id: proposal.id,
        tipo: proposal.tipo as "cilindro" | "liquido",
        clienteNome: proposal.clienteNome,
        clienteLocalEntrega: proposal.clienteLocalEntrega,
        locacaoAtiva: proposal.locacaoAtiva || false,
        locacaoQuantidade: proposal.locacaoQuantidade ? Number(proposal.locacaoQuantidade) : null,
        locacaoValorUnitario: proposal.locacaoValorUnitario ? Number(proposal.locacaoValorUnitario) : null,
        items: items
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Proposta</h1>
                <p className="text-muted-foreground">Atualize os dados da proposta {proposal.numero}.</p>
            </div>

            <ProposalWizard
                gasTypes={gasTypesList}
                capacities={capacitiesList}
                unitMeasures={unitMeasuresList}
                paymentTerms={paymentTermsList}
                userId={user.id}
                unidadeId={user.unidadeId || 0}
                initialData={initialData}
            />
        </div>
    );
}
