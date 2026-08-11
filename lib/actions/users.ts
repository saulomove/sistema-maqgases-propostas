'use server';

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';
import { getCurrentUser } from "@/lib/auth";
import {
    assignableRoles,
    canDeleteUser,
    canManageUser,
    canManageUsers,
    type EscopoVisibilidade,
    type UserRole,
} from "@/lib/permissions";

export interface ActionResult {
    success?: true;
    error?: string;
}

const ESCOPOS: EscopoVisibilidade[] = ['proprias', 'unidade', 'todas'];

/**
 * Regras de consistência entre papel, escopo e unidade.
 * Server Actions são endpoints HTTP próprios: tudo que chega aqui precisa
 * ser validado, independentemente do que a interface permite escolher.
 */
function validarDados(role: UserRole, escopo: EscopoVisibilidade, unidadeId: number | null): string | null {
    if (!ESCOPOS.includes(escopo)) {
        return 'Escopo de visibilidade inválido.';
    }
    if (role === 'unidade' && unidadeId === null) {
        return 'Usuários de unidade precisam estar vinculados a uma filial.';
    }
    if (escopo === 'unidade' && unidadeId === null) {
        return 'Para ver "todas as propostas da unidade" é preciso vincular o usuário a uma filial.';
    }
    return null;
}

export async function createUser(data: {
    nome: string;
    email: string;
    senha?: string;
    role: UserRole;
    escopoVisibilidade: EscopoVisibilidade;
    unidadeId?: number | null;
}): Promise<ActionResult> {
    const actor = await getCurrentUser();
    if (!canManageUsers(actor)) {
        return { error: 'Sem permissão para gerenciar usuários.' };
    }
    if (!assignableRoles(actor).includes(data.role)) {
        return { error: 'Você não pode atribuir esse nível de acesso.' };
    }

    const unidadeId = data.unidadeId ?? null;
    const erro = validarDados(data.role, data.escopoVisibilidade, unidadeId);
    if (erro) return { error: erro };

    if (!data.senha) {
        return { error: 'Informe uma senha para o novo usuário.' };
    }

    const email = data.email.trim().toLowerCase();
    const [existente] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existente) {
        return { error: 'Já existe um usuário com esse e-mail.' };
    }

    await db.insert(users).values({
        nome: data.nome.trim(),
        email,
        senha: await bcrypt.hash(data.senha, 10),
        role: data.role,
        escopoVisibilidade: data.escopoVisibilidade,
        unidadeId,
    });

    revalidatePath('/dashboard/admin/usuarios');
    return { success: true };
}

export async function updateUser(id: number, data: {
    nome: string;
    email: string;
    role: UserRole;
    escopoVisibilidade: EscopoVisibilidade;
    unidadeId?: number | null;
    senha?: string;
}): Promise<ActionResult> {
    const actor = await getCurrentUser();
    if (!canManageUsers(actor)) {
        return { error: 'Sem permissão para gerenciar usuários.' };
    }

    const [alvo] = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

    if (!alvo) return { error: 'Usuário não encontrado.' };

    // Precisa poder mexer em quem o usuário é HOJE e em quem ele passará a ser,
    // senão um admin promoveria alguém a superadmin por tabela.
    if (!canManageUser(actor, alvo)) {
        return { error: 'Você não pode editar esse usuário.' };
    }
    if (!assignableRoles(actor).includes(data.role)) {
        return { error: 'Você não pode atribuir esse nível de acesso.' };
    }

    const unidadeId = data.unidadeId ?? null;
    const erro = validarDados(data.role, data.escopoVisibilidade, unidadeId);
    if (erro) return { error: erro };

    const email = data.email.trim().toLowerCase();
    const [existente] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existente && existente.id !== id) {
        return { error: 'Já existe um usuário com esse e-mail.' };
    }

    const updateData: Record<string, unknown> = {
        nome: data.nome.trim(),
        email,
        role: data.role,
        escopoVisibilidade: data.escopoVisibilidade,
        unidadeId,
    };
    if (data.senha) {
        updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    revalidatePath('/dashboard/admin/usuarios');
    revalidatePath('/dashboard/propostas');
    return { success: true };
}

export async function deleteUser(id: number): Promise<ActionResult> {
    const actor = await getCurrentUser();
    if (!canManageUsers(actor)) {
        return { error: 'Sem permissão para gerenciar usuários.' };
    }

    const [alvo] = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

    if (!alvo) return { error: 'Usuário não encontrado.' };

    if (!canDeleteUser(actor, alvo)) {
        return {
            error: actor!.id === alvo.id
                ? 'Você não pode excluir a própria conta.'
                : 'Você não pode excluir esse usuário.',
        };
    }

    try {
        await db.delete(users).where(eq(users.id, id));
    } catch {
        // Propostas referenciam o usuário que as criou
        return { error: 'Esse usuário possui propostas vinculadas e não pode ser excluído. Desative-o.' };
    }

    revalidatePath('/dashboard/admin/usuarios');
    return { success: true };
}

/** Ativa ou desativa o acesso sem apagar o histórico de propostas. */
export async function setUserAtivo(id: number, ativo: boolean): Promise<ActionResult> {
    const actor = await getCurrentUser();
    if (!canManageUsers(actor)) {
        return { error: 'Sem permissão para gerenciar usuários.' };
    }

    const [alvo] = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

    if (!alvo) return { error: 'Usuário não encontrado.' };
    if (!canManageUser(actor, alvo)) {
        return { error: 'Você não pode editar esse usuário.' };
    }
    if (actor!.id === alvo.id && !ativo) {
        return { error: 'Você não pode desativar a própria conta.' };
    }

    await db.update(users).set({ ativo }).where(eq(users.id, id));

    revalidatePath('/dashboard/admin/usuarios');
    return { success: true };
}
