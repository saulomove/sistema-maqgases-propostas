'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { createGasType, updateGasType, deleteGasType } from "@/lib/actions/catalogos";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GasType {
    id: number;
    nome: string;
    tipo: string | null; // Using string | null to match inferred type if needed, but schema says varchar
    ordem: number | null;
}

export function GasTypesTable({ initialData }: { initialData: GasType[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form States
    const [formData, setFormData] = useState({ nome: '', tipo: 'cilindro', ordem: 0 });

    const handleEdit = (item: GasType) => {
        setEditingId(item.id);
        setFormData({
            nome: item.nome,
            tipo: item.tipo as string || 'cilindro',
            ordem: item.ordem || 0
        });
        setIsCreating(false);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({ nome: '', tipo: 'cilindro', ordem: (Math.max(...initialData.map(d => d.ordem || 0), 0) + 1) });
    };

    const handleSave = async () => {
        try {
            if (isCreating) {
                await createGasType({
                    nome: formData.nome,
                    tipo: formData.tipo as 'cilindro' | 'liquido' | 'ambos',
                    ordem: formData.ordem
                });
                toast.success('Gás criado com sucesso!');
            } else if (editingId) {
                await updateGasType(editingId, {
                    nome: formData.nome,
                    tipo: formData.tipo as 'cilindro' | 'liquido' | 'ambos',
                    ordem: formData.ordem
                });
                toast.success('Gás atualizado!');
            }
            setEditingId(null);
            setIsCreating(false);
        } catch (error) {
            toast.error('Erro ao salvar.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await deleteGasType(id);
            toast.success('Item excluído.');
        } catch (e) { toast.error('Erro ao excluir.'); }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                {!isCreating && <Button onClick={handleCreate} size="sm"><Plus className="mr-2 h-4 w-4" /> Novo Gás</Button>}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Ordem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Creation Row */}
                    {isCreating && (
                        <TableRow className="bg-muted/50">
                            <TableCell>
                                <Input type="number" value={formData.ordem} onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} className="w-16 h-8" />
                            </TableCell>
                            <TableCell>
                                <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome do gás" className="h-8" autoFocus />
                            </TableCell>
                            <TableCell>
                                <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                                    <SelectTrigger className="h-8 w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cilindro">Cilindro</SelectItem>
                                        <SelectItem value="liquido">Líquido</SelectItem>
                                        <SelectItem value="ambos">Ambos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Data Rows */}
                    {initialData.map((item) => (
                        <TableRow key={item.id}>
                            {editingId === item.id ? (
                                <>
                                    <TableCell>
                                        <Input type="number" value={formData.ordem} onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} className="w-16 h-8" />
                                    </TableCell>
                                    <TableCell>
                                        <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="h-8" />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                                            <SelectTrigger className="h-8 w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cilindro">Cilindro</SelectItem>
                                                <SelectItem value="liquido">Líquido</SelectItem>
                                                <SelectItem value="ambos">Ambos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.ordem}</TableCell>
                                    <TableCell className="font-medium">{item.nome}</TableCell>
                                    <TableCell className="capitalize badge">{item.tipo}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} className="h-8 w-8"><Pencil size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                    {initialData.length === 0 && !isCreating && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum registro encontrado</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
