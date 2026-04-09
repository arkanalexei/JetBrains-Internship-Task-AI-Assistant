import { useRecoilState } from "recoil";
import { darkMode } from "../atoms/darkMode";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";

const DarkModeBtn = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkMode);

  // handle dark mode toggle
  const handleDarkMode = () => {
    const newMode = !isDarkMode;
    localStorage.setItem("darkMode", newMode.toString());
    setIsDarkMode(newMode);
  };

  return (
    <button
      className={`absolute top-4 right-4 z-10 p-2 rounded-md focus:outline-none transform transition-all duration-300 ease-in-out border-[1px] overflow-hidden
                ${
                  isDarkMode
                    ? "bg-gray-800 text-yellow-300 hover:bg-gray-700 border-yellow-300"
                    : "bg-yellow-300 text-gray-800 hover:bg-yellow-200 border-gray-800"
                }
            `}
      onClick={() => handleDarkMode()}
    >
      {isDarkMode ? (
        <motion.div
          key="moon"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <FiMoon />
        </motion.div>
      ) : (
        <motion.div
          key="sun"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <FiSun />
        </motion.div>
      )}
    </button>
  );
};

export default DarkModeBtn;
