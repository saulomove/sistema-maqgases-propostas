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
import { ESCOPO_LABELS, ROLE_LABELS, type EscopoVisibilidade, type UserRole } from "@/lib/permissions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const ESCOPO_AJUDA: Record<EscopoVisibilidade, string> = {
    proprias: 'Enxerga somente as propostas que ele mesmo criar.',
    unidade: 'Enxerga as propostas de todos os usuários da filial vinculada.',
    todas: 'Enxerga as propostas de todas as filiais.',
};

export function UserDialog({ user, units, rolesDisponiveis, trigger }: {
    user?: any,
    units: any[],
    rolesDisponiveis: UserRole[],
    trigger?: React.ReactNode,
}) {
    const [open, setOpen] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        senha: '',
        role: (user?.role || 'unidade') as UserRole,
        escopoVisibilidade: (user?.escopoVisibilidade || 'proprias') as EscopoVisibilidade,
        unidadeId: user?.unidadeId?.toString() || ''
    });

    const isSuperAdmin = formData.role === 'superadmin';

    // Superadmin sempre enxerga tudo e não fica preso a uma filial
    const escopoEfetivo: EscopoVisibilidade = isSuperAdmin ? 'todas' : formData.escopoVisibilidade;
    const unidadeIdEfetiva = isSuperAdmin || !formData.unidadeId ? null : parseInt(formData.unidadeId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const payload = {
                nome: formData.nome,
                email: formData.email,
                role: formData.role,
                escopoVisibilidade: escopoEfetivo,
                unidadeId: unidadeIdEfetiva,
            };

            const result = user
                ? await updateUser(user.id, { ...payload, senha: formData.senha || undefined })
                : await createUser({ ...payload, senha: formData.senha });

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success(user ? 'Usuário atualizado!' : 'Usuário criado!');
            setOpen(false);
        } catch {
            toast.error('Erro ao salvar usuário.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Altere os dados de acesso e a visibilidade.' : 'Crie um novo acesso ao sistema.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">Nome</Label>
                        <Input id="nome" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="col-span-3" required autoFocus />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="senha" className="text-right">Senha</Label>
                        <Input id="senha" type="password" placeholder={user ? "(Manter atual)" : "Criar senha"} value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} className="col-span-3" required={!user} />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Função</Label>
                        <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v as UserRole })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {rolesDisponiveis.map(r => (
                                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {!isSuperAdmin && (
                        <>
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

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="escopo" className="text-right pt-2">Visibilidade</Label>
                                <div className="col-span-3 space-y-1.5">
                                    <Select
                                        value={formData.escopoVisibilidade}
                                        onValueChange={v => setFormData({ ...formData, escopoVisibilidade: v as EscopoVisibilidade })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Object.keys(ESCOPO_LABELS) as EscopoVisibilidade[]).map(esc => (
                                                <SelectItem key={esc} value={esc}>{ESCOPO_LABELS[esc]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {ESCOPO_AJUDA[formData.escopoVisibilidade]}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {isSuperAdmin && (
                        <p className="text-xs text-muted-foreground text-center px-4">
                            Super Admin enxerga as propostas de todas as filiais e administra catálogos e configurações.
                        </p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
