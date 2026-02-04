import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { comparePassword, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, senha } = await request.json();

        if (!email || !senha) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuário
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user || !user.ativo) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Verificar senha
        const senhaValida = await comparePassword(senha, user.senha);
        if (!senhaValida) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Criar sessão
        await setAuthCookie({
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            unidadeId: user.unidadeId,
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                unidadeId: user.unidadeId,
            },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json(
            { error: 'Erro ao processar login' },
            { status: 500 }
        );
    }
}
