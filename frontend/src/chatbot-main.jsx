
import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotPage from "./pages/ChatbotPage.jsx";

createRoot(document.getElementById("chatbot-root")).render(
  <React.StrictMode>
    <ChatbotPage />
  </React.StrictMode>
);
