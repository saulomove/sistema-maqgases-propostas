'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { UserDialog } from "./user-dialog";
import { useState } from "react";

export function UsersTable({ initialData, units }: { initialData: any[], units: any[] }) {
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja remover este usuário?')) return;
        try {
            await deleteUser(id);
            toast.success('Usuário removido.');
        } catch (e) {
            toast.error('Erro ao remover usuário.');
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Unidade Vinculada</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialData.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'superadmin' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>{user.unidadeNome || '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <UserDialog user={user} units={units} trigger={
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil size={16} /></Button>
                            } />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(user.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
