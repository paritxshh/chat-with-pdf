import React from 'react'

const LoadingDots = () => {
    return (
        <div className="flex justify-start pr-10">
            <div className="rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10 font-poppins bg-gray-100">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingDots
