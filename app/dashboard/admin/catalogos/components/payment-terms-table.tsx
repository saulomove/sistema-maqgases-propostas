'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { createPaymentTerm, updatePaymentTerm, deletePaymentTerm } from "@/lib/actions/catalogos";
import { toast } from "sonner";

interface PaymentTerm {
    id: number;
    descricao: string;
    dias: number;
    ordem: number | null;
}

export function PaymentTermsTable({ initialData }: { initialData: PaymentTerm[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ descricao: '', dias: 0, ordem: 0 });

    const handleEdit = (item: PaymentTerm) => {
        setEditingId(item.id);
        setFormData({ descricao: item.descricao, dias: item.dias, ordem: item.ordem || 0 });
        setIsCreating(false);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({ descricao: '', dias: 0, ordem: (Math.max(...initialData.map(d => d.ordem || 0), 0) + 1) });
    };

    const handleSave = async () => {
        try {
            if (isCreating) {
                await createPaymentTerm(formData);
                toast.success('Condição criada!');
            } else if (editingId) {
                await updatePaymentTerm(editingId, formData);
                toast.success('Condição atualizada!');
            }
            setEditingId(null);
            setIsCreating(false);
        } catch (error) { toast.error('Erro ao salvar.'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este item?')) return;
        try { await deletePaymentTerm(id); toast.success('Excluído.'); } catch (e) { toast.error('Erro.'); }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                {!isCreating && <Button onClick={handleCreate} size="sm"><Plus className="mr-2 h-4 w-4" /> Nova Condição</Button>}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Ordem</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Dias para Vencimento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isCreating && (
                        <TableRow className="bg-muted/50">
                            <TableCell><Input type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: +e.target.value })} className="w-16 h-8" /></TableCell>
                            <TableCell><Input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Ex: 30 dias" className="h-8" autoFocus /></TableCell>
                            <TableCell><Input type="number" value={formData.dias} onChange={e => setFormData({ ...formData, dias: +e.target.value })} className="w-24 h-8" /></TableCell>
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
                                    <TableCell><Input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="h-8" /></TableCell>
                                    <TableCell><Input type="number" value={formData.dias} onChange={e => setFormData({ ...formData, dias: +e.target.value })} className="w-24 h-8" /></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Save size={16} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-red-600"><X size={16} /></Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.ordem}</TableCell>
                                    <TableCell>{item.descricao}</TableCell>
                                    <TableCell>{item.dias} dias</TableCell>
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
