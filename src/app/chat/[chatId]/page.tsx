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
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!_chats) {
        return redirect('/');
    }
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect('/');
    }

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

    return (
            <div className='flex w-full h-dvh'>
                {/* chat sidebar */}
                <div className='w-[20%] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                </div>

                {/* pdf viewer */}
                <div className='flex-1'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>

                {/* chat component */}
                <div className='w-[30%] max-w-lg border-l-2 border-l-slate-200'>
                    <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
    )
}

export default ChatPage