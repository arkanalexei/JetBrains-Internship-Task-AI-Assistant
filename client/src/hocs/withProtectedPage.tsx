import { ComponentType } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../atoms/authState";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";

function withProtectedPage(
  Component: ComponentType,
  FallbackComponent?: ComponentType
) {
  return function WithProtectedPage() {
    const auth = useRecoilValue(authState);

    if (!auth.isAuth) {
      return FallbackComponent ? <FallbackComponent /> : <Navigate to="/" />;
    }

    return (
      <div className="h-[calc(100dvh)]">
        {window.location.pathname.startsWith("/chats") ? (
          <Sidebar>
            <Component />
          </Sidebar>
        ) : (
          <Component />
        )}
      </div>
    );
  };
}

export default withProtectedPage;
