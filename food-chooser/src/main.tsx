import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const appElement = import.meta.env.DEV ? (
  <App />
) : (
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(appElement);
