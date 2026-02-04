'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash, Download } from 'lucide-react';
import Link from 'next/link';
import { deleteProposal } from '@/lib/actions/proposals';
import { toast } from 'sonner';

interface ProposalActionsProps {
    proposalId: number;
}

export function ProposalActions({ proposalId }: ProposalActionsProps) {
    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir esta proposta?')) return;

        const result = await deleteProposal(proposalId);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Proposta excluída com sucesso');
        }
    };

    return (
        <div className="flex justify-end gap-2">
            {/* Quick Actions (Visíveis) */}
            <Link href={`/dashboard/propostas/${proposalId}`}>
                <Button variant="ghost" size="icon" title="Visualizar">
                    <Eye size={16} className="text-muted-foreground hover:text-primary" />
                </Button>
            </Link>

            <Link href={`/api/propostas/${proposalId}/pdf`} target="_blank" prefetch={false}>
                <Button variant="ghost" size="icon" title="Baixar PDF">
                    <Download size={16} className="text-muted-foreground hover:text-green-600" />
                </Button>
            </Link>

            {/* More Actions (Dropdown) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/dashboard/propostas/${proposalId}/editar`}>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
