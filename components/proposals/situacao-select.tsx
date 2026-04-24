'use client';

import { useState, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { updateProposalSituacao, type PropostaSituacao } from '@/lib/actions/proposals';
import { SITUACAO_OPTIONS, getSituacaoConfig } from './situacao-config';
import { cn } from '@/lib/utils';

interface SituacaoSelectProps {
    proposalId: number;
    situacaoAtual: PropostaSituacao;
    variant?: 'compact' | 'full';
}

export function SituacaoSelect({ proposalId, situacaoAtual, variant = 'compact' }: SituacaoSelectProps) {
    const [value, setValue] = useState<PropostaSituacao>(situacaoAtual);
    const [isPending, startTransition] = useTransition();

    const handleChange = (next: string) => {
        const novaSituacao = next as PropostaSituacao;
        const anterior = value;
        setValue(novaSituacao);

        startTransition(async () => {
            const result = await updateProposalSituacao(proposalId, novaSituacao);
            if (result.error) {
                setValue(anterior);
                toast.error(result.error);
            } else {
                toast.success('Situação atualizada');
            }
        });
    };

    const config = getSituacaoConfig(value);
    const triggerWidth = variant === 'compact' ? 'w-[140px] h-8' : 'w-[180px]';

    return (
        <Select value={value} onValueChange={handleChange} disabled={isPending}>
            <SelectTrigger className={cn(triggerWidth, 'text-xs font-medium')}>
                <div className="flex items-center gap-2">
                    <span className={cn('inline-block h-2 w-2 rounded-full', config.dotClass)} />
                    <SelectValue>{config.label}</SelectValue>
                </div>
            </SelectTrigger>
            <SelectContent>
                {SITUACAO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                            <span className={cn('inline-block h-2 w-2 rounded-full', opt.dotClass)} />
                            {opt.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
