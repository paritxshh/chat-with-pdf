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
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf into smaller documents
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. vectorize and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocuments));

    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME!);

    console.log('Inserting vectors into pinecone...');
    const namespace = convertToAscii(fileKey);

    await pineconeIndex.namespace(namespace).upsert(vectors);

    return documents[0];

}

async function embedDocuments(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                pageNumber: doc.metadata.pageNumber,
                text: doc.metadata.text,
            }
        } as Vector;
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