'use server';

import { db } from "@/lib/db";
import { tiposGas, capacidades, unidadesMedida, condicoesPagamento } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { canManageCatalogos } from "@/lib/permissions";

/**
 * Server Actions são endpoints HTTP próprios — o middleware protege apenas as
 * páginas, então cada ação precisa verificar a permissão por conta própria.
 */
async function assertCanManageCatalogos() {
    const user = await getCurrentUser();
    if (!canManageCatalogos(user)) {
        throw new Error('Sem permissão para alterar catálogos.');
    }
}

// --- TIPOS DE GÁS ---
export async function createGasType(data: { nome: string; tipo: 'cilindro' | 'liquido' | 'ambos'; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.insert(tiposGas).values({
        nome: data.nome,
        tipo: data.tipo,
        ordem: data.ordem || 0
    });
    revalidatePath('/dashboard/admin/catalogos');
    revalidatePath('/dashboard/propostas/nova');
}

export async function updateGasType(id: number, data: { nome: string; tipo: 'cilindro' | 'liquido' | 'ambos'; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.update(tiposGas).set({
        nome: data.nome,
        tipo: data.tipo,
        ordem: data.ordem
    }).where(eq(tiposGas.id, id));
    revalidatePath('/dashboard/admin/catalogos');
    revalidatePath('/dashboard/propostas/nova');
}

export async function deleteGasType(id: number) {
    await assertCanManageCatalogos();
    await db.delete(tiposGas).where(eq(tiposGas.id, id));
    revalidatePath('/dashboard/admin/catalogos');
    revalidatePath('/dashboard/propostas/nova');
}


// --- CAPACIDADES ---
export async function createCapacity(data: { tamanho: string; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.insert(capacidades).values({
        tamanho: data.tamanho,
        ordem: data.ordem || 0
    });
    revalidatePath('/dashboard/admin/catalogos');
}

export async function updateCapacity(id: number, data: { tamanho: string; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.update(capacidades).set({
        tamanho: data.tamanho,
        ordem: data.ordem
    }).where(eq(capacidades.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}

export async function deleteCapacity(id: number) {
    await assertCanManageCatalogos();
    await db.delete(capacidades).where(eq(capacidades.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}


// --- UNIDADES DE MEDIDA ---
export async function createUnitMeasure(data: { nome: string; sigla: string; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.insert(unidadesMedida).values({
        nome: data.nome,
        sigla: data.sigla,
        ordem: data.ordem || 0
    });
    revalidatePath('/dashboard/admin/catalogos');
}

export async function updateUnitMeasure(id: number, data: { nome: string; sigla: string; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.update(unidadesMedida).set({
        nome: data.nome,
        sigla: data.sigla,
        ordem: data.ordem
    }).where(eq(unidadesMedida.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}

export async function deleteUnitMeasure(id: number) {
    await assertCanManageCatalogos();
    await db.delete(unidadesMedida).where(eq(unidadesMedida.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}


// --- CONDIÇÕES DE PAGAMENTO ---
export async function createPaymentTerm(data: { descricao: string; dias: number; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.insert(condicoesPagamento).values({
        descricao: data.descricao,
        dias: data.dias,
        ordem: data.ordem || 0
    });
    revalidatePath('/dashboard/admin/catalogos');
}

export async function updatePaymentTerm(id: number, data: { descricao: string; dias: number; ordem?: number }) {
    await assertCanManageCatalogos();
    await db.update(condicoesPagamento).set({
        descricao: data.descricao,
        dias: data.dias,
        ordem: data.ordem
    }).where(eq(condicoesPagamento.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}

export async function deletePaymentTerm(id: number) {
    await assertCanManageCatalogos();
    await db.delete(condicoesPagamento).where(eq(condicoesPagamento.id, id));
    revalidatePath('/dashboard/admin/catalogos');
}
