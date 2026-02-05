
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { propostas, propostaItens, unidades, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateProposalPDFStream } from "@/lib/pdf/generator";
import fs from 'fs';
import path from 'path';

// Helper to load images as base64 (Critical for Vercel/Serverless)
const getImageBase64 = (relativePath: string) => {
    try {
        const fullPath = path.join(process.cwd(), 'public', relativePath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`Image not found: ${fullPath}`);
            return null;
        }
        const fileBuffer = fs.readFileSync(fullPath);
        const base64 = fileBuffer.toString('base64');
        const ext = path.extname(fullPath).substring(1).toLowerCase();
        // Handle jpg/jpeg
        const mimeType = ext === 'png' ? 'image/png' : (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream');
        return `data:${mimeType};base64,${base64}`;
    } catch (e) {
        console.error(`Error loading image ${relativePath}:`, e);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const proposalId = parseInt(id);
    if (isNaN(proposalId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        // Fetch Proposal Data
        const [proposal] = await db.select().from(propostas).where(eq(propostas.id, proposalId));

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // Check permissions (SuperAdmin or Same Unit)
        if (user.role !== 'superadmin' && user.unidadeId !== proposal.unidadeId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Preload Images
        const logoSrc = getImageBase64('logo.png');
        const heroLiquidSrc = getImageBase64('images/hero_liquid.jpg');
        const heroCylinderSrc = getImageBase64('images/hero_cylinder.jpg');

        // Determine correct Hero Image based on Proposal Type
        const heroImageSrc = proposal.tipo === 'liquido' ? heroLiquidSrc : heroCylinderSrc;

        // Reconstruct Data for PDF
        // We saved a snapshot! Use it if available to ensure immutability.
        let pdfData;
        if (proposal.snapshot) {
            const snapshot = JSON.parse(proposal.snapshot);

            // Fetch associated entities names (Unit, Seller)
            // Need current data if snapshot is partial or to ensure contact info is up to date
            const [unit] = await db.select().from(unidades).where(eq(unidades.id, proposal.unidadeId));
            const [seller] = await db.select().from(users).where(eq(users.id, proposal.usuarioId));

            if (!unit) throw new Error(`Link Unit not found: ${proposal.unidadeId}`);
            if (!seller) throw new Error(`Link Seller not found: ${proposal.usuarioId}`);

            // Also need to enrich items with names if snapshot only has IDs.
            // My frontend wizard sent IDs.
            // I will use the `propostaItens` table which DOES have names saved!
            const items = await db.select().from(propostaItens).where(eq(propostaItens.propostaId, proposal.id));

            // Construct the data object expected by ProposalDocument
            pdfData = {
                id: proposal.id,
                numero: proposal.numero,
                tipo: proposal.tipo,
                date: new Date(proposal.createdAt).toLocaleDateString('pt-BR'),
                clienteNome: proposal.clienteNome,
                clienteLocalEntrega: proposal.clienteLocalEntrega,
                locacao: proposal.locacaoAtiva ? {
                    active: true,
                    quantity: proposal.locacaoQuantidade,
                    unitPrice: proposal.locacaoValorUnitario,
                    total: proposal.locacaoValorTotal
                } : undefined,
                items: items, // Contains tipoGasNome, etc.
                unit: {
                    nome: unit.nome,
                    endereco: unit.endereco || '',
                    telefone: unit.telefone || '',
                    email: unit.email || ''
                },
                seller: {
                    nome: seller.nome
                },
                images: {
                    logo: logoSrc,
                    hero: heroImageSrc, // Pass the selected image
                }
            };
        } else {
            // Fallback if no snapshot (legacy?)
            return NextResponse.json({ error: "Snapshot missing" }, { status: 500 });
        }

        // Generate PDF
        const stream = await generateProposalPDFStream(pdfData);

        // Convert stream to buffer
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Proposta-${proposal.numero}.pdf"`
            }
        });
    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
