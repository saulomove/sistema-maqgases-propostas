'use server';

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';

export async function createUser(data: { nome: string; email: string; senha?: string; role: 'superadmin' | 'unidade'; unidadeId?: number }) {
    const hashedPassword = await bcrypt.hash(data.senha || 'senha123', 10);

    await db.insert(users).values({
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        role: data.role,
        unidadeId: data.unidadeId || null
    });
    revalidatePath('/dashboard/admin/usuarios');
}

export async function updateUser(id: number, data: { nome: string; email: string; role: 'superadmin' | 'unidade'; unidadeId?: number | null; senha?: string }) {
    const updateData: any = {
        nome: data.nome,
        email: data.email,
        role: data.role,
        unidadeId: data.unidadeId
    };
    if (data.senha) {
        updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    revalidatePath('/dashboard/admin/usuarios');
}

export async function deleteUser(id: number) {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/dashboard/admin/usuarios');
}
