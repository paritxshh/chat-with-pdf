'use client'
import React, { useState, useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send, MessageCircle, Sparkles } from 'lucide-react'
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className='relative flex flex-col h-dvh' id='message-container'>
            <div className='sticky top-0 inset-x-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200/60 backdrop-blur-sm z-10'>
                <div className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm'>
                            <MessageCircle className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-xl font-bold font-poppins text-gray-900 tracking-tight'>
                                PaperTalk<span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>.ai</span>
                            </h3>
                            <p className='text-sm text-gray-600 font-medium font-poppins'>
                                Chat with your PDF
                            </p>
                        </div>
                        <div className='flex items-center gap-1 px-3 py-1.5 bg-white/70 rounded-full border border-gray-200/50'>
                            <Sparkles className='w-4 h-4 text-blue-500' />
                            <span className='text-xs font-medium text-gray-700 font-poppins'>AI Powered</span>
                        </div>
                    </div>
                </div>
            </div>

            <MessageList messages={messages} isLoading={isLoading} scrollRef={messagesEndRef}/>

            <form onSubmit={handleSubmit} className='p-4 bg-white border-t border-gray-200/60'>
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <Input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder='Ask anything about your PDF...' 
                            className='w-full pl-4 pr-4 py-3 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl shadow-sm bg-gray-50/50 focus:bg-white transition-all duration-200' 
                            disabled={isLoading}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-3 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed' 
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent