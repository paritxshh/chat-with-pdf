'use client'
import React from 'react';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import NewChatDialog from './NewChatDialog';

type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({chats, chatId}: Props) => {
  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    
    if (nameWithoutExt.length <= maxLength - (extension?.length || 0) - 1) {
      return fileName;
    }
    
    const charsToShow = Math.max(3, maxLength - (extension?.length || 0) - 4); // 4 for "...."
    const start = nameWithoutExt.substring(0, charsToShow);
    const end = nameWithoutExt.substring(nameWithoutExt.length - 3);
    
    return `${start}....${end}.${extension}`;
  };

  return (
    <div className='w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-gray-700'>
            <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                    <MessageCircle className='w-4 h-4 text-white' />
                </div>
                <div>
                    <h2 className='text-lg font-bold text-white font-poppins'>PaperTalk.ai</h2>
                    <p className='text-xs text-gray-400'>Chat History</p>
                </div>
            </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
            {chats.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center px-4'>
                    <MessageCircle className='w-12 h-12 text-gray-600 mb-3' />
                    <p className='text-gray-400 text-sm font-poppins'>No chats yet</p>
                    <p className='text-gray-500 text-xs mt-1'>Start a new conversation below</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {chats.map(chat => (
                        <Link key={chat.id} href={`/chat/${chat.id}`}>
                            <div className={
                                cn(
                                    'rounded-lg p-3 text-slate-300 flex items-center group transition-all duration-200', {
                                        'bg-blue-600 text-white shadow-lg': chat.id === chatId,
                                        'hover:bg-gray-700 hover:text-white': chat.id !== chatId,
                                    }
                                )
                            }>
                                <MessageCircle className={cn('mr-3 flex-shrink-0', {
                                    'w-4 h-4': true,
                                    'text-blue-200': chat.id === chatId,
                                    'text-gray-400 group-hover:text-white': chat.id !== chatId
                                })} />
                                <p className='w-full overflow-hidden text-sm whitespace-nowrap font-poppins' title={chat.pdfName}>
                                    {truncateFileName(chat.pdfName)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

        {/* Footer with New Chat Button */}
        <div className='p-4 border-t border-gray-700'>
            <NewChatDialog />
        </div>
    </div>
  )
}

export default ChatSideBar;