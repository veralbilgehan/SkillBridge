"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import AgriCalendarStrip from "@/components/ui/AgriCalendarStrip";
import { Send, Plus, RotateCcw, ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function UserBubble({ msg }: { msg: Message }) {
  return (
    <div className="flex justify-end mb-3">
      <div className="max-w-[85%] sm:max-w-[70%] lg:max-w-[55%]">
        <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {msg.content}
          </p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right pr-1">
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}

function AssistantBubble({ msg }: { msg: Message }) {
  const [thinkOpen, setThinkOpen] = useState(false);
  const lines = msg.content.split("\n");

  return (
    <div className="flex justify-start mb-3 gap-2 sm:gap-3">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ShoppingCart size={12} className="text-white" />
      </div>

      <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[60%]">
        <button
          onClick={() => setThinkOpen(!thinkOpen)}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 mb-1.5 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>cookcodeks yanıtladı</span>
          {thinkOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>

        {thinkOpen && (
          <div className="mb-2 pl-3 border-l-2 border-gray-200">
            <p className="text-[11px] text-gray-400 italic">
              BIGsafer yiyecek içecek uzmanı — kullanıcının sorusuna yanıt veriyor.
            </p>
          </div>
        )}

        <div className="space-y-1">
          {lines.map((line, i) => {
            if (!line.trim()) return <div key={i} className="h-1" />;
            return (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-gray-400 mt-0.5 flex-shrink-0 text-sm">•</span>
                <p className="text-sm text-gray-800 leading-relaxed break-words">{line}</p>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-gray-400 mt-1.5 pl-1">{formatTime(msg.timestamp)}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 gap-2 sm:gap-3">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ShoppingCart size={12} className="text-white" />
      </div>
      <div className="flex items-center gap-1 pt-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-300"
            style={{ animation: "typingBounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Merhaba! 👋 Ben BIGsafer'in yiyecek içecek uzmanıyım, adım cookcodeks.\nSize nasıl yardımcı olabilirim?",
  timestamp: new Date(),
};

const QUICK = ["Tarif öner", "Kalori hesapla", "Restoran önerisi", "Gıda güvenliği"];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    const history = newMessages.filter((m) => m.id !== "welcome").map((m) => ({ role: m.role, content: m.content }));
    const apiMessages = history.length === 0 || history[0].role !== "user"
      ? [{ role: "user", content: text }] : history;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Sunucu hatası");
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(), role: "assistant", content: data.text, timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: `⚠️ Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}. Lütfen tekrar deneyin.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Takvim şeridi */}
      <AgriCalendarStrip />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-cookcodeks.png"
            alt="cookcodeks"
            className="h-10 w-auto object-contain"
          />
          <p className="text-[11px] text-gray-500">
            BIGsafer · {isLoading ? "Yanıt yazılıyor..." : "Çevrimiçi"}
          </p>
        </div>
        <button
          onClick={() => setMessages([WELCOME])}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw size={11} />
          <span className="hidden sm:inline">Sıfırla</span>
        </button>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-6 md:px-16 lg:px-32 xl:px-48">
        {messages.map((msg) =>
          msg.role === "user"
            ? <UserBubble key={msg.id} msg={msg} />
            : <AssistantBubble key={msg.id} msg={msg} />
        )}

        {isLoading && <TypingIndicator />}

        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 mt-2 pl-8 sm:pl-10">
            {QUICK.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs text-gray-600 border border-gray-300 hover:border-orange-400 hover:text-orange-600 bg-white px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-6 md:px-16 lg:px-32 xl:px-48 py-3 flex-shrink-0">
        <div className="border border-gray-300 hover:border-gray-400 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 rounded-xl bg-white transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); adjustTextarea(); }}
            onKeyDown={handleKeyDown}
            placeholder="Bir şeyler sorun..."
            rows={1}
            disabled={isLoading}
            className="w-full px-3 sm:px-4 pt-3 pb-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed disabled:opacity-60"
            style={{ maxHeight: "140px", scrollbarWidth: "thin" }}
          />
          <div className="flex items-center justify-between px-2.5 sm:px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Plus size={15} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-[11px] font-mono font-bold">
                /
              </button>
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
            >
              <Send size={12} className={input.trim() ? "text-white" : "text-gray-400"} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-1.5 hidden sm:block">
          Enter ile gönder · Shift+Enter ile yeni satır
        </p>
      </div>
    </div>
  );
}
