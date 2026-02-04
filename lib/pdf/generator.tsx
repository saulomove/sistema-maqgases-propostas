import { renderToStream } from '@react-pdf/renderer';
import { ProposalDocument } from './document';

export async function generateProposalPDFStream(data: any) {
    return await renderToStream(<ProposalDocument data={ data } />);
}
