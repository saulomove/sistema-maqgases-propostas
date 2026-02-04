import { pgTable, text, serial, integer, timestamp, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['superadmin', 'unidade']);
export const propostaStatusEnum = pgEnum('proposta_status', ['rascunho', 'gerada', 'enviada']);
export const propostaTipoEnum = pgEnum('proposta_tipo', ['cilindro', 'liquido']);
export const capacidadeUnidadeEnum = pgEnum('capacidade_unidade', ['kg', 'm3']);

// ========================================
// TABELA: Unidades (Filiais)
// ========================================
export const unidades = pgTable('unidades', {
    id: serial('id').primaryKey(),
    nome: text('nome').notNull(), // Ex: "Joaçaba/SC"
    razaoSocial: text('razao_social'),
    endereco: text('endereco'),
    telefone: text('telefone'),
    email: text('email'),
    site: text('site'),
    ativo: boolean('ativo').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Usuários
// ========================================
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    nome: text('nome').notNull(),
    email: text('email').notNull().unique(),
    senha: text('senha').notNull(), // Hash bcrypt
    role: userRoleEnum('role').notNull().default('unidade'),
    unidadeId: integer('unidade_id').references(() => unidades.id),
    ativo: boolean('ativo').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Tipos de Gás (Cadastro Global)
// ========================================
export const tiposGas = pgTable('tipos_gas', {
    id: serial('id').primaryKey(),
    nome: text('nome').notNull().unique(), // Ex: "OXIGÊNIO INDUSTRIAL"
    tipo: text('tipo').default('cilindro').notNull(), // 'cilindro', 'liquido', 'ambos'
    ativo: boolean('ativo').default(true).notNull(),
    ordem: integer('ordem').default(0), // Para ordenação customizada
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Capacidades (Cadastro Global)
// ========================================
export const capacidades = pgTable('capacidades', {
    id: serial('id').primaryKey(),
    tamanho: text('tamanho').notNull().unique(), // Ex: "45kg", "10m3"
    ativo: boolean('ativo').default(true).notNull(),
    ordem: integer('ordem').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Unidades de Medida (Cadastro Global)
// ========================================
export const unidadesMedida = pgTable('unidades_medida', {
    id: serial('id').primaryKey(),
    nome: text('nome').notNull().unique(), // Ex: "Kg", "m³", "Unidade"
    sigla: text('sigla').notNull(), // Ex: "kg", "m³"
    ativo: boolean('ativo').default(true).notNull(),
    ordem: integer('ordem').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Condições de Pagamento (Cadastro Global)
// ========================================
export const condicoesPagamento = pgTable('condicoes_pagamento', {
    id: serial('id').primaryKey(),
    descricao: text('descricao').notNull().unique(), // Ex: "Nota Fiscal / Boleto 14 dias"
    dias: integer('dias').default(0).notNull(), // Prazo em dias
    ativo: boolean('ativo').default(true).notNull(),
    ordem: integer('ordem').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Configurações do Sistema
// ========================================
export const configuracoes = pgTable('configuracoes', {
    id: serial('id').primaryKey(),
    chave: text('chave').notNull().unique(), // Ex: "texto_institucional_cilindro"
    valor: text('valor'), // Conteúdo em texto ou JSON
    tipo: text('tipo').default('text'), // 'text', 'json', 'html'
    descricao: text('descricao'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ========================================
// TABELA: Propostas
// ========================================
export const propostas = pgTable('propostas', {
    id: serial('id').primaryKey(),
    numero: text('numero').notNull().unique(), // Ex: "JOA-2026-00001"
    tipo: propostaTipoEnum('tipo').notNull(),
    status: propostaStatusEnum('status').default('rascunho').notNull(),

    // Cliente
    clienteNome: text('cliente_nome').notNull(),
    clienteLocalEntrega: text('cliente_local_entrega').notNull(),

    // Locação (opcional)
    locacaoAtiva: boolean('locacao_ativa').default(false).notNull(),
    locacaoQuantidade: integer('locacao_quantidade'),
    locacaoValorUnitario: decimal('locacao_valor_unitario', { precision: 10, scale: 2 }),
    locacaoValorTotal: decimal('locacao_valor_total', { precision: 10, scale: 2 }),

    // Totais
    subtotalItens: decimal('subtotal_itens', { precision: 10, scale: 2 }).default('0').notNull(),
    valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).default('0').notNull(),

    // Relacionamentos
    unidadeId: integer('unidade_id').references(() => unidades.id).notNull(),
    usuarioId: integer('usuario_id').references(() => users.id).notNull(),

    // Versionamento
    versao: integer('versao').default(1).notNull(),
    propostaOriginalId: integer('proposta_original_id'), // Se for revisão

    // Snapshot (dados imutáveis após gerar PDF)
    snapshot: text('snapshot'), // JSON com dados completos no momento da geração

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    geradaEm: timestamp('gerada_em'), // Quando o PDF foi gerado
});

// ========================================
// TABELA: Itens da Proposta
// ========================================
export const propostaItens = pgTable('proposta_itens', {
    id: serial('id').primaryKey(),
    propostaId: integer('proposta_id').references(() => propostas.id, { onDelete: 'cascade' }).notNull(),

    // Produto
    tipoGasId: integer('tipo_gas_id').references(() => tiposGas.id),
    tipoGasNome: text('tipo_gas_nome').notNull(), // Snapshot do nome

    // Capacidade (apenas para cilindro)
    capacidadeId: integer('capacidade_id').references(() => capacidades.id),
    capacidadeTexto: text('capacidade_texto'), // Ex: "45 kg", "10 m³"

    // Unidade de Medida
    unidadeMedidaId: integer('unidade_medida_id').references(() => unidadesMedida.id),
    unidadeMedidaNome: text('unidade_medida_nome').notNull(),

    // Valores
    valorUnitario: decimal('valor_unitario', { precision: 10, scale: 2 }).notNull(),

    // Condição de Pagamento
    condicaoPagamentoId: integer('condicao_pagamento_id').references(() => condicoesPagamento.id),
    condicaoPagamentoDescricao: text('condicao_pagamento_descricao').notNull(),

    // Ordem
    ordem: integer('ordem').default(0).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========================================
// RELATIONS
// ========================================
export const unidadesRelations = relations(unidades, ({ many }) => ({
    users: many(users),
    propostas: many(propostas),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    unidade: one(unidades, {
        fields: [users.unidadeId],
        references: [unidades.id],
    }),
    propostas: many(propostas),
}));

export const propostasRelations = relations(propostas, ({ one, many }) => ({
    unidade: one(unidades, {
        fields: [propostas.unidadeId],
        references: [unidades.id],
    }),
    usuario: one(users, {
        fields: [propostas.usuarioId],
        references: [users.id],
    }),
    itens: many(propostaItens),
}));

export const propostaItensRelations = relations(propostaItens, ({ one }) => ({
    proposta: one(propostas, {
        fields: [propostaItens.propostaId],
        references: [propostas.id],
    }),
    tipoGas: one(tiposGas, {
        fields: [propostaItens.tipoGasId],
        references: [tiposGas.id],
    }),
    capacidade: one(capacidades, {
        fields: [propostaItens.capacidadeId],
        references: [capacidades.id],
    }),
    unidadeMedida: one(unidadesMedida, {
        fields: [propostaItens.unidadeMedidaId],
        references: [unidadesMedida.id],
    }),
    condicaoPagamento: one(condicoesPagamento, {
        fields: [propostaItens.condicaoPagamentoId],
        references: [condicoesPagamento.id],
    }),
}));
