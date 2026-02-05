
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Dynamic import to ensure env vars are loaded
async function checkData() {
    const { db } = await import("@/lib/db");
    const { tiposGas, unidadesMedida } = await import("@/lib/db/schema");

    console.log("--- TIPOS DE GÁS ---");
    const gases = await db.select().from(tiposGas);
    console.table(gases.map(g => ({ id: g.id, nome: g.nome, tipo: g.tipo })));

    console.log("\n--- UNIDADES DE MEDIDA ---");
    const units = await db.select().from(unidadesMedida);
    console.table(units.map(u => ({ id: u.id, nome: u.nome, sigla: u.sigla, ordem: u.ordem })));
}

checkData()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
