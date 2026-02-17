"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    ChevronRight,
    ChevronLeft,
    Trash2,
    Plus,
    Copy,
    Droplets, // Liquido
    CheckCircle2,
    AlertCircle,
    ChevronDown
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"

// Types
type GasType = { id: number; nome: string; tipo: string }
type Capacity = { id: number; tamanho: string }
type UnitMeasure = { id: number; nome: string }
type PaymentTerm = { id: number; descricao: string }

interface ProposalWizardProps {
    gasTypes: GasType[]
    capacities: Capacity[]
    unitMeasures: UnitMeasure[]
    paymentTerms: PaymentTerm[]
    userId: number
    unidadeId: number
    initialData?: {
        id: number
        tipo: "cilindro" | "liquido"
        clienteNome: string
        clienteLocalEntrega: string
        locacaoAtiva: boolean
        locacaoQuantidade: number | null
        locacaoValorUnitario: number | null
        freteValor: number | null // LEGACY: keep for types, but unused in new UI
        items: any[]
    }
}

type ProposalItem = {
    id: string // temporary frontend ID
    tipoGasId: string
    capacidadeId: string // legacy, keep for Type compat
    capacidadeIds: string[] // NEW: Multi-select support
    unidadeMedidaId: string
    valorUnitario: string
    freteValor: string // NEW: Item level freight
    condicaoPagamentoId: string
}

