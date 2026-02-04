import { db } from "@/lib/db";
import { propostas, propostaItens, tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import Link from "next/link";

export default async function VisualizarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const { id } = await params;
    const proposalId = parseInt(id);
    if (isNaN(proposalId)) notFound();

    // Fetch Proposal
    const [proposal] = await db.select().from(propostas).where(eq(propostas.id, proposalId));
    if (!proposal) notFound();

    // Check permissions
    if (user.role !== 'superadmin' && proposal.unidadeId !== user.unidadeId) {
        redirect('/dashboard/propostas');
    }

    // Fetch Items with details
    // We need to join manually or just fetch IDs and match with catalogs like in Wizard
    // For "Visualizar", checking against catalogs ensures we show names even if they changed?
    // Actually, `propostaItens` stores names too? No, looks like it stores IDs based on wizard logic.
    // Wait, let me check the wizard `items.map`. It stores IDs in database.
    // BUT `api/propostas/[id]/pdf` route logic fetched names from `propostaItens` directly??
    // Let's check `api/propostas/[id]/pdf/route.ts`...
    // It says: `// I will use the propostaItens table which DOES have names saved!`
    // That means `propostaItens` schema has name columns.

    // Let's verify schema first to be safe, but assuming `pdf/route.ts` is correct, we can rely on saved names.
    // Actually, let's fetch catalogs to be consisten with edit/nova pages for now OR check schema.
    // Checking schema is safer.

    const items = await db.select().from(propostaItens).where(eq(propostaItens.propostaId, proposalId));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/propostas">
                        <Button variant="outline" size="icon">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Proposta {proposal.numero}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={proposal.status === 'gerada' ? 'warning' : 'success'}>
                                {proposal.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Generated on {new Date(proposal.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/propostas/${proposalId}/editar`}>
                        <Button variant="outline" className="gap-2">
                            <Pencil size={16} />
                            Editar
                        </Button>
                    </Link>
                    <Link href={`/api/propostas/${proposalId}/pdf`} target="_blank">
                        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                            <Download size={16} />
                            Baixar PDF
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">{proposal.clienteNome}</p>
                        <p className="text-sm text-muted-foreground">{proposal.clienteLocalEntrega}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Detalhes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="font-medium capitalize">{proposal.tipo}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold text-green-600">
                                {Number(proposal.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {proposal.locacaoAtiva && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Locação de Cilindros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-md border">
                            <span>{proposal.locacaoQuantidade} cilindros x {Number(proposal.locacaoValorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <span className="font-bold">{Number(proposal.locacaoValorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Itens da Proposta</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Capacidade</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Valor Unit.</TableHead>
                                <TableHead>Condição Pagto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.tipoGasNome}</TableCell>
                                    <TableCell>{item.capacidadeTexto || '-'}</TableCell>
                                    <TableCell>{item.unidadeMedidaNome}</TableCell>
                                    <TableCell>{Number(item.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{item.condicaoPagamentoDescricao}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
