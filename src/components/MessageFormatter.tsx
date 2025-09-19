import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageFormatterProps {
  text: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ text }) => {
  return (
    <div className="prose prose-sm max-w-none prose-blue">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize list styling
          ul: ({ children }) => (
            <ul className="list-disc list-outside space-y-1 my-2 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside space-y-1 my-2 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed pl-1">
              {children}
            </li>
          ),
          // Customize paragraph styling
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-gray-700">
              {children}
            </p>
          ),
          // Customize heading styling
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-2 mt-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-900 mb-1 mt-2">
              {children}
            </h3>
          ),
          // Customize code styling
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono break-words">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} break-words`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2 max-w-full break-words whitespace-pre-wrap">
              {children}
            </pre>
          ),
          // Customize blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-2">
              {children}
            </blockquote>
          ),
          // Customize link styling
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MessageFormatter;
