import { eq, sql, type SQL } from 'drizzle-orm';
import { propostas } from '@/lib/db/schema';

/**
 * Fonte única das regras de acesso do sistema.
 *
 * O controle é dividido em dois eixos independentes:
 *
 *  1. `role`  — o que a pessoa PODE FAZER (gerenciar usuários, catálogos, configurações)
 *  2. `escopoVisibilidade` — o que a pessoa PODE VER (quais propostas)
 *
 * Um vendedor e um gerente da mesma filial têm o mesmo `role` ('unidade') mas
 * escopos diferentes: o vendedor vê só o que criou, o gerente vê a filial toda.
 */

export type UserRole = 'superadmin' | 'admin' | 'unidade';
export type EscopoVisibilidade = 'proprias' | 'unidade' | 'todas';

export interface SessionUser {
    id: number;
    nome: string;
    email: string;
    role: UserRole;
    escopoVisibilidade: EscopoVisibilidade;
    unidadeId: number | null;
}

/** Alvo mínimo para decidir permissão sobre uma proposta. */
interface PropostaRef {
    unidadeId: number;
    usuarioId: number;
}

/** Alvo mínimo para decidir permissão sobre outro usuário. */
interface UserRef {
    id: number;
    role: UserRole;
}

// ========================================
// Rótulos para a UI
// ========================================

export const ROLE_LABELS: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrador',
    unidade: 'Unidade (Comercial)',
};

export const ESCOPO_LABELS: Record<EscopoVisibilidade, string> = {
    proprias: 'Apenas as próprias propostas',
    unidade: 'Todas as propostas da unidade',
    todas: 'Todas as propostas (todas as unidades)',
};

// ========================================
// Capacidades por papel
// ========================================

/** Gerenciar usuários: superadmin e admin, em todas as filiais. */
export function canManageUsers(user: SessionUser | null): boolean {
    return user?.role === 'superadmin' || user?.role === 'admin';
}

/** Catálogos e configurações do sistema seguem exclusivos do superadmin. */
export function canManageCatalogos(user: SessionUser | null): boolean {
    return user?.role === 'superadmin';
}

export function canManageConfiguracoes(user: SessionUser | null): boolean {
    return user?.role === 'superadmin';
}

/**
 * Um admin não pode criar, editar nem excluir um superadmin — do contrário
 * poderia se promover. Ninguém pode excluir a própria conta.
 */
export function canManageUser(actor: SessionUser | null, target: UserRef): boolean {
    if (!canManageUsers(actor)) return false;
    if (actor!.role === 'superadmin') return true;
    return target.role !== 'superadmin';
}

export function canDeleteUser(actor: SessionUser | null, target: UserRef): boolean {
    if (actor?.id === target.id) return false;
    return canManageUser(actor, target);
}

/** Papéis que o ator tem permissão de atribuir a alguém. */
export function assignableRoles(actor: SessionUser | null): UserRole[] {
    if (actor?.role === 'superadmin') return ['superadmin', 'admin', 'unidade'];
    if (actor?.role === 'admin') return ['admin', 'unidade'];
    return [];
}

// ========================================
// Visibilidade de propostas
// ========================================

/**
 * Escopo efetivo: o superadmin enxerga tudo independentemente do valor gravado,
 * já que é o papel responsável por administrar todas as filiais.
 */
export function escopoEfetivo(user: SessionUser): EscopoVisibilidade {
    return user.role === 'superadmin' ? 'todas' : user.escopoVisibilidade;
}

/**
 * Filtro Drizzle para a listagem de propostas.
 * Retorna `undefined` quando não há restrição (vê tudo).
 *
 * Falha fechado: escopo 'unidade' sem unidade vinculada não devolve nada.
 */
export function propostaVisibilityFilter(user: SessionUser): SQL | undefined {
    switch (escopoEfetivo(user)) {
        case 'todas':
            return undefined;
        case 'unidade':
            return user.unidadeId === null
                ? sql`false`
                : eq(propostas.unidadeId, user.unidadeId);
        case 'proprias':
        default:
            return eq(propostas.usuarioId, user.id);
    }
}

/** Mesma regra do filtro acima, aplicada a uma proposta já carregada. */
export function canViewProposta(user: SessionUser | null, proposta: PropostaRef): boolean {
    if (!user) return false;
    switch (escopoEfetivo(user)) {
        case 'todas':
            return true;
        case 'unidade':
            return user.unidadeId !== null && user.unidadeId === proposta.unidadeId;
        case 'proprias':
        default:
            return user.id === proposta.usuarioId;
    }
}

/**
 * Editar, excluir e alterar situação seguem a mesma regra de enxergar:
 * quem não vê a proposta também não mexe nela.
 */
export function canEditProposta(user: SessionUser | null, proposta: PropostaRef): boolean {
    return canViewProposta(user, proposta);
}
