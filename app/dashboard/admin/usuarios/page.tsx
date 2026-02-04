import { db } from "@/lib/db";
import { users, unidades } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./components/users-table";
import { UserDialog } from "./components/user-dialog";

export default async function AdminUsuariosPage() {
    // Fetch users with their unit info
    const usersList = await db.select({
        id: users.id,
        email: users.email,
        role: users.role,
        unidadeId: users.unidadeId,
        unidadeNome: unidades.nome
    })
        .from(users)
        .leftJoin(unidades, eq(users.unidadeId, unidades.id));

    // Fetch units for the dropdown
    const unitsList = await db.select().from(unidades);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciamento de Usuários</h1>
                    <p className="text-muted-foreground">Controle de acesso ao sistema.</p>
                </div>
                <UserDialog units={unitsList} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuários Cadastrados</CardTitle>
                    <CardDescription>Lista de todos os usuários com acesso ao painel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable initialData={usersList} units={unitsList} />
                </CardContent>
            </Card>
        </div>
    );
}
