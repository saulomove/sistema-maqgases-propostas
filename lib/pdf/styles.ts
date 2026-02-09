import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed (optional for now, using Helvetica)
// Font.register({ family: 'Inter', src: '...' });

export const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 60,
        paddingHorizontal: 40,
        fontFamily: 'Inter',  // Changed from Helvetica
        fontSize: 10,
        lineHeight: 1.5,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        height: 60,
        borderBottomWidth: 1.5,
        borderBottomColor: '#00A0E3', // Brand Primary Blue (Vibrant)
        paddingBottom: 10,
    },
    logo: {
        width: 150,  // Increased from 120 for better visibility
        objectFit: 'contain',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 20,  // Increased from 14 for impact
        fontWeight: 900,  // ExtraBold
        color: '#1A1D29', // Dark gray/black for premium look
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 12,  // Increased from 9
        color: '#00A0E3', // Brand Primary Blue (Vibrant)
        textTransform: 'uppercase',
        marginTop: 4,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    proposalInfo: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 5,
    },
    labelValue: {
        fontSize: 9,
        color: '#333333',
    },

    // Institucional
    institutionalContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 20,
    },
    column: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,  // Increased from 14
        fontWeight: 900,  // ExtraBold
        color: '#1A1D29', // Dark for premium look
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    text: {
        fontSize: 10,
        color: '#333333',
        marginBottom: 5,
        textAlign: 'justify',
    },

    // Tabela
    table: {
        width: '100%',
        marginVertical: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#00A0E3', // Vibrant blue header
        borderTopWidth: 1,
        borderTopColor: '#00A0E3',
        borderBottomWidth: 1,
        borderBottomColor: '#00A0E3',
        alignItems: 'center',
        height: 35, // Taller for premium look
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
        minHeight: 30,
        paddingVertical: 5,
    },
    tableHeaderCell: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text on blue background
        flex: 1,
        paddingLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableCell: {
        fontSize: 9,
        color: '#111827', // Text-gray-900
        flex: 1,
        paddingLeft: 8,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30, // Raised
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: '#6B7280',
        lineHeight: 1.4,
    },

    // Images
    heroImage: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        marginTop: 20,
        borderRadius: 4,
    },

    // NEW: Premium Components
    heroOverlay: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(0, 160, 227, 0.92)', // Vibrant blue translucent
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
    },
    heroOverlayText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    featureBox: {
        backgroundColor: '#1A1D29', // Dark premium box
        padding: 20,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#00A0E3',
    },
    featureBoxLight: {
        backgroundColor: '#F7FAFC', // Light gray box
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#00A0E3',
    },
    featureTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#00A0E3',
        marginBottom: 4,
    },
    featureText: {
        fontSize: 9,
        color: '#4B5563',
        lineHeight: 1.4,
    },
    sectionHeaderLine: {
        height: 2,
        backgroundColor: '#00A0E3',
        width: '100%',
        marginBottom: 15,
    },
});
