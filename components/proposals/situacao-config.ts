import type { PropostaSituacao } from '@/lib/actions/proposals';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

export const SITUACAO_OPTIONS: {
    value: PropostaSituacao;
    label: string;
    variant: BadgeVariant;
    dotClass: string;
}[] = [
    { value: 'aberto', label: 'Aberto', variant: 'outline', dotClass: 'bg-slate-400' },
    { value: 'em_espera', label: 'Em espera', variant: 'warning', dotClass: 'bg-yellow-500' },
    { value: 'aprovado', label: 'Aprovado', variant: 'secondary', dotClass: 'bg-blue-500' },
    { value: 'fechado', label: 'Fechado', variant: 'success', dotClass: 'bg-green-500' },
    { value: 'cancelado', label: 'Cancelado', variant: 'destructive', dotClass: 'bg-red-500' },
];

export function getSituacaoConfig(value: PropostaSituacao | string) {
    return SITUACAO_OPTIONS.find((opt) => opt.value === value) ?? SITUACAO_OPTIONS[0];
}
