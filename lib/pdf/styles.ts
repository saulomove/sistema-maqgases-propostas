import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed (optional for now, using Helvetica)
// Font.register({ family: 'Inter', src: '...' });

export const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 60,
        paddingHorizontal: 40,
        fontFamily: 'Helvetica',
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
        borderBottomColor: '#00A8E8', // Brand Light Blue
        paddingBottom: 10,
    },
    logo: {
        width: 120,
        objectFit: 'contain',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#003366', // Brand Dark Blue
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 9,
        color: '#00A8E8', // Brand Light Blue
        textTransform: 'uppercase',
        marginTop: 2,
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#003366', // Brand Dark Blue
        marginBottom: 8,
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
        backgroundColor: '#F9FAFB', // Lighter gray
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        alignItems: 'center',
        height: 30, // Taller header
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
        color: '#6B7280', // Text-gray-500
        flex: 1,
        paddingLeft: 8,
        textTransform: 'uppercase',
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
    }
});
