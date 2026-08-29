import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorHandler } from "./lib/errorHandler";
import { initSentry } from "./lib/sentry";

initSentry();
ErrorHandler.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
