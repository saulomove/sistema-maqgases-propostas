import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import type { SessionUser } from '@/lib/permissions';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_NAME = 'maqgases_auth_token';

/**
 * Conteúdo do JWT. Serve apenas para identificar quem é o usuário —
 * papel, escopo e status são sempre lidos do banco em `getCurrentUser`,
 * para que mudanças de permissão valham na hora e não só no próximo login.
 */
export interface UserPayload {
    id: number;
    nome: string;
    email: string;
}

export type { SessionUser };

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
        return null;
    }
}

export async function setAuthCookie(payload: UserPayload) {
    const token = generateToken(payload);
    const cookieStore = await cookies();

    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in localhost
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
    });
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME);
    return token?.value || null;
}

/**
 * Usuário da requisição atual, com papel e escopo lidos do banco.
 *
 * Devolve null se o token for inválido, o usuário não existir mais ou
 * estiver desativado — assim desativar alguém encerra o acesso na hora,
 * sem esperar o token de 7 dias expirar.
 *
 * `cache` do React deduplica a consulta dentro da mesma requisição.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const [user] = await db
        .select({
            id: users.id,
            nome: users.nome,
            email: users.email,
            role: users.role,
            escopoVisibilidade: users.escopoVisibilidade,
            unidadeId: users.unidadeId,
            ativo: users.ativo,
        })
        .from(users)
        .where(eq(users.id, payload.id))
        .limit(1);

    if (!user || !user.ativo) return null;

    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        escopoVisibilidade: user.escopoVisibilidade,
        unidadeId: user.unidadeId,
    };
});

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
}

export function requireSuperAdmin(user: SessionUser | null): boolean {
    return user?.role === 'superadmin';
}

export function requireAuth(user: SessionUser | null): boolean {
    return user !== null;
}
