import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";
import withProtectedPage from "../../hocs/withProtectedPage";
import { LoadingOutlined } from "@ant-design/icons";
import { Divider, Spin, message as antdMessage } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { loadingChat } from "../../atoms/loadingChat";
import createEventSource from "../../services/eventSource";
import { formatDateOnly, formatTimeOnly } from "../../utils/timestamp";
import { currentModelState } from "../../atoms/currentModelState";
import Show from "../../components/Show";

interface Message {
  content: string;
  isUser: boolean;
  date: number;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<
    { message: string; isUser: boolean; date?: string; timestamp?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useRecoilState(loadingChat);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const currentModel = useRecoilValue(currentModelState);

  const location = useLocation();
  const navigate = useNavigate();
  const conv_id = location.pathname.split("/").pop();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!conv_id) return;

    setIsFetching(true);
    try {
      const response = await api.get(`fetch_messages/${conv_id}`);
      const data: Message[] = response.data;
      setMessages(
        data.map((msg) => ({
          message: msg.content,
          isUser: msg.isUser,
          timestamp: msg.date,
          date: formatDateOnly(msg.date),
        }))
      );
    } catch (error) {
      const apiError = error.response?.data as APIError;
      antdMessage.error(apiError.message || "Failed to fetch messages");
      navigate("/chats");
    } finally {
      setIsFetching(false);
    }
  }, [conv_id, navigate]);

  useEffect(() => {
    setIsLoading(false);
    fetchMessages();
  }, [fetchMessages, setIsLoading]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message,
        isUser: true,
        date: formatDateOnly(Date.now()),
      },
      { message: "", isUser: false },
    ]);
    setIsLoading(true);

    const token = encodeURIComponent(
      localStorage.getItem("username") || "Anonymous"
    );
    if (!conv_id || !token) return;

    const eventSource = createEventSource({
      message,
      convId: conv_id,
      token,
      model_type: currentModel,
    });

    let messageReceived = false;

    eventSource.onmessage = (event) => {
      const newLines = event.data;
      const newLinesObj = JSON.parse(newLines);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].message += newLinesObj["answer"];
        return newMessages;
      });

      messageReceived = true;
      // setIsLoading(false);
    };

    eventSource.onerror = () => {
      if (!messageReceived) {
        antdMessage.error(
          "Failed to receive messages. Please check your connection or try again."
        );
        setMessages((prevMessages) => [...prevMessages.slice(0, -2)]);
      }
      setIsLoading(false);
      eventSource.close();
    };

    eventSource.onopen = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="default" indicator={<LoadingOutlined spin />} />
      </div>
    );
  }

  const renderMessages = () => {
    let lastDate: string | undefined = undefined;

    return messages.map((msg, index) => {
      const showDateHeader = msg.date !== lastDate && msg.isUser;
      lastDate = msg.isUser ? msg.date : lastDate;

      const messageTime = msg.timestamp ? formatTimeOnly(msg.timestamp) : "";

      return (
        <div className="max-w-full" key={index}>
          <Show when={showDateHeader}>
            <Divider className="pt-2 text-center !border-gray-300 dark:!border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">{msg.date}</div>
            </Divider>
          </Show>
          <ChatMessage
            message={msg.message}
            isUser={msg.isUser}
            date={
              msg.date === "Today" && !msg.timestamp && msg.isUser
                ? "now"
                : messageTime
            }
            isLoading={msg.message === ""}
          />
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full py-6 mx-auto">
      <div className="flex flex-col items-center w-full overflow-y-auto scrollbar scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-red-red2">
        <div className="flex flex-col w-[88%] md:w-1/2 pb-2 max-w-full">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

const WithProtectedChatPage = withProtectedPage(ChatPage);

export default WithProtectedChatPage;
