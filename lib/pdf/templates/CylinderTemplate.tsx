import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from '../styles';
import { SegmentCard } from '../components/SegmentCard';
import { ICONS } from '../icons';

interface CylinderTemplateProps {
    proposalNumber: string;
    date: string;
    unitName: string;
    unitAddress: string;
    unitPhone: string;
    unitEmail: string;
}

export const CylinderTemplatePage1 = ({
    proposalNumber,
    date,
    unitName,
    unitAddress,
    unitPhone,
    unitEmail
}: CylinderTemplateProps) => (
    <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                <Image
                    src="/Users/SauloMachado/Documents/Sistema - MaqGases - Propostas/sistema-maqgases-propostas/public/logo.png"
                    style={styles.logo}
                />
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.title}>PROPOSTA COMERCIAL</Text>
                <Text style={styles.subtitle}>GASES EM CILINDROS</Text>
                <View style={styles.proposalInfo}>
                    <Text style={styles.labelValue}>Nº: {proposalNumber}</Text>
                    <Text style={styles.labelValue}>Data: {date}</Text>
                </View>
            </View>
        </View>

        {/* HERO SECTION */}
        <View style={{ marginBottom: 20 }}>
            <Image
                src="/Users/SauloMachado/Documents/Sistema - MaqGases - Propostas/sistema-maqgases-propostas/public/images/hero-general.png"
                style={{ width: '100%', height: 160, borderRadius: 6, objectFit: 'cover' }}
            />
        </View>



        // ... (inside the component)

        {/* COLUMNS LIST - MODIFIED FOR NEW GRID LAYOUT */}
        <View style={{ flexDirection: 'column', marginBottom: 20 }}>
            <Text style={{ ...styles.sectionTitle, marginBottom: 10 }}>Soluções Integradas</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <SegmentCard
                    title="Alimentos & Bebidas"
                    description="Tecnologias para conservação e qualidade."
                    iconPath={ICONS.FOOD}
                />
                <SegmentCard
                    title="Metalurgia"
                    description="Produtividade e redução de custos."
                    iconPath={ICONS.FACTORY}
                />
                <SegmentCard
                    title="Gases Especiais"
                    description="Alta pureza e misturas de precisão."
                    iconPath={ICONS.FLAME}
                />
                <SegmentCard
                    title="Química"
                    description="Melhoria de processos e produtividade."
                    iconPath={ICONS.FLASK}
                />
                <SegmentCard
                    title="Solda e Corte"
                    description="Suporte técnico e gases para soldagem."
                    iconPath={ICONS.WELDING}
                />
                <SegmentCard
                    title="Serviços"
                    description="Instalações e manutenção especializada."
                    iconPath={ICONS.GEAR}
                />
            </View>
        </View>

        {/* VALUE PROP BOX */}
        <View style={{ backgroundColor: '#F9FAFB', padding: 15, marginBottom: 20, borderRadius: 6 }}>
            <Text style={styles.sectionTitle}>Por que a MaqGases?</Text>
            <Text style={styles.text}>
                Atendemos empresas de diferentes portes com soluções em gases padronizadas,
                seguras e identificadas, garantindo eficiência operacional e tranquilidade em cada fornecimento.
            </Text>
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
