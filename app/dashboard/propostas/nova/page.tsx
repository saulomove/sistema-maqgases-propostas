import { db } from "@/lib/db";
import { tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ProposalWizard } from "@/components/proposal-wizard";
import { asc } from "drizzle-orm";

export default async function NovaPropostaPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    console.log('Rendering NovaPropostaPage');
    console.log('DB URL Length:', process.env.DATABASE_URL?.length);
    console.log('User:', user.email);

    // Fetch catalogs concurrently
    // Fetch catalogs concurrently
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nova Proposta</h1>
                <p className="text-muted-foreground">Preencha os dados abaixo para gerar a proposta comercial.</p>
            </div>

            <ProposalWizard
                gasTypes={gasTypesList}
                capacities={capacitiesList}
                unitMeasures={unitMeasuresList}
                paymentTerms={paymentTermsList}
                userId={user.id}
                unidadeId={user.unidadeId || 0}
            />
        </div>
    );
}
