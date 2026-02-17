
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../lib/db';
import { unidadesMedida } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function removeUnit() {
    console.log('🧹 Removendo "m³ comprimido"...');

    try {
        const deleted = await db.delete(unidadesMedida)
            .where(eq(unidadesMedida.nome, 'm³ comprimido'))
            .returning({ nome: unidadesMedida.nome });

        if (deleted.length > 0) {
            console.log('✅ Unidade removida:', deleted[0].nome);
        } else {
            console.log('ℹ️ Unidade não encontrada ou já removida.');
        }
    } catch (error) {
        console.error('Erro na remoção:', error);
    }
}

removeUnit()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
