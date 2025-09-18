import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from 'md5';
import { convertToAscii } from "./utils";

type Vector = {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
};

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    return pinecone;
};

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {
            pageNumber: number;
        }
    }
}

export async function loadS3IntoPinecone(fileKey: string) {
    // 1. obtain the pdf -> download and read from pdf
    console.log('downloading from s3...');
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error('Failed to download from s3');
    }
    console.log('Downloaded file:', file_name);
    
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    console.log('Loaded PDF pages:', pages.length);

    // 2. split and segment the pdf into smaller documents
    const documents = await Promise.all(pages.map(prepareDocument));
    console.log('Prepared documents:', documents.flat().length);

    // 3. vectorize and embed individual documents
    console.log('Creating embeddings...');
    const vectors = await Promise.all(documents.flat().map(embedDocuments));
    console.log('Created vectors:', vectors.length);

    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME!);

    console.log('Inserting vectors into pinecone...');
    const namespace = convertToAscii(fileKey);
    console.log('Using namespace:', namespace);

    await pineconeIndex.namespace(namespace).upsert(vectors);
    console.log('Successfully uploaded vectors to Pinecone');

    return documents[0];

}

async function embedDocuments(doc: Document) {
    try {
        console.log('Embedding document with content length:', doc.pageContent.length);
        console.log('Document metadata:', doc.metadata);
        
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        const vector = {
            id: hash,
            values: embeddings,
            metadata: {
                pageNumber: doc.metadata.pageNumber,
                text: doc.metadata.text,
            }
        } as Vector;
        
        console.log('Created vector with id:', hash, 'and metadata text length:', (doc.metadata.text as string)?.length || 0);
        return vector;
    } catch (error) {
        console.log('Error embedding documents', error);
        throw error;
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
    let {pageContent, metadata}  = page;
    pageContent = pageContent.replace(/\n/g, ' ');
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000),
            }
        })
    ])
    return docs;
}