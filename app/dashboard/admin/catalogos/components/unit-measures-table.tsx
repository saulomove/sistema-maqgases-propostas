'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { createUnitMeasure, updateUnitMeasure, deleteUnitMeasure } from "@/lib/actions/catalogos";
import { toast } from "sonner";

interface UnitMeasure {
    id: number;
    nome: string;
    sigla: string;
    ordem: number | null;
}

export function UnitMeasuresTable({ initialData }: { initialData: UnitMeasure[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ nome: '', sigla: '', ordem: 0 });

    const handleEdit = (item: UnitMeasure) => {
        setEditingId(item.id);
        setFormData({ nome: item.nome, sigla: item.sigla, ordem: item.ordem || 0 });
        setIsCreating(false);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({ nome: '', sigla: '', ordem: (Math.max(...initialData.map(d => d.ordem || 0), 0) + 1) });
    };

    const handleSave = async () => {
        try {
            if (isCreating) {
                await createUnitMeasure(formData);
                toast.success('Unidade criada!');
            } else if (editingId) {
                await updateUnitMeasure(editingId, formData);
                toast.success('Unidade atualizada!');
            }
            setEditingId(null);
            setIsCreating(false);
        } catch (error) { toast.error('Erro ao salvar.'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este item?')) return;
        try { await deleteUnitMeasure(id); toast.success('Excluído.'); } catch (e) { toast.error('Erro.'); }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                {!isCreating && <Button onClick={handleCreate} size="sm"><Plus className="mr-2 h-4 w-4" /> Nova Unidade</Button>}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Ordem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Sigla</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isCreating && (
                        <TableRow className="bg-muted/50">
                            <TableCell><Input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: +e.target.value })} className="w-16 h-8" /></TableCell>
                            <TableCell><Input value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Metros Cúbicos" className="h-8" autoFocus /></TableCell>
                            <TableCell><Input value={formData.sigla} onChange={e => setFormData({ ...formData, sigla: e.target.value })} placeholder="Ex: m³" className="w-24 h-8" /></TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                            </TableCell>
                        </TableRow>
                    )}
                    {initialData.map((item) => (
                        <TableRow key={item.id}>
                            {editingId === item.id ? (
                                <>
                                    <TableCell><Input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: +e.target.value })} className="w-16 h-8" /></TableCell>
                                    <TableCell><Input value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="h-8" /></TableCell>
                                    <TableCell><Input value={formData.sigla} onChange={e => setFormData({ ...formData, sigla: e.target.value })} className="w-24 h-8" /></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.ordem}</TableCell>
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell>{item.sigla}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} className="h-8 w-8"><Pencil size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500"><Trash2 size={16} /></Button>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
