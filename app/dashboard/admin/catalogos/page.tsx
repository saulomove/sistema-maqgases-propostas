import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { GasTypesTable } from "./components/gas-types-table";
import { CapacitiesTable } from "./components/capacities-table";
import { UnitMeasuresTable } from "./components/unit-measures-table";
import { PaymentTermsTable } from "./components/payment-terms-table";

export default async function AdminCatalogosPage() {
    // Fetch all data
    const [gasList, capacityList, unitList, paymentList] = await Promise.all([
        db.select().from(tiposGas).orderBy(asc(tiposGas.ordem)),
        db.select().from(capacidades).orderBy(asc(capacidades.ordem)),
        db.select().from(unidadesMedida).orderBy(asc(unidadesMedida.ordem)),
        db.select().from(condicoesPagamento).orderBy(asc(condicoesPagamento.ordem)),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciamento de Catálogos</h1>
                <p className="text-muted-foreground">Configure as opções disponíveis para criação de propostas.</p>
            </div>

            <Tabs defaultValue="gases" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="gases">Tipos de Gás</TabsTrigger>
                    <TabsTrigger value="capacidades">Capacidades</TabsTrigger>
                    <TabsTrigger value="unidades">Unidades Medida</TabsTrigger>
                    <TabsTrigger value="pagamento">Condições Pagto</TabsTrigger>
                </TabsList>

                <TabsContent value="gases">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle>Tipos de Gás</CardTitle>
                                <CardDescription>Gases disponíveis para seleção (Cilindros ou Líquidos)</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <GasTypesTable initialData={gasList} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="capacidades">
                    <Card>
                        <CardHeader>
                            <CardTitle>Capacidades</CardTitle>
                            <CardDescription>Opções de tamanho/volume dos cilindros</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CapacitiesTable initialData={capacityList} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="unidades">
                    <Card>
                        <CardHeader>
                            <CardTitle>Unidades de Medida</CardTitle>
                            <CardDescription>Unidades para quantificar os itens (m³, kg, un, etc)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UnitMeasuresTable initialData={unitList} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pagamento">
                    <Card>
                        <CardHeader>
                            <CardTitle>Condições de Pagamento</CardTitle>
                            <CardDescription>Prazos e formas de pagamento padrão</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentTermsTable initialData={paymentList} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
