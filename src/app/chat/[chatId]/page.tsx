import ChatSideBar from '@/components/ChatSideBar';
import ChatComponent from '@/components/ChatComponent';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params: Promise<{
        chatId: string;
    }>;
};

const ChatPage = async ({ params }: Props) => {
    const { chatId } = await params;
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }
    
    // Debug logging
    console.log('ChatPage - chatId:', chatId, 'userId:', userId);
    
    // Validate chatId is a valid number
    const numericChatId = parseInt(chatId);
    if (isNaN(numericChatId)) {
        console.log('ChatPage - invalid chatId, redirecting to home');
        return redirect('/');
    }
    
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    console.log('ChatPage - found chats:', _chats.length, 'chats for user');
    console.log('ChatPage - looking for chatId:', numericChatId);
    console.log('ChatPage - available chat IDs:', _chats.map(chat => chat.id));
    
    // Check if the specific chat exists and belongs to the user
    const currentChat = _chats.find((chat) => chat.id === numericChatId);
    console.log('ChatPage - currentChat found:', !!currentChat);
    
    if (!currentChat) {
        console.log('ChatPage - redirecting to home because chat not found');
        return redirect('/');
    }

    return (
            <div className='flex w-full h-dvh'>
                {/* chat sidebar */}
                <div className='w-[20%] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={numericChatId} />
                </div>

                {/* pdf viewer */}
                <div className='flex-1'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>

                {/* chat component */}
                <div className='w-[30%] max-w-lg border-l-2 border-l-slate-200'>
                    <ChatComponent chatId={numericChatId} />
                </div>
            </div>
    )
}

export default ChatPage