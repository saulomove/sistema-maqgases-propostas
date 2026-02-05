import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unidadesMedida, users, unidades } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// TEMPORARY ENDPOINT - Run once to fix production DB
export async function POST(request: NextRequest) {
    try {
        console.log("🔧 Starting Production DB Fix...");

        // 1. Restore all unit measures
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
        console.log("✅ Unit Measures Restored");

        // 2. Fix Admin Unit Assignment
        const [joacaba] = await db.select().from(unidades).where(eq(unidades.nome, 'Joaçaba/SC'));

        if (joacaba) {
            await db.update(users)
                .set({ unidadeId: joacaba.id })
                .where(eq(users.email, 'admin@maqgases.com.br'));
            console.log("✅ Admin assigned to Joaçaba");
        } else {
            console.error("❌ Joaçaba unit not found");
        }

        // 3. Verify
        const [admin] = await db.select().from(users).where(eq(users.email, 'admin@maqgases.com.br'));
        const measures = await db.select().from(unidadesMedida);

        return NextResponse.json({
            success: true,
            message: "Production DB fixed successfully",
            admin: {
                id: admin.id,
                email: admin.email,
                unidadeId: admin.unidadeId
            },
            unitMeasures: measures.map(m => m.nome)
        });

    } catch (error) {
        console.error("Error fixing production DB:", error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
