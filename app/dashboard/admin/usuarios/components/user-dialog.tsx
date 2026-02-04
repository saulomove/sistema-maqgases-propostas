'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createUser, updateUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function UserDialog({ user, units, trigger }: { user?: any, units: any[], trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        senha: '',
        role: user?.role || 'unidade',
        unidadeId: user?.unidadeId?.toString() || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (user) {
                // Update
                await updateUser(user.id, {
                    nome: formData.nome,
                    email: formData.email,
                    role: formData.role as 'superadmin' | 'unidade',
                    unidadeId: formData.unidadeId ? parseInt(formData.unidadeId) : null,
                    senha: formData.senha || undefined
                });
                toast.success('Usuário atualizado!');
            } else {
                // Create
                await createUser({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    role: formData.role as 'superadmin' | 'unidade',
                    unidadeId: formData.unidadeId ? parseInt(formData.unidadeId) : undefined
                });
                toast.success('Usuário criado!');
            }
            setOpen(false);
        } catch (err) {
            toast.error('Erro ao salvar usuário.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Altere os dados de acesso.' : 'Crie um novo acesso ao sistema.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">Nome</Label>
                        <Input id="nome" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="col-span-3" required autoFocus />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="senha" className="text-right">Senha</Label>
                        <Input id="senha" type="password" placeholder={user ? "(Manter atual)" : "Criar senha"} value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} className="col-span-3" required={!user} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Função</Label>
                        <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unidade">Unidade (Comercial)</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.role === 'unidade' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unidade" className="text-right">Unidade</Label>
                            <Select value={formData.unidadeId} onValueChange={v => setFormData({ ...formData, unidadeId: v })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map(u => (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
