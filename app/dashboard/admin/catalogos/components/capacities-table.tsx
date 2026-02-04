'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { createCapacity, updateCapacity, deleteCapacity } from "@/lib/actions/catalogos";
import { toast } from "sonner";

interface Capacity {
    id: number;
    tamanho: string;
    ordem: number | null;
}

export function CapacitiesTable({ initialData }: { initialData: Capacity[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ tamanho: '', ordem: 0 });

    const handleEdit = (item: Capacity) => {
        setEditingId(item.id);
        setFormData({ tamanho: item.tamanho, ordem: item.ordem || 0 });
        setIsCreating(false);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({ tamanho: '', ordem: (Math.max(...initialData.map(d => d.ordem || 0), 0) + 1) });
    };

    const handleSave = async () => {
        try {
            if (isCreating) {
                await createCapacity(formData);
                toast.success('Capacidade criada!');
            } else if (editingId) {
                await updateCapacity(editingId, formData);
                toast.success('Capacidade atualizada!');
            }
            setEditingId(null);
            setIsCreating(false);
        } catch (error) { toast.error('Erro ao salvar.'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este item?')) return;
        try { await deleteCapacity(id); toast.success('Excluído.'); } catch (e) { toast.error('Erro.'); }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                {!isCreating && <Button onClick={handleCreate} size="sm"><Plus className="mr-2 h-4 w-4" /> Nova Capacidade</Button>}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Ordem</TableHead>
                        <TableHead>Tamanho/Volume</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isCreating && (
                        <TableRow className="bg-muted/50">
                            <TableCell><Input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: +e.target.value })} className="w-16 h-8" /></TableCell>
                            <TableCell><Input value={formData.tamanho} onChange={e => setFormData({ ...formData, tamanho: e.target.value })} placeholder="Ex: 10m³" className="h-8" autoFocus /></TableCell>
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
                                    <TableCell><Input value={formData.tamanho} onChange={e => setFormData({ ...formData, tamanho: e.target.value })} className="h-8" /></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.ordem}</TableCell>
                                    <TableCell>{item.tamanho}</TableCell>
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
