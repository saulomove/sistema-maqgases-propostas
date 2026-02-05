import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { eq } from 'drizzle-orm';

async function debugUser() {
    const { db } = await import("@/lib/db");
    const { users, unidades } = await import("@/lib/db/schema");

    console.log("🔍 Debugging Admin User...\n");

    // Check admin user
    const [admin] = await db.select().from(users).where(eq(users.email, 'admin@maqgases.com.br'));

    if (!admin) {
        console.error("❌ Admin user not found!");
        return;
    }

    console.log("Admin User:");
    console.log("- ID:", admin.id);
    console.log("- Email:", admin.email);
    console.log("- Nome:", admin.nome);
    console.log("- Role:", admin.role);
    console.log("- UnidadeId:", admin.unidadeId);

    if (admin.unidadeId) {
        const [unit] = await db.select().from(unidades).where(eq(unidades.id, admin.unidadeId));
        if (unit) {
            console.log("\n✅ Linked Unit Found:");
            console.log("- ID:", unit.id);
            console.log("- Nome:", unit.nome);
        } else {
            console.log("\n❌ Unit ID exists but unit not found in database!");
        }
    } else {
        console.log("\n❌ Admin has NULL unidadeId!");
    }

    // List all units
    console.log("\n📋 All Units in Database:");
    const allUnits = await db.select().from(unidades);
    allUnits.forEach(u => {
        console.log(`- ID: ${u.id}, Nome: ${u.nome}`);
    });
}

debugUser()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
