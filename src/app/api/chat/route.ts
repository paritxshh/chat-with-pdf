import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';



export async function POST(req: Request) {
    try {
        const { messages, chatId } = await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        if (_chats.length != 1) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }
        const fileKey = _chats[0].fileKey;
        const lastMessage = messages[messages.length - 1];
        const context = await getContext(lastMessage.content, fileKey)

        const prompt = {
            role: "system",
            content: `You are an AI assistant that answers questions based ONLY on the content provided in the PDF document. Your role is to help users understand and extract information from the PDF they have uploaded.

            IMPORTANT INSTRUCTIONS:
            - You MUST only answer questions using information from the PDF content provided in the CONTEXT BLOCK below
            - If the PDF content does not contain the answer to a question, you must clearly state: "I cannot find that information in the PDF document you uploaded"
            - Do NOT use any external knowledge or information not present in the PDF
            - Do NOT make assumptions or provide information that isn't explicitly stated in the PDF
            - Always be helpful and friendly, but stay strictly within the bounds of the PDF content
            - If asked about topics not covered in the PDF, politely redirect to PDF-related questions

            PDF CONTENT (CONTEXT BLOCK):
            ${context}
            END OF PDF CONTENT

            Remember: Your answers must be based solely on the PDF content above. If the information isn't in the PDF, say so clearly.`,
        };

        // Validate messages
        if (!messages || !Array.isArray(messages)) {
            return Response.json({ error: 'Messages must be an array' }, { status: 400 });
        }

        // Convert messages to the format expected by the AI model
        const modelMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const result = await generateText({
            model: openai('gpt-3.5-turbo'),
            messages: modelMessages,
            system: prompt.content,
        });

        return Response.json({
            text: result.text,
            usage: result.usage,
            finishReason: result.finishReason
        });
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}