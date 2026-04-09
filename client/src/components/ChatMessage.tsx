import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { GiOilySpiral } from "react-icons/gi";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  date?: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  isUser,
  message,
  date,
  isLoading = false,
}) => {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 items-start gap-3 flex-1 max-w-full`}
    >
      {!isUser && (
        <div className="flex items-center p-1 mt-2 border border-red-400 rounded-full">
          {isLoading ? (
            <div className="animate-spin">
              <GiOilySpiral className="text-xl text-red-red2 scale-x-[-1]" />
            </div>
          ) : (
            <GiOilySpiral className="text-xl text-red-red2" />
          )}
        </div>
      )}
      <div className="flex max-w-full flex-col items-end overflow-auto">
        <div
          className={`lg:max-w-xl break-words max-w-full p-4 whitespace-pre-wrap rounded-lg ${
            isUser
              ? "bg-[#da291c] text-white rounded-tr-none"
              : "bg-gray-200 text-black rounded-tl-none dark:bg-[#25282A] dark:text-white"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <span className="text-sm animate-pulse">Thinking...</span>
            </div>
          ) : (
            <ReactMarkdown
              className="max-w-full"
              rehypePlugins={[rehypeRaw]}
              components={{
                a: (props) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} className="text-blue-500" />
                ),
                ol: ({ children }) => (
                  <ol className="ml-5 whitespace-normal list-decimal">
                    {children}
                  </ol>
                ),
                ul: ({ children }) => (
                  <ul className="ml-5 whitespace-normal list-disc">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="whitespace-normal">{children}</li>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
        {isUser && date && (
          <div id="chat-message-date" className="w-full mt-1 text-xs text-right text-gray-500">
            {date}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
