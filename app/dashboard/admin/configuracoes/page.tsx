import { getCurrentUser } from "@/lib/auth";
import { canManageConfiguracoes } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function AdminConfiguracoesPage() {
    const user = await getCurrentUser();
    if (!canManageConfiguracoes(user)) redirect('/dashboard/propostas');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configurações do Sistema</h1>
                <p className="text-muted-foreground">Ajustes gerais da aplicação.</p>
            </div>

            <div className="p-10 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                Configurações globais serão implementadas aqui.
            </div>
        </div>
    );
}
