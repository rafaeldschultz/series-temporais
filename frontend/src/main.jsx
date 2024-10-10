import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { AppProvider } from "./contexts/AppContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
  </AppProvider>
);
