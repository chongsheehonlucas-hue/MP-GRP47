
import { useEffect, useRef, useState } from "react";
import "./ChatbotPage.css";

function ChatbotPage() {
  const [mode, setMode] = useState("qa");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [pendingMessage, setPendingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, pendingMessage]);

  async function handleSubmit(event) {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading) return;

    setLoading(true);
    setPendingMessage(question);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: question,
          mode: mode,
          history: history,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Request failed (${response.status})`
        );
      }

      if (!Array.isArray(data.history)) {
        throw new Error("Unexpected response from the chatbot.");
      }

      // Save the updated conversation returned by FastAPI
      setHistory(data.history);
      setMessage("");
    } catch (err) {
      setError(err.message || "Unable to contact the AI.");
    } finally {
      setPendingMessage("");
      setLoading(false);
    }
  }

  function handleNewChat() {
    setHistory([]);
    setMessage("");
    setError("");
    setPendingMessage("");
  }

  return (
    <main className="chat-app">
      <section className="chat-container">

        <header className="chat-header">
          <div>
            <h1>Digital Forensics AI</h1>
            <p>Your AI-powered investigation assistant</p>
          </div>

          <button
            className="new-chat-btn"
            type="button"
            onClick={handleNewChat}
            disabled={loading}
          >
            + New Chat
          </button>
        </header>

        <div className="chat-modes">
          <button
            className={mode === "qa" ? "active" : ""}
            type="button"
            onClick={() => setMode("qa")}
            disabled={loading}
          >
            Forensics Q&A
          </button>

          <button
            className={mode === "scenario" ? "active" : ""}
            type="button"
            onClick={() => setMode("scenario")}
            disabled={loading}
          >
            Scenario Generator
          </button>
        </div>

        <div className="chat-messages" role="log" aria-live="polite">

          {history.length === 0 && !pendingMessage && (
            <div className="chat-welcome">
              <h2>Welcome to your AI Forensics Assistant</h2>
              <p>
                Ask questions about digital forensics or
                generate fictional investigation scenarios.
              </p>
            </div>
          )}

          {history.map((chat, index) => (
            <div
              key={index}
              className={`chat-message ${chat.role}`}
            >
              <span className="chat-sender">
                {chat.role === "user" ? "You" : "AI Assistant"}
              </span>

              <div className="chat-bubble">
                {chat.content}
              </div>
            </div>
          ))}

          {pendingMessage && (
            <div className="chat-message user">
              <span className="chat-sender">You</span>
              <div className="chat-bubble">
                {pendingMessage}
              </div>
            </div>
          )}

          {loading && (
            <div className="chat-message assistant">
              <span className="chat-sender">AI Assistant</span>
              <div className="chat-bubble">
                Generating response...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={
              mode === "qa"
                ? "Ask a digital forensics question..."
                : "Describe the scenario you want to generate..."
            }
            rows={3}
            maxLength={2000}
            disabled={loading}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />

          <div className="chat-form-footer">
            <span>
              Enter to send · Shift + Enter for a new line
            </span>

            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
              {loading ? "Generating..." : "Send Message"}
            </button>
          </div>
        </form>

      </section>
    </main>
  );
}

export default ChatbotPage;
