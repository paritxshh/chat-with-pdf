import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    console.log('Querying Pinecone with embeddings length:', embeddings.length);
    console.log('Pinecone API Key exists:', !!process.env.PINECONE_API_KEY);
    console.log('Pinecone Index Name:', process.env.PINECONE_INDEX_NAME);
    
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = await pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    try {
        const namespace = convertToAscii(fileKey);
        console.log('Using namespace:', namespace);
        
        const queryResult = await index.namespace(namespace).query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true
        })
        console.log('Pinecone query result:', queryResult);
        return queryResult.matches || [];
    } catch (error) {
        console.log("Error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    console.log('Getting context for query:', query);
    console.log('File key:', fileKey);
    
    const queryEmbeddings = await getEmbeddings(query);
    console.log('Query embeddings length:', queryEmbeddings.length);
    
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    console.log('Total matches found:', matches.length);
    console.log('Matches:', matches.map(m => ({ score: m.score, text: (m.metadata as { text?: string })?.text?.substring(0, 100) })));

    const qualifyingDocs = matches.filter(match => match.score && match.score > 0.3);
    console.log('Qualifying docs (score > 0.3):', qualifyingDocs.length);

    type Metadata = {
        text: string;
        pageNumber: number;
    }

    const docs = qualifyingDocs.map(match => (match.metadata as Metadata).text);
    const context = docs.join('\n').substring(0, 3000);
    console.log('Final context length:', context.length);
    console.log('Context preview:', context.substring(0, 200));
    
    return context;
}