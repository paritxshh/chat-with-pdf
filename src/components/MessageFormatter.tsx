import React from 'react';

interface MessageFormatterProps {
  text: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ text }) => {
  // Split text into lines and process each line
  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle numbered lists (1., 2., etc.)
      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="font-semibold text-blue-600 mr-2 min-w-[2rem]">
              {trimmedLine.match(/^\d+/)?.[0]}.
            </span>
            <span className="flex-1">{trimmedLine.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      
      // Handle bullet points (-, *, •)
      if (/^[-*•]\s/.test(trimmedLine)) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="text-blue-600 mr-2 mt-1">•</span>
            <span className="flex-1">{trimmedLine.replace(/^[-*•]\s/, '')}</span>
          </div>
        );
      }
      
      // Handle empty lines
      if (trimmedLine === '') {
        return <div key={index} className="h-2" />;
      }
      
      // Handle regular paragraphs
      return (
        <p key={index} className="mb-2 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-sm max-w-none">
      {formatText(text)}
    </div>
  );
};

export default MessageFormatter;
