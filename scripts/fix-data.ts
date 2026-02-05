
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { eq, inArray } from 'drizzle-orm';

async function fixData() {
    const { db } = await import("@/lib/db");
    const { tiposGas, unidadesMedida } = await import("@/lib/db/schema");

    console.log("🔧 Fixing Data...");

    // 1. Fix CO2 to be Liquid
    console.log("Updating DIÓXIDO DE CARBONO to liquido...");
    await db.update(tiposGas)
        .set({ tipo: 'liquido' })
        .where(eq(tiposGas.nome, 'DIÓXIDO DE CARBONO'));

    // 2. Remove unwanted units
    console.log("Removing unwanted units (m³ comprimido, Unidade, Cilindro)...");
    await db.delete(unidadesMedida)
        .where(inArray(unidadesMedida.nome, ['m³ comprimido', 'Unidade', 'Cilindro']));

    console.log("✅ Data Fixed!");
}

fixData()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
