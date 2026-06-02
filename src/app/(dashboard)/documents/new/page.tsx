"use client";

import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Tag,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "upload" | "ai";
type UploadState = "idle" | "uploading" | "done";

const KATEGORILER = [
  "Sektöre Özel",
  "İş Tanımı",
  "Yetkinlik Çerçevesi",
  "RACI / Süreç",
  "Eğitim Materyali",
  "Politika & Prosedür",
  "Diğer",
];

const ACCEPTED = ".pdf,.docx,.txt,.pptx";
const MAX_MB = 20;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function YeniDokumanPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("upload");
  const [saving, setSaving] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Metadata
  const [title, setTitle] = useState("");
  const [kategori, setKategori] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [topic, setTopic] = useState("");
  const [sector, setSector] = useState("");

  // AI mode
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [aiError, setAiError] = useState("");

  // ── Upload handlers ────────────────────────────────────────────────────────

  function handleFile(f: File) {
    if (f.size > MAX_MB * 1024 * 1024) {
      alert(`Maksimum dosya boyutu ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    simulateUpload();
  }

  function simulateUpload() {
    setUploadState("uploading");
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setUploadState("done");
      } else {
        setProgress(p);
      }
    }, 120);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function resetUpload() {
    setFile(null);
    setUploadState("idle");
    setProgress(0);
    setTitle("");
    setKategori("");
    setAciklama("");
  }

  // ── AI handler ─────────────────────────────────────────────────────────────

  async function handleAiGenerate() {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiError("");
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, kategori: kategori || "Genel" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu.");
      setTitle(data.title ?? "AI Taslak Doküman");
      setAiContent(data.content ?? "");
      setAiDone(true);
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "Doküman oluşturulamadı.");
    } finally {
      setAiGenerating(false);
    }
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const newDoc = {
      id: "DOC-" + String(Date.now()).slice(-4).padStart(3, "0"),
      title: title.trim(),
      topic: topic.trim() || kategori || "Genel",
      sector: sector.trim() || "Genel",
      category: kategori || "Diğer",
      source: mode,
      status: "aktif",
      format: mode === "upload" && file ? file.name.split(".").pop()?.toUpperCase() ?? "DOC" : "DOCX",
      size: mode === "upload" && file ? formatBytes(file.size) : "—",
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("sb_docs") || "[]");
      localStorage.setItem("sb_docs", JSON.stringify([newDoc, ...existing]));
    } catch {}

    setSaving(false);
    router.push("/documents");
  }

  function switchMode(m: Mode) {
    setMode(m);
    resetUpload();
    setAiDone(false);
    setAiPrompt("");
    setAiContent("");
    setAiError("");
  }

  const uploadReady = uploadState === "done";
  const canSave =
    (mode === "upload" && uploadReady && title.trim()) ||
    (mode === "ai" && aiDone && title.trim());

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Doküman Oluştur</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Mevcut dosyanızı yükleyin ya da AI ile sıfırdan belge üretin.
        </p>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
        {(["upload", "ai"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              mode === m
                ? "bg-indigo-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {m === "upload" ? (
              <Upload className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {m === "upload" ? "Dosya Yükle" : "AI ile Oluştur"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Upload mode ── */}
        {mode === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {!file ? (
              /* Drop zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 text-center cursor-pointer transition-colors",
                  dragOver
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                )}
              >
                <div className="w-14 h-14 rounded-2xl border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Dosyayı sürükleyin veya{" "}
                    <span className="text-indigo-400 underline underline-offset-2">
                      seçin
                    </span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    PDF, DOCX, TXT, PPTX — maks. {MAX_MB} MB
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            ) : (
              /* File card + progress */
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  {uploadState !== "uploading" && (
                    <button
                      onClick={resetUpload}
                      className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {uploadState === "uploading" && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Yükleniyor…</span>
                      <span>{Math.min(100, Math.round(progress))}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-150"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === "done" && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Yükleme tamamlandı
                  </div>
                )}
              </div>
            )}

            {/* Metadata — shown after upload */}
            {uploadReady && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-500" />
                  <h2 className="text-white font-semibold text-sm">
                    Meta Veri Etiketleme
                  </h2>
                  <span className="text-zinc-600 text-xs">(opsiyonel)</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">
                    Doküman Başlığı
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Başlık girin"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Kategori seçin</option>
                    {KATEGORILER.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">Konu</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ör: Performans Yönetimi, İşe Alım"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">Sektör</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="ör: Finans & Muhasebe, Bilgi Teknolojileri"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">
                    Açıklama
                  </label>
                  <textarea
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                    placeholder="Kısa bir açıklama ekleyin…"
                    rows={3}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── AI mode ── */}
        {mode === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Kontör notice */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300">
                Bu işlem{" "}
                <span className="font-semibold">50 kontör</span> harcar.
                Taslak onaylanmadan kontör iadesi yapılmaz.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold">
                  AI ile Doküman Oluştur
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Konuyu ve amacı yazın, Claude sizin için taslak oluştursun.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs font-medium">
                  Konu ve Amaç
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={aiGenerating || aiDone}
                  placeholder="ör: Satış mühendisleri için müşteri yönetimi el kitabı. Teknoloji sektörü, orta ölçekli B2B şirketi."
                  rows={4}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none disabled:opacity-50"
                />
              </div>

              {aiError && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {aiError}
                </div>
              )}

              {!aiDone ? (
                <button
                  onClick={handleAiGenerate}
                  disabled={!aiPrompt.trim() || aiGenerating}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Claude doküman hazırlıyor… (~20 sn)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Taslak Oluştur — 50 Kontör
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Taslak oluşturuldu — düzenleyebilir veya onaylayabilirsiniz.
                  </div>
                  <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                    {aiContent || "İçerik yükleniyor…"}
                  </div>
                  <button
                    onClick={() => {
                      setAiDone(false);
                      setAiPrompt("");
                      setTitle("");
                      setAiContent("");
                      setAiError("");
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-left"
                  >
                    Yeniden oluştur
                  </button>
                </div>
              )}
            </div>

            {/* Metadata — shown after AI generates */}
            {aiDone && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-500" />
                  <h2 className="text-white font-semibold text-sm">
                    Doküman Bilgileri
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Doküman başlığı"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Kategori seçin</option>
                    {KATEGORILER.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">Konu</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ör: Performans Yönetimi, İşe Alım"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-medium">Sektör</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="ör: Finans & Muhasebe, Bilgi Teknolojileri"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <p className="text-zinc-600 text-xs">
          {!canSave
            ? "Kaydetmek için yükleme tamamlanmalı ve başlık girilmelidir."
            : "Kütüphaneye kaydedilmeye hazır."}
        </p>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor…</>
          ) : (
            <>Kütüphaneye Kaydet <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
