import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TrelloBoardProvider } from "./Context/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TrelloBoardProvider>
      <App />
    </TrelloBoardProvider>
  </StrictMode>
);
