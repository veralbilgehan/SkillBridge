"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Plus,
  Send,
  Copy,
  Check,
  Link as LinkIcon,
  Users,
  ClipboardList,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Tests ───────────────────────────────────────────────────────────────

const MOCK_TESTS = [
  { id: "1", title: "Yazılım Geliştirici — Teknik Yetkinlik Testi", adaySayisi: 12 },
  { id: "2", title: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", adaySayisi: 8 },
  { id: "3", title: "İnsan Kaynakları — İşe Alım Yetkinlik Testi", adaySayisi: 34 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailEntry {
  id: string;
  value: string;
  valid: boolean;
}

type InviteMethod = "email" | "link";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvitePage() {
  const [method, setMethod] = useState<InviteMethod>("email");
  const [selectedTest, setSelectedTest] = useState(MOCK_TESTS[0]);
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const [emails, setEmails] = useState<EmailEntry[]>([
    { id: "e1", value: "", valid: true },
  ]);
  const [bulkText, setBulkText] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [message, setMessage] = useState(
    "Merhaba,\n\nSizi SkillBridge platformundaki yetkinlik değerlendirmemize davet ediyoruz. Aşağıdaki bağlantıdan teste ulaşabilirsiniz.\n\nBaşarılar dileriz."
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const inviteLink = `https://skillbridge.app/test/${selectedTest.id}/join`;

  const addEmail = () =>
    setEmails((prev) => [...prev, { id: Date.now().toString(), value: "", valid: true }]);

  const removeEmail = (id: string) =>
    setEmails((prev) => prev.filter((e) => e.id !== id));

  const updateEmail = (id: string, value: string) =>
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, value, valid: value === "" || isValidEmail(value) } : e))
    );

  const parseBulk = () => {
    const parsed = bulkText
      .split(/[\n,;]+/)
      .map((v) => v.trim())
      .filter(Boolean)
      .map((value, i) => ({ id: `b${i}${Date.now()}`, value, valid: isValidEmail(value) }));
    if (parsed.length > 0) {
      setEmails(parsed);
      setBulkMode(false);
      setBulkText("");
    }
  };

  const validEmails = emails.filter((e) => e.value && e.valid);

  const handleSend = async () => {
    if (validEmails.length === 0) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Davetler Gönderildi!</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {validEmails.length} adaya &ldquo;{selectedTest.title}&rdquo; testi için davet e-postası iletildi.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSent(false); setEmails([{ id: "e1", value: "", valid: true }]); }}
            className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm transition-colors"
          >
            Yeni Davet Gönder
          </button>
          <Link
            href="/candidates"
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors"
          >
            Adayları Gör
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/candidates"
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Aday Davet Et</h1>
          <p className="text-zinc-400 text-sm mt-0.5">E-posta veya bağlantı ile aday davet edin</p>
        </div>
      </div>

      {/* Test Seçimi */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ClipboardList className="w-4 h-4 text-indigo-400" />
          Test Seç
        </div>
        <div className="relative">
          <button
            onClick={() => setTestDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-zinc-950/50 border border-zinc-700 rounded-xl text-sm text-white hover:border-zinc-600 transition-colors"
          >
            <span className="truncate">{selectedTest.title}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-zinc-500 shrink-0 transition-transform",
                testDropdownOpen && "rotate-180"
              )}
            />
          </button>
          {testDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden z-10 shadow-xl">
              {MOCK_TESTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTest(t); setTestDropdownOpen(false); }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-800 transition-colors text-left",
                    t.id === selectedTest.id ? "text-indigo-400" : "text-zinc-300"
                  )}
                >
                  <span className="truncate">{t.title}</span>
                  <span className="text-xs text-zinc-500 shrink-0 ml-3">{t.adaySayisi} aday</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Yöntem Seçimi */}
      <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl relative">
        <div
          className="absolute inset-y-1 bg-zinc-800 rounded-lg transition-all duration-300"
          style={{
            width: "calc(50% - 4px)",
            transform: method === "email" ? "translateX(0)" : "translateX(100%)",
          }}
        />
        {(["email", "link"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={cn(
              "flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors",
              method === m ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {m === "email" ? <Mail className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {m === "email" ? "E-posta ile Davet" : "Bağlantı Paylaş"}
          </button>
        ))}
      </div>

      {/* E-posta Yöntemi */}
      {method === "email" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users className="w-4 h-4 text-indigo-400" />
              E-posta Adresleri
            </div>
            <button
              onClick={() => setBulkMode((b) => !b)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {bulkMode ? "Tekli Giriş" : "Toplu Yapıştır"}
            </button>
          </div>

          {bulkMode ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={5}
                placeholder={"aday1@sirket.com\naday2@sirket.com, aday3@sirket.com"}
                className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              />
              <button
                onClick={parseBulk}
                disabled={!bulkText.trim()}
                className="self-end px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 disabled:opacity-40 transition-colors"
              >
                Ayrıştır ve Ekle
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {emails.map((entry) => (
                <div key={entry.id} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input
                      type="email"
                      value={entry.value}
                      onChange={(e) => updateEmail(entry.id, e.target.value)}
                      placeholder="aday@sirket.com"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                        entry.valid
                          ? "border-zinc-700 focus:border-indigo-500"
                          : "border-red-500/50 focus:border-red-500"
                      )}
                    />
                  </div>
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmail(entry.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEmail}
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                E-posta Ekle
              </button>
            </div>
          )}

          {/* Kişisel mesaj */}
          <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
            <label className="text-xs font-medium text-zinc-400">Kişisel Mesaj (isteğe bağlı)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Özet + Gönder */}
          <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500">
              {validEmails.length} geçerli e-posta ·{" "}
              <span className="text-indigo-400 font-semibold">2 kontör</span>/davet
            </p>
            <button
              onClick={handleSend}
              disabled={validEmails.length === 0 || sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Gönderiliyor..." : "Davet Gönder"}
            </button>
          </div>
        </div>
      )}

      {/* Link Yöntemi */}
      {method === "link" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <LinkIcon className="w-4 h-4 text-indigo-400" />
            Davet Bağlantısı
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-500">
              Bu bağlantıyı paylaşın. Erişen herkes testi başlatabilir.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-zinc-950/50 border border-zinc-700 rounded-xl text-sm text-zinc-300 truncate font-mono">
                {inviteLink}
              </div>
              <button
                onClick={copyLink}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all shrink-0",
                  linkCopied
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                )}
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400">
            Bağlantı paylaşımı sınırsız erişime açıktır. Belirli kişileri hedeflemek için e-posta davetini kullanın.
          </div>
        </div>
      )}
    </div>
  );
}
