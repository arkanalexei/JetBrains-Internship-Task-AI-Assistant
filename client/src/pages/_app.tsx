import { ConfigProvider } from "antd";
import { ReactNode, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { darkMode } from "../atoms/darkMode";
import DarkModeBtn from "../components/DarkModeBtn";

interface Props {
  children: ReactNode;
}

export default function App({ children }: Props) {
  const isDarkMode = useRecoilValue(darkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDarkMode ? '#da291c' : '#da291c',
          colorError: '#f14545',
          colorBgLayout: isDarkMode ? '#1E2021' : '#F5F5F5',
          colorBgContainer: isDarkMode ? '#181A1B' : '#FFFFFF',
          colorText: isDarkMode ? "#FFFFFF" : "#000000",
          colorTextDisabled: isDarkMode ? "#8C8C8C" : "#8C8C8C",
          colorTextPlaceholder: isDarkMode ? "#8C8C8C" : "#8C8C8C",
          colorBgTextHover: isDarkMode ? "#2D2F30" : "#F0F0F0",
        },
      }}
    >
      {children}
      <DarkModeBtn />
    </ConfigProvider>
  );
}
