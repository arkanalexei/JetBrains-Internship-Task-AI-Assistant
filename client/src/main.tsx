import ReactDOM from "react-dom/client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import { apiFetcher } from "./services/api";
import { BrowserRouter } from "react-router-dom";

import Routes from "./routes";
import "./index.css";

import en from "./locales/en/translation.json";
import id from "./locales/id/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    id: {
      translation: id,
    },
    en: {
      translation: en,
    },
  },
  debug: false,
  fallbackLng: "id",
  lng: localStorage.getItem("i18nextLng") || "en",
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RecoilRoot>
    <SWRConfig
      value={{
        fetcher: apiFetcher,
        shouldRetryOnError: false,
        revalidateOnMount: true,
        revalidateOnFocus: false,
      }}
    >
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </SWRConfig>
  </RecoilRoot>
  // </React.StrictMode>
);
