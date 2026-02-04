import React from 'react';
import { Page, Text, View, Image, Document } from '@react-pdf/renderer';
import { styles } from '../styles';
import { SegmentCard } from '../components/SegmentCard';
import { ICONS } from '../icons';

interface LiquidTemplateProps {
    proposalNumber: string;
    date: string;
    unitName: string;
    unitAddress: string;
    unitPhone: string;
    unitEmail: string;
    logoSrc?: string | null;
    heroSrc?: string | null;
}

export const LiquidTemplatePage1 = ({
    proposalNumber,
    date,
    unitName,
    unitAddress,
    unitPhone,
    unitEmail,
    logoSrc,
    heroSrc
}: LiquidTemplateProps) => (
    <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                {logoSrc ? (
                    <Image src={logoSrc} style={styles.logo} />
                ) : (
                    <View style={{ ...styles.logo, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 8 }}>Logo Missing</Text>
                    </View>
                )}
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.title}>PROPOSTA COMERCIAL</Text>
                <Text style={styles.subtitle}>GASES LÍQUIDOS</Text>
                <View style={styles.proposalInfo}>
                    <Text style={styles.labelValue}>Nº: {proposalNumber}</Text>
                    <Text style={styles.labelValue}>Data: {date}</Text>
                </View>
            </View>
        </View>

        {/* INSTITUCIONAL */}
        <View style={styles.institutionalContainer}>
            <View style={styles.column}>
                <Text style={styles.sectionTitle}>Desde 2009, entregando confiança, agilidade e suporte em gases</Text>
                <Text style={styles.text}>
                    A MaqGases é referência no fornecimento de gases industriais, medicinais e especiais,
                    atendendo empresas e instituições em todo o Sul do Brasil.
                </Text>
                <Text style={styles.text}>
                    Atuamos com logística própria, rigorosos padrões de qualidade e suporte técnico especializado,
                    oferecendo soluções seguras e eficientes para cada aplicação.
                </Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.sectionTitle}>Muito além do fornecimento</Text>
                <Text style={styles.text}>• Frota própria e controle logístico</Text>
                <Text style={styles.text}>• Gases de alta pureza e rastreabilidade</Text>
                <Text style={styles.text}>• Entregas programadas ou emergenciais</Text>
                <Text style={styles.text}>• Suporte técnico especializado</Text>
                <Text style={styles.text}>• Atendimento personalizado por segmento</Text>
            </View>
        </View>

        {/* BANNER SEGMENTOS */}
        <View style={{ marginBottom: 20 }}>
            <Text style={{ ...styles.sectionTitle, marginBottom: 8 }}>Especialistas em Criogenia e Grandes Volumes</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <SegmentCard
                    title="Saúde / Healthcare"
                    description="Gases medicinais para hospitais e clínicas com total confiabilidade."
                    iconPath={ICONS.HEALTH}
                />
                <SegmentCard
                    title="Engenharia e Projetos"
                    description="Desenvolvimento de plantas e instalações industriais."
                    iconPath={ICONS.FACTORY}
                />
            </View>
        </View>

        {/* HERO IMAGE */}
        <View>
            {heroSrc ? (
                <Image
                    src={heroSrc}
                    style={{ width: '100%', height: 250, borderRadius: 6, objectFit: 'cover' }}
                />
            ) : null}
            {/* Overlay Text embedded in image or separate view? Keeping it clean with just image as requested/implied by "Visão Tanques" */}
            <View style={{ position: 'absolute', bottom: 15, left: 15, backgroundColor: 'rgba(11, 155, 217, 0.9)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
                    +8 mil empresas atendidas no Sul do Brasil
                </Text>
            </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
            <View>
                <Text style={styles.footerText}>{unitName}</Text>
                <Text style={styles.footerText}>{unitAddress}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.footerText}>{unitPhone} | {unitEmail}</Text>
                <Text style={styles.footerText}>www.maqgases.com.br</Text>
            </View>
        </View>
    </Page>
);
