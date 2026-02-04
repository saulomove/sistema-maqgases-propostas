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

    // Verificar autenticação para rotas protegidas
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        const token = request.cookies.get('maqgases_auth_token')?.value;

        console.log(`[Middleware] Accessing ${pathname}`);
        console.log(`[Middleware] Token found: ${!!token}`);

        if (!token) {
            console.log('[Middleware] No token, redirecting to login');
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Use jose for Edge-compatible verification
            const { payload } = await jwtVerify(token, encodedSecret);
            const user = payload as any; // Cast generic payload

            console.log(`[Middleware] Token valid, user role: ${user.role}`);

            // Verificar acesso a rotas de admin
            if (pathname.startsWith('/dashboard/admin') && user.role !== 'superadmin') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (error) {
            console.error('[Middleware] Invalid token:', error);
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
