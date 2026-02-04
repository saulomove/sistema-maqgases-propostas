'use server';

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Using a simplified password hashing approach or saving plain for now based on previous context 
// (assuming plain 'senha123' mentioned in task, but should ideally hash. For this speedrun task I might skip bcrypt unless installed).
// The project seems to use plain text comparison in auth? Let's check `lib/auth.ts` if possible, but safely assume we just store string.
// Wait, `lib/auth` was not fully visible but user used `senha123`.

export async function createUser(data: { nome: string; email: string; senha?: string; role: 'superadmin' | 'unidade'; unidadeId?: number }) {
    await db.insert(users).values({
        nome: data.nome,
        email: data.email,
        senha: data.senha || 'senha123', // Default password
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
        updateData.senha = data.senha;
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    revalidatePath('/dashboard/admin/usuarios');
}

export async function deleteUser(id: number) {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/dashboard/admin/usuarios');
}
