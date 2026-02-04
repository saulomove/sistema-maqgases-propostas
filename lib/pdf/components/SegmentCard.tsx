import React from 'react';
import { Text, View, Svg, Path } from '@react-pdf/renderer';

interface SegmentCardProps {
    title: string;
    description: string;
    iconPath: string;
    iconScale?: number;
}

export const SegmentCard = ({ title, description, iconPath, iconScale = 1 }: SegmentCardProps) => (
    <View style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
        border: '1px solid #E2E8F0', // slate-200
        alignItems: 'center',
        width: '48%', // Approx 2 columns
    }}>
        {/* Icon Container */}
        <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#EFF6FF', // blue-50
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8
        }}>
            <Svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                <Path d={iconPath} fill="#0B9BD9" />
            </Svg>
        </View>

        {/* Text Container */}
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 }}>
                {title}
            </Text>
            <Text style={{ fontSize: 7, color: '#64748B', lineHeight: 1.2 }}>
                {description}
            </Text>
        </View>
    </View>
);
