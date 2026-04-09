import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/variants";
import { AiOutlineQuestionCircle } from "react-icons/ai";

interface PlaceholderMessageProps {
  message: string;
  icon: React.ReactNode;
  t: number;
  animate: boolean;
  onSend: (message: string) => void;
}

const PlaceholderMessage: React.FC<PlaceholderMessageProps> = ({
  message,
  icon,
  t,
  animate,
  onSend,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", t)}
      initial="hidden"
      animate={animate ? "show" : "hidden"}
      className="flex flex-row md:flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-red-red2 md:w-[15%] mx-4 md:mx-0"
      onClick={() => onSend(message)}
    >
      <div className="xl:w-full text-gray-600 dark:text-white flex justify-center">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-white">{message}</p>
    </motion.div>
  );
};

const questionList = [
  {
    message:
    "Bagaimana prosedur pelaporan transaksi mencurigakan?",
    icon: <AiOutlineQuestionCircle />,
    t: 0.15,
  },
  {
    message: "Apakah peraturan dengan nomor 11/1/PBI/2009 masih berlaku?",
    icon: <AiOutlineQuestionCircle />,
    t: 0.3,
  },
  {
    message: "Apa peraturan yang harus diperhatikan mengenai pengembangan produk QRIS Cross Border?",
    icon: <AiOutlineQuestionCircle />,
    t: 0.45,
  },
  {
    message: "What is the maximum nominal of QRIS Transaction?",
    icon: <AiOutlineQuestionCircle />,
    t: 0.6,
  },
];

interface PlaceholderMessagesProps {
  onSend: (message: string) => void;
}

const PlaceholderMessages: React.FC<PlaceholderMessagesProps> = ({
  onSend,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  return (
    <div className="flex flex-col justify-center gap-4 mt-4 md:flex-row">
      {questionList.map((question, index) => (
        <PlaceholderMessage
          key={index}
          message={question.message}
          icon={question.icon}
          t={question.t}
          animate={hasAnimated}
          onSend={onSend}
        />
      ))}
    </div>
  );
};

export default PlaceholderMessages;
