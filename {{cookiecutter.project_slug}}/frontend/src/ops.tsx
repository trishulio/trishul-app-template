import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorHandler } from "./lib/errorHandler";
import { OpsApp } from "./OpsApp.tsx";

ErrorHandler.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OpsApp />
  </StrictMode>,
);
