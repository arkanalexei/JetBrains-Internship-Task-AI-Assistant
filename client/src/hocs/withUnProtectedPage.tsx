import { ComponentType } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../atoms/authState";
import { Navigate } from "react-router-dom";
import { Watermark } from "antd";
import { darkMode } from "../atoms/darkMode";

function withUnProtectedPage(
  Component: ComponentType,
  FallbackComponent?: ComponentType
) {
  return function WithUnProtectedPage() {
    const auth = useRecoilValue(authState);
    const isDarkMode = useRecoilValue(darkMode);
    if (auth.isAuth) {
      return <Navigate to="/chats" />;
    }
    return (
      <Watermark
        content="CRAYON 2024"
        font={{
          color: `${
            isDarkMode ? "rgba(245, 245, 245, 0.2)" : "rgba(30, 32, 33, 0.2)"
          }`,
        }}
        className="w-full h-[calc(100dvh)]"
        gap={[100, 100]}
      >
        <div className="relative z-10">
          {FallbackComponent ? <FallbackComponent /> : <Component />}
        </div>
      </Watermark>
    );
  };
}

export default withUnProtectedPage;
