import { Font } from '@react-pdf/renderer';
import path from 'path';

// Registrar fonte Inter para uso nos PDFs
// Fontes devem estar em /public/fonts/
try {
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');

    Font.register({
        family: 'Inter',
        fonts: [
            {
                src: path.join(fontsDir, 'Inter-Regular.ttf'),
                fontWeight: 400,
            },
            {
                src: path.join(fontsDir, 'Inter-Bold.ttf'),
                fontWeight: 700,
            },
            {
                src: path.join(fontsDir, 'Inter-ExtraBold.ttf'),
                fontWeight: 900,
            },
        ],
    });

    console.log('✅ Inter fonts registered successfully');
} catch (error) {
    console.error('⚠️ Error registering Inter fonts, falling back to Helvetica:', error);
}

// Export vazio para garantir que seja um módulo
export { };
