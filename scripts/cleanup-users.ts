
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { notInArray } from 'drizzle-orm';

const ALLOWED_EMAILS = [
    'vendaschapeco@maqgases.com.br',
    'rosangela@maqgases.com.br',
    'ivan@maqgases.com.br',
    'vendascaxiasdosul@maqgases.com.br',
    'vendas@maqgases.com.br',
    'financeiro@maqgases.com.br',
    'admin@maqgases.com.br'
];

async function cleanup() {
    console.log('🧹 Iniciando limpeza de usuários...');

    try {
        const deleted = await db.delete(users)
            .where(notInArray(users.email, ALLOWED_EMAILS))
            .returning({ email: users.email });

        if (deleted.length > 0) {
            console.log('❌ Usuários removidos:');
            deleted.forEach(u => console.log(` - ${u.email}`));
        } else {
            console.log('✅ Nenhum usuário inválido encontrado.');
        }
    } catch (error) {
        console.error('Erro na limpeza:', error);
    }
}

cleanup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
