import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { PlusCircle, Search, FileText } from 'lucide-react';
import { ProposalActions } from '@/components/proposals/proposal-actions';
import { db } from '@/lib/db';
import { propostas } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export default async function PropostasPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    // Buscar propostas (filtrar por unidade se não for superadmin)
    // Nota: Em uma app real, isso deveria ser uma Server Action ou API com paginação
    // Por simplicidade, buscando tudo e deixando o Drizzle otimizar

    let query = db.select().from(propostas).orderBy(desc(propostas.createdAt));

    if (user.role !== 'superadmin' && user.unidadeId) {
        // @ts-ignore - Drizzle query builder types can be tricky with conditionals
        query = query.where(eq(propostas.unidadeId, user.unidadeId));
    }

    // Executa query
    const propostasList = await query;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Propostas</h1>
                    <p className="text-muted-foreground">
                        Gerencie e emita propostas comerciais.
                    </p>
                </div>
                <Link href="/dashboard/propostas/nova">
                    <Button className="w-full md:w-auto gap-2 shadow-primary">
                        <PlusCircle size={16} />
                        Nova Proposta
                    </Button>
                </Link>
            </div>

            <Card className="border-none shadow-soft">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Histórico de Propostas</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por cliente ou número..."
                                className="pl-8 bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {propostasList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-gray-900">Nenhuma proposta encontrada</h3>
                                <p className="mb-4">Crie sua primeira proposta comercial agora mesmo.</p>
                                <Link href="/dashboard/propostas/nova">
                                    <Button variant="outline" className="gap-2">
                                        <PlusCircle size={16} />
                                        Criar Proposta
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                                        <TableHead>Número</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {propostasList.map((proposta) => (
                                        <TableRow key={proposta.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-primary">
                                                {proposta.numero}
                                            </TableCell>
                                            <TableCell>{proposta.clienteNome}</TableCell>
                                            <TableCell>
                                                <Badge variant={proposta.tipo === 'cilindro' ? 'default' : 'secondary'} className="capitalize">
                                                    {proposta.tipo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(proposta.createdAt).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                {Number(proposta.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    proposta.status === 'enviada' ? 'success' :
                                                        proposta.status === 'gerada' ? 'warning' : 'outline'
                                                } className="capitalize">
                                                    {proposta.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ProposalActions proposalId={proposta.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
