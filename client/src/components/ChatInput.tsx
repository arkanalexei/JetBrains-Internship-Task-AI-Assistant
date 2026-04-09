import { Input, Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { FormEvent, useState, KeyboardEvent } from "react";
const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    setIsFocused(false);
    setIsHovered(false);
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && message.trim() !== "") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-transparent">
      <form
        className={`flex items-end w-[90%] md:w-[55%] p-2 bg-gray-200 border rounded-lg dark:bg-[#25282A] dark:border-[#25282A]
          ${
          (isFocused || isHovered) && !isLoading ? 'border-gray-400 dark:border-gray-600' 
          : 'border-gray-200 dark:border-[#25282A]'
        }`}
        onSubmit={handleSend}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 5 }}
          placeholder="Message ComplianceGPT"
          className="flex-1 p-2 bg-transparent border-none rounded-lg hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:bg-transparent ring-0 hover:ring-0 focus:ring-0 active:ring-0 scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-red-red2 placeholder:text-gray-500 dark:placeholder-gray-400 dark:placeholder-opacity-60"
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        <Button
          shape="circle"
          htmlType="submit"
          className={`ml-2 border 
            ${
            isLoading || message.trim() === ""
              ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-[#25282A] dark:text-gray-400 "
              : "bg-red-red2 text-white hover:bg-red-600 border-none"
          }`}
          icon={
            <ArrowUpOutlined
              className={`${
                isLoading || message.trim() === ""
                  ? "text-gray-500"
                  : "group-hover:text-red-600"
              }`}
            />
          }
          disabled={isLoading || message.trim() === ""}
        />
      </form>
    </div>
  );
};

export default ChatInput;
