"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const SUGGESTIONS = [
  "What products do you have?",
  "Tell me about the MacBook Air M3",
  "What is the price of MacBook Air M3?",
  "What is the status of ORD-102?",
  "Can I get a refund?",
  "What is your refund policy?",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hi! I'm the NexaCart assistant — an AI support agent. I can help with products, orders, and refunds. What can I do for you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initialQueryHandled = useRef(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialQueryHandled.current) {
      const params = new URLSearchParams(window.location.search);
      const initialQ = params.get("q");
      if (initialQ && initialQ.trim()) {
        initialQueryHandled.current = true;
        handleSend(initialQ.trim());
      }
    }
  }, []);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || input).trim();
    if (!textToSend || loading) return;

    setErrorMessage(null);
    setInput("");

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error status ${res.status}`);
      }

      const data = await res.json();
      const answer = data.answer || "I could not find an answer to that question.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: answer,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage("Unable to reach the AI support backend. Please ensure the Python backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-1",
        sender: "ai",
        text: "Chat cleared! How can I help you with your NexaCart products, orders, or refunds?",
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow flex flex-col max-w-[1024px] w-full mx-auto p-md gap-lg pb-xl">
        <div className="px-md mb-md">
          <h1 className="font-display text-[40px] font-normal text-primary mb-2 tracking-tight">
            Chat with support
          </h1>
          <p className="text-on-surface-variant text-[20px] max-w-2xl">
            You're talking to an AI support assistant. Ask about a product, an order number, or a refund.
          </p>
        </div>

        {errorMessage && (
          <div className="mx-md p-md rounded-xl bg-error-container text-on-error-container border border-error/30 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-error">error</span>
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs underline hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat Canvas */}
        <section className="flex-grow flex flex-col bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden min-h-[560px]">
          {/* Header */}
          <header className="border-b border-outline-variant/30 p-md lg:p-lg flex justify-between items-center bg-surface-container-lowest">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-[18px]">
                N
              </div>
              <div>
                <h2 className="text-primary font-semibold text-[16px]">NexaCart Assistant</h2>
                <p className="text-on-surface-variant text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                  AI support agent — online
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="text-on-surface-variant hover:text-primary transition-colors border border-outline-variant rounded-full px-4 py-1.5 text-xs font-medium"
            >
              Clear chat
            </button>
          </header>

          {/* Conversation Messages */}
          <div className="flex-grow overflow-y-auto p-md lg:p-lg flex flex-col gap-lg bg-surface-container-lowest max-h-[460px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-md ${
                  msg.sender === "user" ? "justify-end" : "justify-start max-w-[85%]"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-on-secondary text-xs font-bold mt-1">
                    N
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      msg.sender === "user"
                        ? "text-right text-on-surface-variant/70 pr-1"
                        : "text-on-surface-variant/70 pl-1"
                    }`}
                  >
                    {msg.sender === "user" ? "YOU" : "NEXACART ASSISTANT • AI"}
                  </span>
                  <div
                    className={`p-lg whitespace-pre-line leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-secondary text-on-secondary rounded-[20px] rounded-tr-md shadow-sm"
                        : "bg-chat-bg text-primary rounded-[20px] rounded-tl-md"
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking / Loading Animation */}
            {loading && (
              <div className="flex gap-md max-w-[85%] justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-on-secondary text-xs font-bold">
                  N
                </div>
                <div className="bg-chat-bg rounded-[20px] rounded-tl-md px-5 py-3.5 flex items-center gap-1.5 thinking-dots">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-md lg:p-lg bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col gap-md">
            {/* Suggested Chips */}
            <div className="flex flex-wrap gap-sm">
              {SUGGESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="text-xs md:text-sm bg-surface-container-low text-on-surface-variant px-3.5 py-1.5 rounded-full hover:bg-surface-container hover:text-primary transition-colors border border-outline-variant/30 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about products, orders, or refunds..."
                disabled={loading}
                className="w-full bg-surface-bright border border-outline-variant/50 rounded-full pl-6 pr-14 py-3.5 text-primary placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all shadow-sm text-sm md:text-base disabled:opacity-60"
                type="text"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-secondary text-on-secondary rounded-full hover:bg-on-secondary-container transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
            <p className="text-xs text-on-surface-variant pl-2 opacity-80">
              Responses are dynamically generated using live RAG across our product catalog, order records, and store policy.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
