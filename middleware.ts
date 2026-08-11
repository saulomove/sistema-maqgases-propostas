import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/login'];
const protectedPaths = ['/dashboard'];

// Must match the secret used in lib/auth.ts (Node)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Permitir acesso a rotas públicas
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // O middleware cuida apenas da AUTENTICAÇÃO (tem sessão válida?).
    // A AUTORIZAÇÃO por papel fica nas próprias páginas e Server Actions,
    // que têm acesso ao banco e cobrem também as chamadas que não passam por aqui.
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        const token = request.cookies.get('maqgases_auth_token')?.value;

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Use jose for Edge-compatible verification
            await jwtVerify(token, encodedSecret);
        } catch {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
