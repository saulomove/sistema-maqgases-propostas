import { renderToStream } from '@react-pdf/renderer';
import { ProposalDocument } from './document';
import './fonts'; // Register Inter fonts

export async function generateProposalPDFStream(data: any) {
    return await renderToStream(<ProposalDocument data={data} />);
}
