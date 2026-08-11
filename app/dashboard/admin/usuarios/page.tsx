import { db } from "@/lib/db";
import { users, unidades } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./components/users-table";
import { UserDialog } from "./components/user-dialog";
import { getCurrentUser } from "@/lib/auth";
import { assignableRoles, canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function AdminUsuariosPage() {
    const user = await getCurrentUser();
    if (!canManageUsers(user)) redirect('/dashboard/propostas');

    // Fetch users with their unit info
    const usersList = await db.select({
        id: users.id,
        nome: users.nome,
        email: users.email,
        role: users.role,
        escopoVisibilidade: users.escopoVisibilidade,
        unidadeId: users.unidadeId,
        ativo: users.ativo,
        unidadeNome: unidades.nome
    })
        .from(users)
        .leftJoin(unidades, eq(users.unidadeId, unidades.id))
        .orderBy(asc(users.nome));

    // Fetch units for the dropdown
    const unitsList = await db.select().from(unidades).orderBy(asc(unidades.nome));

    const rolesDisponiveis = assignableRoles(user);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciamento de Usuários</h1>
                    <p className="text-muted-foreground">Controle de acesso ao sistema.</p>
                </div>
                <UserDialog units={unitsList} rolesDisponiveis={rolesDisponiveis} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuários Cadastrados</CardTitle>
                    <CardDescription>
                        A <strong>função</strong> define o que a pessoa pode fazer. A <strong>visibilidade</strong> define
                        quais propostas ela enxerga.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable
                        initialData={usersList}
                        units={unitsList}
                        rolesDisponiveis={rolesDisponiveis}
                        currentUserId={user!.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
