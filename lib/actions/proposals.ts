'use server';

import { db } from '@/lib/db';
import { propostas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type PropostaSituacao = 'aberto' | 'em_espera' | 'aprovado' | 'fechado' | 'cancelado';

export async function updateProposalSituacao(proposalId: number, situacao: PropostaSituacao) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        const [proposal] = await db.select().from(propostas).where(eq(propostas.id, proposalId));

        if (!proposal) {
            return { error: 'Proposal not found' };
        }

        if (user.role !== 'superadmin' && user.unidadeId !== proposal.unidadeId) {
            return { error: 'Forbidden' };
        }

        await db
            .update(propostas)
            .set({ situacao, updatedAt: new Date() })
            .where(eq(propostas.id, proposalId));

        revalidatePath('/dashboard/propostas');
        revalidatePath(`/dashboard/propostas/${proposalId}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating proposal situacao:', error);
        return { error: 'Failed to update proposal situacao' };
    }
}

export async function deleteProposal(proposalId: number) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        const [proposal] = await db.select().from(propostas).where(eq(propostas.id, proposalId));

        if (!proposal) {
            return { error: 'Proposal not found' };
        }

        // Validate permissions
        if (user.role !== 'superadmin' && user.unidadeId !== proposal.unidadeId) {
            return { error: 'Forbidden' };
        }

        await db.delete(propostas).where(eq(propostas.id, proposalId));
        revalidatePath('/dashboard/propostas');
        return { success: true };
    } catch (error) {
        console.error('Error deleting proposal:', error);
        return { error: 'Failed to delete proposal' };
    }
}
