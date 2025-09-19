import { cn } from '@/lib/utils'
import { UIMessage } from '@ai-sdk/react';
import React from 'react'
import LoadingDots from './LoadingDots'
import MessageFormatter from './MessageFormatter'

type Props = {
    messages: UIMessage[]
    isLoading?: boolean
    scrollRef?: React.RefObject<HTMLDivElement | null>
}

const MessageList = ({ messages, isLoading, scrollRef }: Props) => {
    if (!messages) return <div className='flex-1'></div>
    
    return (
        <div className='flex flex-col flex-1 overflow-y-scroll my-2 pb-4 gap-4 px-4'>   
            {messages.map(message => {
                return (
                    <div key={message.id} className={
                        cn('flex', {
                            'justify-end pl-10': message.role === 'user',
                            'justify-start pr-10': message.role === 'assistant',
                        })
                    }>
                        <div className={
                            cn('rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10 font-poppins', {
                                'bg-blue-600 text-white': message.role === 'user',
                            })
                        }>
                            {message.role === 'user' ? (
                                <p>{message.parts?.[0]?.type === 'text' ? message.parts[0].text : ''}</p>
                            ) : (
                                <MessageFormatter text={message.parts?.[0]?.type === 'text' ? message.parts[0].text : ''} />
                            )}
                        </div>
                    </div>
                )
            })}
            {isLoading && <LoadingDots />}
            <div ref={scrollRef} />
        </div>
    )
}

export default MessageList