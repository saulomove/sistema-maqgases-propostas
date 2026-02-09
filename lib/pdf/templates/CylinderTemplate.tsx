import React from 'react';
import { Page, Text, View, Image, Svg, Path } from '@react-pdf/renderer';
import { styles } from '../styles';
import { ICONS } from '../icons';

interface CylinderTemplateProps {
    proposalNumber: string;
    date: string;
    unitName: string;
    unitAddress: string;
    unitPhone: string;
    unitEmail: string;
    logoSrc?: string | null;
    logoWhiteSrc?: string | null; // New prop for white logo
    heroSrc?: string | null;
}

export const CylinderTemplatePage1 = ({
    proposalNumber,
    date,
    unitName,
    unitAddress,
    unitPhone,
    unitEmail,
    logoSrc,
    logoWhiteSrc, // Receive prop
    heroSrc
}: CylinderTemplateProps) => (
    <Page size="A4" style={{ margin: 0, padding: 0, fontFamily: 'Inter' }}>
        {/* HERO SECTION - ULTRA COMPACT */}
        <View style={{
            position: 'relative',
            height: 240,  // DRASTICALLY reduced for page fit
            backgroundColor: '#1A1D29',
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
                            opacity: 0.32  // Increased from 0.2 - more visible now
                        }}
                    />
                    {/* Dark overlay */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(26, 29, 41, 0.72)'  // Lighter overlay for image visibility
                    }} />
                </>
            )}

            {/* Logo top left - Prefer White Logo on Dark Background */}
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
                <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.8, marginBottom: 2 }}>
                    Nº {proposalNumber}
                </Text>
                <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.8 }}>
                    {date}
                </Text>
            </View>

            {/* Main Hero Content - Bottom Aligned to avoid logo */}
            <View style={{
                position: 'absolute',
                bottom: 25,  // Pushed to bottom to clear the top-left logo
                left: 40,
                right: 40,
            }}>
                <Text style={{
                    fontSize: 36,  // Reduced from 48 to prevent logo overlap
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    marginBottom: 10,  // Reduced from 15
                    letterSpacing: -1
                }}>
                    PROPOSTA COMERCIAL
                </Text>
                <View style={{
                    width: 120,
                    height: 5,
                    backgroundColor: '#00A0E3',
                    marginBottom: 20
                }} />
                <Text style={{
                    fontSize: 14,  // Reduced from 16
                    fontWeight: 'bold',
                    color: '#00A0E3',
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                }}>
                    GASES EM CILINDROS
                </Text>
            </View>
        </View>

        {/* SECTION: SOLUÇÕES - VIBRANT BACKGROUND */}
        <View style={{
            backgroundColor: '#00A0E3',
            padding: 25,  // DRASTICALLY reduced
            paddingVertical: 20  // DRASTICALLY reduced
        }}>
            <Text style={{
                fontSize: 20,  // Reduced from 24
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 6,  // Minimal margin
                textAlign: 'center',
                letterSpacing: -0.5
            }}>
                Soluções Integradas em Gases
            </Text>
            <Text style={{
                fontSize: 11,
                color: '#FFFFFF',
                textAlign: 'center',
                opacity: 0.95,
                maxWidth: 450,
                marginHorizontal: 'auto',
                marginBottom: 12,  // Minimal
                lineHeight: 1.4
            }}>
                Expertise técnica para diferentes segmentos industriais,
                com qualidade certificada e suporte especializado
            </Text>

            {/* Grid de soluções - 2x3 - ULTRA COMPACT */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>  {/* Minimal gaps */}
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Standardized
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.FOOD} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Alimentos & Bebidas
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Conservação e qualidade
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Reduced for compactness
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.FACTORY} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Metalurgia
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Produtividade garantida
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Standardized
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.FLAME} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Gases Especiais
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Alta pureza e precisão
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Standardized
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.FLASK} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Química
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Processos otimizados
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Standardized
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.WELDING} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Solda e Corte
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Suporte técnico contínuo
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: 12,  // Standardized
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                        <Path d={ICONS.TRUCK} fill="#FFFFFF" />
                    </Svg>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                        Serviços
                    </Text>
                    <Text style={{ fontSize: 9, color: '#FFFFFF', opacity: 0.9, lineHeight: 1.4 }}>
                        Instalação e manutenção
                    </Text>
                </View>
            </View>
        </View>



        {/* FOOTER */}
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#F7FAFC',
            paddingHorizontal: 40,
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 3,
            borderTopColor: '#00A0E3'
        }}>
            <View>
                <Text style={{ fontSize: 9, color: '#1A1D29', fontWeight: 'bold', marginBottom: 2 }}>
                    {unitName}
                </Text>
                <Text style={{ fontSize: 8, color: '#6B7280' }}>
                    {unitAddress}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 2 }}>
                    {unitPhone} | {unitEmail}
                </Text>
                <Text style={{ fontSize: 8, color: '#00A0E3', fontWeight: 'bold' }}>
                    www.maqgases.com.br
                </Text>
            </View>
        </View>
    </Page>
);
