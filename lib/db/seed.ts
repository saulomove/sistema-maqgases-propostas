import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Imports dinâmicos para garantir que as variáveis de ambiente carreguem antes
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Importar DB e Schema APÓS carregar o environment
    const { db } = await import('./index');
    const {
        tiposGas,
        capacidades,
        unidadesMedida,
        condicoesPagamento,
        unidades,
        users,
        configuracoes
    } = await import('./schema');

    try {
        // 1. TIPOS DE GÁS
        console.log('📦 Verificando tipos de gás...');
        // Lista explícita com tipos para filtragem correta
        const gasTypes = [
            { nome: 'OXIGÊNIO INDUSTRIAL', tipo: 'cilindro' },
            { nome: 'OXIGÊNIO MEDICINAL', tipo: 'cilindro' },
            { nome: 'ARGÔNIO', tipo: 'cilindro' },
            { nome: 'FERROLINE', tipo: 'cilindro' },
            { nome: 'INOXLINE', tipo: 'cilindro' },
            { nome: 'ACETILENO', tipo: 'cilindro' },
            { nome: 'NITROGÊNIO', tipo: 'cilindro' },
            { nome: 'HIDROGÊNIO', tipo: 'cilindro' },
            { nome: 'ETIL', tipo: 'cilindro' },
            { nome: 'MAQMIX PREMIUM', tipo: 'cilindro' },
            { nome: 'DIÓXIDO DE CARBONO', tipo: 'liquido' }, // CO2 Líquido
            { nome: 'DIÓXIDO DE CARBONO EP', tipo: 'cilindro' },
            { nome: 'AR MEDICINAL', tipo: 'cilindro' },
            { nome: 'ÓXIDO NITROSO', tipo: 'cilindro' },
            { nome: 'HÉLIO', tipo: 'cilindro' },
            { nome: 'OXIGÊNIO UP', tipo: 'cilindro' },
            { nome: 'ARGÔNIO UP', tipo: 'cilindro' },
            { nome: 'NITROGÊNIO UP', tipo: 'cilindro' },
            { nome: 'AR SINTÉTICO UP', tipo: 'cilindro' },
            { nome: 'HÉLIO UP', tipo: 'cilindro' },
            { nome: 'HIDROGÊNIO UP', tipo: 'cilindro' },
            { nome: 'OXIGÊNIO 6.0', tipo: 'cilindro' },
            { nome: 'HÉLIO LASERLINE', tipo: 'cilindro' },
            { nome: 'NITROGÊNIO LASERLINE', tipo: 'cilindro' },
            { nome: 'DIÓXIDO DE CARBONO LASERLINE', tipo: 'cilindro' },
            { nome: 'LASERLINE', tipo: 'cilindro' },
        ];

        for (const gas of gasTypes) {
            await db.insert(tiposGas).values({
                nome: gas.nome,
                tipo: gas.tipo,
                ordem: 0,
            }).onConflictDoNothing();
        }

        // 2. CAPACIDADES
        console.log('⚖️  Verificando capacidades...');
        // Valores solicitados pelo cliente
        const capacidadesKg = [2, 2.5, 3.6, 4, 5, 6, 7, 9, 10, 18, 25, 28, 33, 45];
        const capacidadesM3 = [0.3, 0.6, 1, 1.5, 2.25, 3, 4, 6, 7.5, 8.5, 10];

        let ordem = 1;
        for (const valor of capacidadesKg) {
            await db.insert(capacidades).values({
                tamanho: `${valor} kg`,
                ordem: ordem++,
            }).onConflictDoNothing();
        }

        for (const valor of capacidadesM3) {
            await db.insert(capacidades).values({
                tamanho: `${valor} m³`,
                ordem: ordem++,
            }).onConflictDoNothing();
        }

        // 3. UNIDADES DE MEDIDA
        console.log('📏 Verificando unidades de medida...');
        // Apenas kg e m3 conforme solicitado
        const unidadesMedidaData = [
            { nome: 'Kg', sigla: 'kg' },
            { nome: 'm³', sigla: 'm³' },
        ];

        for (let i = 0; i < unidadesMedidaData.length; i++) {
            await db.insert(unidadesMedida).values({
                ...unidadesMedidaData[i],
                ordem: i + 1,
            }).onConflictDoNothing();
        }

        // 4. CONDIÇÕES DE PAGAMENTO
        console.log('💳 Verificando condições de pagamento...');
        const condicoes = [
            'Nota Fiscal / Boleto 14 dias',
            'Nota Fiscal / Boleto 28 dias',
            'Nota Fiscal / Boleto 20 e 40 dias',
        ];

        for (let i = 0; i < condicoes.length; i++) {
            await db.insert(condicoesPagamento).values({
                descricao: condicoes[i],
                ordem: i + 1,
            }).onConflictDoNothing();
        }

        // 5. UNIDADES (FILIAIS REAIS)
        console.log('🏢 Inserindo unidades reais...');
        const unidadesReais = [
            {
                nome: 'Joaçaba/SC',
                razaoSocial: 'MaqGases Matriz',
                endereco: 'Rua Armindo Raimundo Heberle, 415, Vila Remor - CEP 89600-000',
                cidade: 'Joaçaba',
                uf: 'SC',
                email: 'joacaba@maqgases.com.br',
                senhaUser: 'joacaba123'
            },
            {
                nome: 'Palhoça/SC',
                razaoSocial: 'MaqGases Filial Palhoça',
                endereco: 'Rua do Albatroz, 26, Pedra Branca - CEP 88137-290',
                cidade: 'Palhoça',
                uf: 'SC',
                email: 'palhoca@maqgases.com.br',
                senhaUser: 'palhoca123'
            },
            {
                nome: 'Caxias do Sul/RS',
                razaoSocial: 'MaqGases Filial Caxias',
                endereco: 'Rua Olinda Pontalti Peteffi, 1176, Diamantino - CEP 95055-618',
                cidade: 'Caxias do Sul',
                uf: 'RS',
                email: 'caxias@maqgases.com.br',
                senhaUser: 'caxias123'
            },
            {
                nome: 'Chapecó/SC',
                razaoSocial: 'MaqGases Filial Chapecó',
                endereco: 'Rua Cuba, 221 - QD 2014 Lote 01, Líder - CEP 89805-225',
                cidade: 'Chapecó',
                uf: 'SC',
                email: 'chapeco@maqgases.com.br',
                senhaUser: 'chapeco123'
            },
            {
                nome: 'Mafra/SC',
                razaoSocial: 'MaqGases Filial Mafra',
                endereco: 'Rua Benemerito Henrique Max, 930, Vila Nova - CEP 89304-326',
                cidade: 'Mafra',
                uf: 'SC',
                email: 'mafra@maqgases.com.br',
                senhaUser: 'mafra123'
            }
        ];

        // 6. GARANTIR SUPERADMIN
        console.log('👤 Verificando SuperAdmin...');
        const adminEmail = 'admin@maqgases.com.br';
        const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
        const adminPassword = await bcrypt.hash('senha123', 10);

        if (existingAdmin.length === 0) {
            await db.insert(users).values({
                nome: 'Admin MaqGases',
                email: adminEmail,
                senha: adminPassword,
                role: 'superadmin',
                unidadeId: null, // Admin não tem unidade fixa
            });
        }

        // Loops de unidades
        const senhaHashUsers = await bcrypt.hash('senha123', 10); // Default hash

        for (const unitData of unidadesReais) {
            // Verificar se unidade já existe pelo nome
            const existingUnit = await db.select().from(unidades).where(eq(unidades.nome, unitData.nome));

            let unidadeId;

            if (existingUnit.length > 0) {
                console.log(`Unidade ${unitData.nome} já existe. Atualizando...`);
                await db.update(unidades).set({
                    endereco: unitData.endereco,
                    email: unitData.email
                }).where(eq(unidades.id, existingUnit[0].id));
                unidadeId = existingUnit[0].id;
            } else {
                console.log(`Criando unidade ${unitData.nome}...`);
                const [newUnit] = await db.insert(unidades).values({
                    nome: unitData.nome,
                    razaoSocial: unitData.razaoSocial,
                    endereco: unitData.endereco,
                    email: unitData.email,
                    telefone: '(00) 0000-0000',
                    site: 'www.maqgases.com.br'
                }).returning();
                unidadeId = newUnit.id;
            }

            // Criar ou atualizar usuário da unidade
            const existingUser = await db.select().from(users).where(eq(users.email, unitData.email));
            const userPassword = await bcrypt.hash(unitData.senhaUser, 10);

            if (existingUser.length === 0) {
                console.log(`Criando usuário ${unitData.email}...`);
                await db.insert(users).values({
                    nome: `Comercial ${unitData.cidade}`,
                    email: unitData.email,
                    senha: userPassword,
                    role: 'unidade',
                    unidadeId: unidadeId
                });
            } else {
                console.log(`Usuário ${unitData.email} já existe. Atualizando senha/vínculo...`);
                await db.update(users).set({
                    senha: userPassword,
                    unidadeId: unidadeId,
                    role: 'unidade'
                }).where(eq(users.id, existingUser[0].id));
            }
        }

        // 7. CONFIGURAÇÕES
        console.log('⚙️  Verificando configurações...');
        await db.insert(configuracoes).values([
            {
                chave: 'texto_institucional_cilindro',
                valor: 'A MaqGases é referência no fornecimento de gases industriais, medicinais e especiais, atendendo empresas e instituições em todo o Sul do Brasil. Atuamos com logística própria, rigorosos padrões de qualidade e suporte técnico especializado.',
                tipo: 'text',
                descricao: 'Texto institucional para propostas de cilindro',
            },
            {
                chave: 'texto_institucional_liquido',
                valor: 'A MaqGases é referência no fornecimento de gases industriais, medicinais e especiais, atendendo empresas e instituições em todo o Sul do Brasil. Atuamos com logística própria, rigorosos padrões de qualidade e suporte técnico especializado.',
                tipo: 'text',
                descricao: 'Texto institucional para propostas de líquido',
            },
        ]).onConflictDoNothing();

        console.log('✅ Seed preenchido com dados reais da MaqGases com sucesso!');
        console.log('\n📝 Tabela de Acesso Atualizada:');
        console.log('---------------------------------------------------------');
        console.log('| Unidade         | Login                    | Senha      |');
        console.log('|-----------------|--------------------------|------------|');
        console.log('| SUPER ADMIN     | admin@maqgases.com.br    | senha123   | (Apenas Gestão)');
        console.log('| JOAÇABA (Matriz)| joacaba@maqgases.com.br  | joacaba123 | (Cria Proposta)');
        console.log('| PALHOÇA         | palhoca@maqgases.com.br  | palhoca123 | (Cria Proposta)');
        console.log('| CAXIAS DO SUL   | caxias@maqgases.com.br   | caxias123  | (Cria Proposta)');
        console.log('| CHAPECÓ         | chapeco@maqgases.com.br  | chapeco123 | (Cria Proposta)');
        console.log('| MAFRA           | mafra@maqgases.com.br    | mafra123   | (Cria Proposta)');
        console.log('---------------------------------------------------------');
    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        throw error;
    }
}

seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
