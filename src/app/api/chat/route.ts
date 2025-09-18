import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';


export async function POST(req:Request) {
    try {
        const {messages} = await req.json();
        
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