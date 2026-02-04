import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from '../styles';

interface DataPageProps {
    type: 'cilindro' | 'liquido';
    proposalNumber: string;
    date: string;
    unitName: string;
    unitAddress: string;
    unitPhone: string;
    unitEmail: string;
    clientName: string;
    clientLocation: string;
    sellerName: string;
    items: any[];
    locacao?: {
        active: boolean;
        quantity: number;
        unitPrice: number;
        total: number;
    };
}

export const DataPage = ({
    type,
    proposalNumber,
    date,
    unitName,
    unitAddress,
    unitPhone,
    unitEmail,
    clientName,
    clientLocation,
    sellerName,
    items,
    locacao
}: DataPageProps) => {

    // Calculate Totals
    const itemsTotal = items.reduce((acc, item) => acc + Number(item.valorUnitario), 0);
    const totalGeneral = itemsTotal + (locacao?.active ? Number(locacao.total) : 0);

    return (
        <Page size="A4" style={styles.page}>
            {/* HEADER SMALL */}
            <View style={{ ...styles.header, marginBottom: 30, borderBottomWidth: 0, paddingBottom: 0, height: 30 }}>
                <Image
                    src="/Users/SauloMachado/Documents/Sistema - MaqGases - Propostas/sistema-maqgases-propostas/public/logo.png"
                    style={{ width: 80, objectFit: 'contain' }}
                />
                <Text style={{ fontSize: 9, color: '#666' }}>{proposalNumber}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#0B9BD9', marginBottom: 20 }} />

            {/* SPLIT INFO SECTION */}
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                {/* Left Column: Client */}
                <View style={{ flex: 1, paddingRight: 20 }}>
                    <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 4, letterSpacing: 0.5 }}>CLIENTE</Text>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827', marginBottom: 2 }}>{clientName}</Text>
                    <Text style={{ fontSize: 9, color: '#4B5563' }}>{clientLocation}</Text>
                </View>

                {/* Vertical Divider */}
                <View style={{ width: 1, backgroundColor: '#E5E7EB', marginHorizontal: 10 }} />

                {/* Right Column: Details */}
                <View style={{ flex: 1, paddingLeft: 20 }}>
                    <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 4, letterSpacing: 0.5 }}>DETALHES</Text>
                    <View style={{ marginBottom: 2 }}>
                        <Text style={{ fontSize: 9, color: '#111827' }}>Tipo: <Text style={{ fontWeight: 'bold' }}>{type === 'cilindro' ? 'Gases em Cilindro' : 'Gases Líquidos'}</Text></Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 9, color: '#111827' }}>Vendedor: {sellerName}</Text>
                    </View>
                </View>
            </View>

            {/* ITEMS TABLE */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={{ ...styles.tableHeaderCell, flex: 2.5 }}>DESCRIÇÃO</Text>
                    <Text style={{ ...styles.tableHeaderCell, flex: 0.8 }}>CAPACIDADE</Text>
                    <Text style={{ ...styles.tableHeaderCell, flex: 0.8 }}>UNIDADE</Text>
                    <Text style={{ ...styles.tableHeaderCell, flex: 1 }}>VALOR UNIT.</Text>
                    <Text style={{ ...styles.tableHeaderCell, flex: 2, textAlign: 'right', paddingRight: 8 }}>PAGAMENTO</Text>
                </View>

                {items.map((item, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, flex: 2.5 }}>{item.tipoGasNome}</Text>
                        <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.capacidadeTexto || '-'}</Text>
                        <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.unidadeMedidaNome}</Text>
                        <Text style={{ ...styles.tableCell, flex: 1 }}>R$ {Number(item.valorUnitario).toFixed(2)}</Text>
                        <Text style={{ ...styles.tableCell, flex: 2, textAlign: 'right', paddingRight: 8, fontSize: 8 }}>{item.condicaoPagamentoDescricao}</Text>
                    </View>
                ))}
            </View>

            {/* LOCACAO SECTION */}
            {type === 'cilindro' && locacao?.active && (
                <View style={{ marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 15 }}>
                    <Text style={{ ...styles.sectionTitle, fontSize: 11, marginBottom: 8, color: '#0B9BD9' }}>Locação de Cilindros Mensal</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#374151' }}>{locacao.quantity} cilindros x R$ {Number(locacao.unitPrice).toFixed(2)}</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>Total: R$ {Number(locacao.total).toFixed(2)}</Text>
                    </View>
                </View>
            )}



            {/* SIGNATURE */}
            <View style={{ marginTop: 60, alignItems: 'center' }}>
                <View style={{ width: 220, borderBottomWidth: 1, borderBottomColor: '#1F2937', marginBottom: 8 }} />
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#111827' }}>{sellerName}</Text>
                <Text style={{ fontSize: 9, color: '#4B5563' }}>Comercial - {unitName}</Text>
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
}
