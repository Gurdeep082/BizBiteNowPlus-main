import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";


import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import { FavouriteProvider } from "./context/FavouriteContext";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
// A development server does not serve a generated service worker. Registering
// one here can cache an old build on LAN devices and result in a blank page.
if (!import.meta.env.DEV) {
  registerSW({ immediate: true });
} else if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  // <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
        <AuthProvider>
          <FavouriteProvider>

            <App />
            <ToastContainer position="top-right" autoClose={3500} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover />

          </FavouriteProvider>
        </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
