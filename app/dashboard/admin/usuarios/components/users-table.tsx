'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { deleteUser, setUserAtivo } from "@/lib/actions/users";
import { ESCOPO_LABELS, ROLE_LABELS, type EscopoVisibilidade, type UserRole } from "@/lib/permissions";
import { toast } from "sonner";
import { UserDialog } from "./user-dialog";

const ESCOPO_CURTO: Record<EscopoVisibilidade, string> = {
    proprias: 'Só as próprias',
    unidade: 'Toda a unidade',
    todas: 'Todas as unidades',
};

export function UsersTable({ initialData, units, rolesDisponiveis, currentUserId }: {
    initialData: any[],
    units: any[],
    rolesDisponiveis: UserRole[],
    currentUserId: number,
}) {
    const handleDelete = async (user: any) => {
        if (!confirm(`Remover o usuário ${user.nome}? Essa ação não pode ser desfeita.`)) return;
        const result = await deleteUser(user.id);
        if (result?.error) {
            toast.error(result.error);
            return;
        }
        toast.success('Usuário removido.');
    };

    const handleToggleAtivo = async (user: any) => {
        const result = await setUserAtivo(user.id, !user.ativo);
        if (result?.error) {
            toast.error(result.error);
            return;
        }
        toast.success(user.ativo ? 'Usuário desativado. O acesso foi encerrado.' : 'Usuário reativado.');
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead>Unidade Vinculada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialData.map((user) => {
                    const isSelf = user.id === currentUserId;
                    const escopo: EscopoVisibilidade = user.role === 'superadmin' ? 'todas' : user.escopoVisibilidade;

                    return (
                        <TableRow key={user.id} className={user.ativo ? undefined : 'opacity-60'}>
                            <TableCell className="font-medium">{user.nome}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'superadmin' ? 'default' : user.role === 'admin' ? 'warning' : 'secondary'}>
                                    {ROLE_LABELS[user.role as UserRole] ?? user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span title={ESCOPO_LABELS[escopo]} className="text-sm">
                                    {ESCOPO_CURTO[escopo] ?? escopo}
                                </span>
                            </TableCell>
                            <TableCell>{user.unidadeNome || '-'}</TableCell>
                            <TableCell>
                                <Badge variant={user.ativo ? 'success' : 'outline'}>
                                    {user.ativo ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <UserDialog user={user} units={units} rolesDisponiveis={rolesDisponiveis} trigger={
                                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Editar"><Pencil size={16} /></Button>
                                } />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    title={user.ativo ? 'Desativar acesso' : 'Reativar acesso'}
                                    disabled={isSelf}
                                    onClick={() => handleToggleAtivo(user)}
                                >
                                    {user.ativo ? <UserX size={16} /> : <UserCheck size={16} className="text-emerald-600" />}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-500"
                                    title={isSelf ? 'Você não pode excluir a própria conta' : 'Excluir'}
                                    disabled={isSelf}
                                    onClick={() => handleDelete(user)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
