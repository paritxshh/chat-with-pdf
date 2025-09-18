'use client'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import MessageList from './MessageList'

type Props = {
    chatId: number;
}

type Message = {
    id: string;
    role: 'user' | 'assistant';
    parts: Array<{
        type: 'text';
        text: string;
    }>;
}

function ChatComponent({ chatId }: Props) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            parts: [{ type: 'text', text: input }]
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.parts[0].text
                    })),
                    chatId: chatId
                })
            });
            
            const data = await response.json();
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                parts: [{ type: 'text', text: data.text }]
            };
            
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    React.useEffect(() => {
        const messageContainer = document.getElementById('message-container');
        if(messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages])

    return (
        <div className='relative flex flex-col h-full' id='message-container'>
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold font-poppins'>Chat</h3>
            </div>

            <MessageList messages={messages} isLoading={isLoading}/>

            <form onSubmit={handleSubmit} className='p-2 bg-white'>
                <div className="flex">
                    <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder='Ask anything about the PDF' 
                        className='w-full' 
                        disabled={isLoading}
                    />
                    <Button type="submit" className='bg-blue-600 ml-2' disabled={isLoading}>
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent