import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_NAME = 'maqgases_auth_token';

export interface UserPayload {
    id: number;
    nome: string;
    email: string;
    role: 'superadmin' | 'unidade';
    unidadeId: number | null;
}

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
        secure: false, // Force false for localhost debugging
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

export async function getCurrentUser(): Promise<UserPayload | null> {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
}

export function requireSuperAdmin(user: UserPayload | null): boolean {
    return user?.role === 'superadmin';
}

export function requireAuth(user: UserPayload | null): boolean {
    return user !== null;
}
