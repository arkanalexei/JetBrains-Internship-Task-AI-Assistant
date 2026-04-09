import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";
import withProtectedPage from "../../hocs/withProtectedPage";
import { message as antdMessage, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { loadingChat } from "../../atoms/loadingChat";
// import _debounce from "lodash/debounce";
import createEventSource from "../../services/eventSource";
import { GiOilySpiral } from "react-icons/gi";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/variants";
import PlaceholderMessages from "../../components/PlaceholderMessage";
import { currentModelState } from "../../atoms/currentModelState";
import Show from "../../components/Show";

const ChatPage = () => {
  const [messages, setMessages] = useState<
    { message: string; isUser: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useRecoilState(loadingChat);
  const currentModel = useRecoilValue(currentModelState);

  const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message, isUser: true },
      { message: "", isUser: false },
    ]);
    setIsLoading(true);

    const token = encodeURIComponent(
      localStorage.getItem("username") || "Anonymous"
    );
    const new_conv_id = encodeURIComponent(token + "-" + Date.now());

    if (!new_conv_id || !token) return;

    const eventSource = createEventSource({
      message,
      convId: new_conv_id,
      token,
      model_type: currentModel,
    });

    let messageReceived = false;

    // const delayedEvent = _debounce(() => {
    //   navigate(`/chats/${new_conv_id}`);
    // }, 2000);

    eventSource.onmessage = (event) => {
      const newLines = event.data;
      const newLinesObj = JSON.parse(newLines);
      // delayedEvent();
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
      navigate(`/chats/${new_conv_id}`);
    };

    eventSource.onopen = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full py-6 mx-auto">
      <Show
        when={messages.length === 0}
        fallback={
          <div className="flex flex-col items-center w-full overflow-y-auto scrollbar scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-red-red2">
            <div className="flex flex-col w-[93%] md:w-1/2 pb-2 max-w-full">
            <Divider className="pt-2 text-center !border-gray-300 dark:!border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
            </Divider>
              {messages.map((msg, index) => (
                <Show
                  when={msg.message === ""}
                  fallback={
                    <ChatMessage
                      key={index}
                      message={msg.message}
                      date="now"
                      isUser={msg.isUser}
                    />
                  }
                >
                  <ChatMessage
                    key={index}
                    message=""
                    isUser={false}
                    isLoading={true}
                  />
                </Show>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, loop: Infinity }}
              className="flex items-center p-1 border-[2px] border-red-400 rounded-full"
            >
              <GiOilySpiral className="text-3xl text-red-red2 scale-x-[-1]" />
            </motion.div>
            <div className="text-center">
              <motion.h1
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                animate="show"
                className="text-2xl font-semibold text-red-red2"
              >{`Welcome, ${localStorage.getItem("username")}!`}</motion.h1>
              <motion.p
                variants={fadeIn("left", 0.2)}
                initial="hidden"
                animate="show"
                className="text-lg text-gray-600 dark:text-white"
              >
                Start chatting with the Compliance GPT
              </motion.p>
            </div>
            <PlaceholderMessages onSend={handleSend} />
          </div>
        </div>
      </Show>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

const WithProtectedNewChatPage = withProtectedPage(ChatPage);

export default WithProtectedNewChatPage;
