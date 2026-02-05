import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { eq } from 'drizzle-orm';

async function restoreUnits() {
    const { db } = await import("@/lib/db");
    const { unidadesMedida, users, unidades } = await import("@/lib/db/schema");

    console.log("🔧 Restoring Unit Measures...");

    // Re-add the deleted units for Cylinder proposals
    const allUnits = [
        { nome: 'Kg', sigla: 'kg', ordem: 1 },
        { nome: 'm³', sigla: 'm³', ordem: 2 },
        { nome: 'm³ comprimido', sigla: 'm³ comp.', ordem: 3 },
        { nome: 'Unidade', sigla: 'un', ordem: 4 },
        { nome: 'Cilindro', sigla: 'cil', ordem: 5 },
    ];

    for (const unit of allUnits) {
        await db.insert(unidadesMedida).values(unit).onConflictDoNothing();
    }

    console.log("✅ Unit Measures Restored!");

    // Fix Admin Unit Assignment
    console.log("🔧 Fixing Admin Unit...");
    const [joacaba] = await db.select().from(unidades).where(eq(unidades.nome, 'Joaçaba/SC'));

    if (joacaba) {
        await db.update(users)
            .set({ unidadeId: joacaba.id })
            .where(eq(users.email, 'admin@maqgases.com.br'));
        console.log("✅ Admin now assigned to Joaçaba unit!");
    } else {
        console.error("❌ Joaçaba unit not found!");
    }
}

restoreUnits()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