export function ProposalWizard({
    gasTypes,
    capacities,
    unitMeasures,
    paymentTerms,
    initialData
}: ProposalWizardProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form State
    const [type, setType] = useState<"cilindro" | "liquido" | null>(initialData?.tipo || null)

    const [clientData, setClientData] = useState({
        nome: initialData?.clienteNome || "",
        localEntrega: initialData?.clienteLocalEntrega || "",
    })

    // Locação (Cilindro e Liquido)
    const [locacao, setLocacao] = useState({
        enabled: initialData?.locacaoAtiva || false,
        quantidade: initialData?.locacaoQuantidade?.toString() || "",
        valorUnitario: initialData?.locacaoValorUnitario?.toString() || "",
    })



    // const [frete, setFrete] = useState(initialData?.freteValor?.toString() || "0") // DEPRECATED GLOBAL

    const [items, setItems] = useState<ProposalItem[]>(() => {
        if (!initialData?.items) return []
        return initialData.items.map((item: any) => ({
            id: crypto.randomUUID(),
            tipoGasId: item.tipoGasId.toString(),
            capacidadeId: item.capacidadeId?.toString() || "",
            capacidadeIds: item.capacidadeId ? [item.capacidadeId.toString()] : [], // Init from legacy
            unidadeMedidaId: item.unidadeMedidaId.toString(),
            valorUnitario: item.valorUnitario.toString(),

            freteValor: item.freteValor ? item.freteValor.toString() : "0",
            condicaoPagamentoId: item.condicaoPagamentoId.toString()
        }))
    })

    // Computed
    const locacaoTotal = locacao.enabled
        ? (Number(locacao.quantidade) || 0) * (Number(locacao.valorUnitario) || 0)
        : 0

    // ACTIONS
    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                tipoGasId: "",
                capacidadeId: "",
                capacidadeIds: [],
                unidadeMedidaId: "",
                valorUnitario: "",

                freteValor: "0",
                condicaoPagamentoId: ""
            }
        ])
    }

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleDuplicateItem = (item: ProposalItem) => {
        setItems([...items, { ...item, id: crypto.randomUUID() }])
    }

    const handleUpdateItem = (id: string, field: keyof ProposalItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
    }

    const handleToggleCapacity = (itemId: string, capId: string) => {
        setItems(items.map(item => {
            if (item.id !== itemId) return item;

            const currentIds = item.capacidadeIds || [];
            const newIds = currentIds.includes(capId)
                ? currentIds.filter(id => id !== capId)
                : [...currentIds, capId];

            return { ...item, capacidadeIds: newIds };
        }));
    }

    // NAVIGATION
    const nextStep = () => {
        if (step === 1 && !type) return setError("Selecione um tipo de proposta")
        if (step === 2 && (!clientData.nome || !clientData.localEntrega)) return setError("Preencha os dados do cliente")
        if (step === 3 && items.length === 0) return setError("Adicione pelo menos um item")
        // Validation for items
        if (step === 3) {
            for (const item of items) {
                if (!item.tipoGasId || !item.unidadeMedidaId || !item.valorUnitario || !item.condicaoPagamentoId) {
                    return setError("Preencha todos os campos obrigatórios dos itens")
                }
                if (type === "cilindro" && (!item.capacidadeIds || item.capacidadeIds.length === 0)) {
                    return setError("Selecione pelo menos uma capacidade para os itens de cilindro")
                }
            }
            // Mandatory Rental Validation
            if (locacao.enabled && (!locacao.quantidade || !locacao.valorUnitario)) {
                return setError("Preencha os dados da locação")
            }
            // Liquid Mandatory Rental 
            if (type === "liquido") {
                if (!locacao.enabled) return setError("Para gases líquidos, a locação de tanque/telemetria é obrigatória.");
                if (!locacao.quantidade || !locacao.valorUnitario) return setError("Preencha os valores de locação do tanque.");
            }
        }

        setError("")
        setStep(step + 1)
    }

    const prevStep = () => setStep(step - 1)

    const handleSubmit = async () => {
        setLoading(true)
        setError("") // Clear previous errors

        try {
            const payload = {
                tipo: type,
                clienteNome: clientData.nome,
                clienteLocalEntrega: clientData.localEntrega,
                locacaoAtiva: locacao.enabled,
                locacaoQuantidade: locacao.enabled ? Number(locacao.quantidade) : null,
                locacaoValorUnitario: locacao.enabled ? Number(locacao.valorUnitario) : null,
                locacaoValorTotal: locacaoTotal,

                freteValor: items.reduce((acc, item) => acc + (Number(item.freteValor) || 0), 0), // Sum of item freights
                itens: items.map(item => ({
                    tipoGasId: Number(item.tipoGasId),
                    capacidadeId: item.capacidadeIds.length > 0 ? Number(item.capacidadeIds[0]) : null, // Primary Ref
                    capacidadeIds: item.capacidadeIds, // Send the list
                    unidadeMedidaId: Number(item.unidadeMedidaId),
                    valorUnitario: Number(item.valorUnitario),
                    freteValor: Number(item.freteValor || 0),
                    condicaoPagamentoId: Number(item.condicaoPagamentoId)
                }))
            }

            const url = initialData?.id
                ? `/api/propostas/${initialData.id}`
                : '/api/propostas';

            const method = initialData?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Falha ao salvar proposta')
            }

            const data = await res.json()

            // Redirect to list with success parameter
            const successMsg = initialData?.id ? 'Proposta atualizada com sucesso' : 'Proposta criada com sucesso';
            router.push(`/dashboard/propostas`)

        } catch (err: any) {
            console.error(err)
            setError(err.message || "Erro ao salvar proposta. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    // RENDER STEPS
    const renderStepIcon = (s: number, icon: React.ReactNode) => {
        const isActive = step >= s
        return (
            <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
            )}>
                {icon}
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }} />

                <div className="bg-slate-50 px-2">{renderStepIcon(1, "1")}</div>
                <div className="bg-slate-50 px-2">{renderStepIcon(2, "2")}</div>
                <div className="bg-slate-50 px-2">{renderStepIcon(3, "3")}</div>
                <div className="bg-slate-50 px-2">{renderStepIcon(4, "4")}</div>
            </div>

            <Card className="border-none shadow-medium">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Selecione o Tipo de Proposta"}
                        {step === 2 && "Dados do Cliente"}
                        {step === 3 && "Itens da Proposta"}
                        {step === 4 && "Revisão Final"}
                    </CardTitle>
                    <CardDescription>
                        Passo {step} de 4
                    </CardDescription>
                </CardHeader>

                <CardContent className="min-h-[300px]">
                    {error && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* STEP 1: TYPE */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <button
                                onClick={() => setType("cilindro")}
                                className={cn(
                                    "p-8 border-2 rounded-xl flex flex-col items-center gap-4 transition-all hover:border-primary hover:bg-slate-50",
                                    type === "cilindro" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-slate-200"
                                )}
                            >
                                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {/* Icone cilindro */}
                                    <div className="border-2 border-current h-12 w-6 rounded-t-full rounded-b-sm" />
                                </div>
                                <h3 className="text-xl font-bold">Gases em Cilindro</h3>
                                <p className="text-center text-muted-foreground text-sm">
                                    Para fornecimento de gases comprimidos em cilindros de alta pressão
                                </p>
                            </button>

                            <button
                                onClick={() => setType("liquido")}
                                className={cn(
                                    "p-8 border-2 rounded-xl flex flex-col items-center gap-4 transition-all hover:border-primary hover:bg-slate-50",
                                    type === "liquido" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-slate-200"
                                )}
                            >
                                <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                    <Droplets size={32} />
                                </div>
                                <h3 className="text-xl font-bold">Gases Líquidos</h3>
                                <p className="text-center text-muted-foreground text-sm">
                                    Para fornecimento granel em tanques criogênicos (Líquido)
                                </p>
                            </button>
                        </div>
                    )}

                    {/* STEP 2: CLIENT */}
                    {step === 2 && (
                        <div className="space-y-4 max-w-lg mx-auto mt-4">
                            <div className="space-y-2">
                                <Label>Nome do Cliente / Razão Social</Label>
                                <Input
                                    value={clientData.nome}
                                    onChange={(e) => setClientData({ ...clientData, nome: e.target.value })}
                                    placeholder="Ex: Indústria Metalúrgica ABC Ltda"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Local de Entrega (Cidade/UF)</Label>
                                <Input
                                    value={clientData.localEntrega}
                                    onChange={(e) => setClientData({ ...clientData, localEntrega: e.target.value })}
                                    placeholder="Ex: Chapecó/SC"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ITEMS */}
                    {step === 3 && (
                        <div className="space-y-8">

                            {/* Locação (Cilindro e Liquido) */}
                            {(type === "cilindro" || type === "liquido") && (
                                <div className={cn("p-4 border rounded-lg space-y-4", type === "liquido" ? "bg-cyan-50 border-cyan-200" : "bg-slate-50")}>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="locacao"
                                            checked={locacao.enabled}
                                            onCheckedChange={(c) => setLocacao(prev => ({ ...prev, enabled: c === true }))}
                                            disabled={type === "liquido" && false} // Keep editable, validation handles enforcing
                                        />
                                        <Label htmlFor="locacao" className="text-base font-semibold">
                                            {type === 'liquido'
                                                ? "Incluir Locação de Tanque/Telemetria (Obrigatório)"
                                                : "Incluir Locação de Cilindros Mensal"}
                                        </Label>
                                    </div>

                                    {locacao.enabled && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6 animate-slide-up">
                                            <div className="space-y-2">
                                                <Label>Quantidade</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Qtd"
                                                    value={locacao.quantidade}
                                                    onChange={(e) => setLocacao({ ...locacao, quantidade: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Valor Unitário (R$)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0,00"
                                                    value={locacao.valorUnitario}
                                                    onChange={(e) => setLocacao({ ...locacao, valorUnitario: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Total Locação</Label>
                                                <div className="flex h-10 w-full items-center rounded-md border bg-muted px-3 text-sm font-medium">
                                                    {locacaoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Frete Input GLOBAL REMOVED */}

                            {/* Items Table */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Itens da Proposta</h3>
                                    <Button onClick={handleAddItem} size="sm" className="gap-2">
                                        <Plus size={16} /> Adicionar Item
                                    </Button>
                                </div>

                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-100">
                                            <TableRow>
                                                <TableHead className="w-[200px]">Descrição do Gás</TableHead>
                                                {type === "cilindro" && <TableHead className="w-[120px]">Capacidade</TableHead>}
                                                <TableHead className="w-[120px]">Unid.</TableHead>

                                                <TableHead className="w-[120px]">Preço Unit.</TableHead>
                                                <TableHead className="w-[100px]">Frete (R$)</TableHead>
                                                <TableHead className="w-[200px]">Condição Pagto</TableHead>
                                                <TableHead className="w-[80px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Nenhum item adicionado.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Select value={item.tipoGasId} onValueChange={(v) => handleUpdateItem(item.id, 'tipoGasId', v)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {gasTypes
                                                                    .filter(g => g.tipo === type) // Filter by type
                                                                    .map(g => (
                                                                        <SelectItem key={g.id} value={g.id.toString()}>{g.nome}</SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>

                                                    {type === "cilindro" && (
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="w-full justify-between font-normal">
                                                                        {item.capacidadeIds?.length > 0
                                                                            ? `${item.capacidadeIds.length} selecionado(s)`
                                                                            : "Selecione"}
                                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-56" align="start">
                                                                    <DropdownMenuLabel>Capacidades</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    {capacities.map((c) => (
                                                                        <DropdownMenuCheckboxItem
                                                                            key={c.id}
                                                                            checked={item.capacidadeIds?.includes(c.id.toString())}
                                                                            onCheckedChange={() => handleToggleCapacity(item.id, c.id.toString())}
                                                                        >
                                                                            {c.tamanho}
                                                                        </DropdownMenuCheckboxItem>
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    )}

                                                    <TableCell>
                                                        <Select value={item.unidadeMedidaId} onValueChange={(v) => handleUpdateItem(item.id, 'unidadeMedidaId', v)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="UM" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {unitMeasures
                                                                    .filter(u => {
                                                                        if (type === 'liquido') {
                                                                            // STRICT: Only allow 'Kg' for Liquid
                                                                            return u.nome.trim().toLowerCase() === 'kg';
                                                                        }
                                                                        // For Cylinder, exclude 'm³ comprimido' as requested
                                                                        return u.nome !== 'm³ comprimido';
                                                                    })
                                                                    .map(u => (
                                                                        <SelectItem key={u.id} value={u.id.toString()}>{u.nome}</SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            placeholder="0,00"
                                                            value={item.valorUnitario}
                                                            onChange={(e) => handleUpdateItem(item.id, 'valorUnitario', e.target.value)}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            placeholder="0,00"
                                                            value={item.freteValor}
                                                            onChange={(e) => handleUpdateItem(item.id, 'freteValor', e.target.value)}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Select value={item.condicaoPagamentoId} onValueChange={(v) => handleUpdateItem(item.id, 'condicaoPagamentoId', v)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Condição" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {paymentTerms.map(p => (
                                                                    <SelectItem key={p.id} value={p.id.toString()}>{p.descricao}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => handleDuplicateItem(item)} title="Duplicar">
                                                                <Copy size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: REVIEW */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{clientData.nome}</h3>
                                    <p className="text-muted-foreground">{clientData.localEntrega}</p>
                                    <Badge className="mt-2 capitalize">{type}</Badge>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setStep(2)}>Editar</Button>
                            </div>

                            {locacao.enabled && (
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">{type === 'liquido' ? 'Locação Tanque' : 'Locação Cilindros'}</h4>
                                    <div className="flex justify-between text-sm">
                                        <span>{locacao.quantidade} {type === 'liquido' ? 'un' : 'cilindros'} x {Number(locacao.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        <span className="font-bold">{locacaoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                </div>
                            )}

                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Preço Unit.</TableHead>
                                            <TableHead>Frete</TableHead>
                                            <TableHead>Pagamento</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, i) => {
                                            const gas = gasTypes.find(g => g.id.toString() === item.tipoGasId);
                                            // Multi-select display
                                            const selectedCaps = item.capacidadeIds?.map(id => capacities.find(c => c.id.toString() === id)?.tamanho).filter(Boolean).join(", ");
                                            const um = unitMeasures.find(u => u.id.toString() === item.unidadeMedidaId);
                                            const pagto = paymentTerms.find(p => p.id.toString() === item.condicaoPagamentoId);

                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        {gas?.nome}
                                                        {type === 'cilindro' && selectedCaps && <span className="text-muted-foreground ml-1">({selectedCaps})</span>}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Number(item.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {um?.nome}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Number(item.freteValor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </TableCell>
                                                    <TableCell>{pagto?.descricao}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                        <ChevronLeft size={16} className="mr-2" />
                        Voltar
                    </Button>

                    {step < 4 ? (
                        <Button onClick={nextStep}>
                            Próximo
                            <ChevronRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle2 size={16} className="mr-2" />
                            {initialData ? 'Salvar Alterações' : 'Gerar Proposta e PDF'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
