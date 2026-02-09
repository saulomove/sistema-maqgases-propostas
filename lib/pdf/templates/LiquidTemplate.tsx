import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from '../styles';

interface LiquidTemplateProps {
    proposalNumber: string;
    date: string;
    unitName: string;
    unitAddress: string;
    unitPhone: string;
    unitEmail: string;
    logoSrc?: string | null;
    logoWhiteSrc?: string | null; // Use white logo
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
    logoWhiteSrc, // Receive prop
    heroSrc
}: LiquidTemplateProps) => (
    <Page size="A4" style={{ margin: 0, padding: 0, fontFamily: 'Inter' }}>
        {/* HERO SECTION - FULL PAGE DRAMATIC */}
        <View style={{
            position: 'relative',
            height: 340, // Reduced from 420 to prevent overflow
            backgroundColor: '#052030', // Darker blue base
        }}>
            {/* Background Image with Overlay */}
            {heroSrc && (
                <>
                    <Image
                        src={heroSrc}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            objectFit: 'cover',
                            opacity: 0.30  // Increased from 0.18 - more visible
                        }}
                    />
                    {/* Darker overlay */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(5, 32, 48, 0.85)'  // Darker opacity for premium look
                    }} />
                </>
            )}

            {/* Logo top left - Prefer White */}
            <View style={{ position: 'absolute', top: 30, left: 40 }}>
                {logoWhiteSrc || logoSrc ? (
                    <Image
                        src={logoWhiteSrc || logoSrc || ""}
                        style={{ width: 140, objectFit: 'contain' }}
                    />
                ) : null}
            </View>

            {/* Proposal info top right */}
            <View style={{ position: 'absolute', top: 35, right: 40 }}>
                <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, marginBottom: 2 }}>
                    Nº {proposalNumber}
                </Text>
                <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9 }}>
                    {date}
                </Text>
            </View>

            {/* Main Hero Content */}
            <View style={{
                position: 'absolute',
                top: '45%',
                left: 40,
                right: 40,
                transform: 'translateY(-50%)'
            }}>
                <Text style={{
                    fontSize: 42, // Reduced from 52
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1,
                    marginBottom: 20,
                    letterSpacing: -1.5
                }}>
                    SOLUÇÕES{'\n'}COMPLETAS EM{'\n'}CO₂ LÍQUIDO
                </Text>
                <View style={{
                    width: 140,
                    height: 6,
                    backgroundColor: '#FFFFFF',
                    marginBottom: 25,
                    borderRadius: 3
                }} />
                <Text style={{
                    fontSize: 13, // Reduced from 16
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    lineHeight: 1.5,
                    maxWidth: 450
                }}>
                    Fornecimento garantido o ano todo com logística própria,{'\n'}qualidade certificada e suporte técnico especializado
                </Text>
            </View>

            {/* Overlay text REMOVED */}
        </View>

        {/* SECTION: DIFERENCIAIS - WHITE WITH COLORED BOXES */}
        <View style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 40,
            paddingVertical: 30, // Reduced from 50/45 to prevent overflow
            paddingBottom: 60, // Ensure footer clearance
        }}>
            <Text style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#1A1D29',
                marginBottom: 12,
                letterSpacing: -0.8,
                textAlign: 'center'
            }}>
                Nossos Diferenciais
            </Text>
            <Text style={{
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 30,
                maxWidth: 480,
                marginHorizontal: 'auto'
            }}>
                Excelência e confiabilidade em cada etapa do fornecimento
            </Text>

            {/* Grid 2x2 de diferenciais */}
            <View style={{ flexDirection: 'row', gap: 15, marginBottom: 15 }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EFF6FF',
                    padding: 22,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor: '#00A0E3'
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#00A0E3', marginBottom: 8 }}>
                        ✓ Certificação de Qualidade
                    </Text>
                    <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                        Gás carbônico com controle rigoroso e pureza certificada
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EFF6FF',
                    padding: 22,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor: '#00A0E3'
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#00A0E3', marginBottom: 8 }}>
                        ✓ Logística Própria
                    </Text>
                    <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                        Frota moderna com rastreabilidade e pontualidade
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 15 }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EFF6FF',
                    padding: 22,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor: '#00A0E3'
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#00A0E3', marginBottom: 8 }}>
                        ✓ Disponibilidade Total
                    </Text>
                    <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                        Fornecimento contínuo sem riscos de desabastecimento
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: '#EFF6FF',
                    padding: 22,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor: '#00A0E3'
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#00A0E3', marginBottom: 8 }}>
                        ✓ Suporte Especializado
                    </Text>
                    <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                        Equipe técnica pronta para atender suas necessidades
                    </Text>
                </View>
            </View>
        </View>

        {/* SECTION: CTA - REMOVED FOR 2-PAGE LIMIT */}

        {/* FOOTER */}
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1A1D29',
            paddingHorizontal: 40,
            paddingVertical: 18,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View>
                <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 3 }}>
                    {unitName}
                </Text>
                <Text style={{ fontSize: 8, color: '#9CA3AF' }}>
                    {unitAddress}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 3 }}>
                    {unitPhone} | {unitEmail}
                </Text>
                <Text style={{ fontSize: 9, color: '#00A0E3', fontWeight: 'bold' }}>
                    www.maqgases.com.br
                </Text>
            </View>
        </View>
    </Page>
);
