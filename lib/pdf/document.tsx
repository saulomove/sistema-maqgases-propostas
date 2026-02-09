import { Document } from '@react-pdf/renderer';
import { LiquidTemplatePage1 } from './templates/LiquidTemplate';
import { CylinderTemplatePage1 } from './templates/CylinderTemplate';
import { DataPage } from './templates/DataPage';

// Types
interface ProposalData {
    id: number;
    numero: string;
    tipo: 'cilindro' | 'liquido';
    date: string;
    clienteNome: string;
    clienteLocalEntrega: string;
    locacao?: {
        active: boolean;
        quantity: number;
        unitPrice: number;
        total: number;
    };
    items: any[];
    unit: {
        nome: string;
        endereco: string;
        telefone: string;
        email: string;
    };
    seller: {
        nome: string;
    };
    images?: {
        logo: string | null;
        logoWhite?: string | null; // Optional
        hero: string | null;
    };
}

export const ProposalDocument = ({ data }: { data: ProposalData }) => {
    return (
        <Document>
            {/* Page 1: Type specific cover */}
            {data.tipo === 'liquido' ? (
                <LiquidTemplatePage1
                    proposalNumber={data.numero}
                    date={data.date}
                    unitName={data.unit.nome}
                    unitAddress={data.unit.endereco}
                    unitPhone={data.unit.telefone}
                    unitEmail={data.unit.email}
                    logoSrc={data.images?.logo}
                    logoWhiteSrc={data.images?.logoWhite} // Pass white logo
                    heroSrc={data.images?.hero}
                />
            ) : (
                <CylinderTemplatePage1
                    proposalNumber={data.numero}
                    date={data.date}
                    unitName={data.unit.nome}
                    unitAddress={data.unit.endereco}
                    unitPhone={data.unit.telefone}
                    unitEmail={data.unit.email}
                    logoSrc={data.images?.logo}
                    logoWhiteSrc={data.images?.logoWhite} // Pass white logo
                    heroSrc={data.images?.hero}
                />
            )}

            {/* Page 2: Technical Data */}
            <DataPage
                type={data.tipo}
                proposalNumber={data.numero}
                date={data.date}
                unitName={data.unit.nome}
                unitAddress={data.unit.endereco}
                unitPhone={data.unit.telefone}
                unitEmail={data.unit.email}
                clientName={data.clienteNome}
                clientLocation={data.clienteLocalEntrega}
                sellerName={data.seller.nome}
                items={data.items}
                locacao={data.locacao}
            />
        </Document>
    );
};
