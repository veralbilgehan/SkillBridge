"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileTextIcon,
  MagicWandIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  UploadIcon,
  ChatBubbleIcon,
  RocketIcon,
  TrashIcon,
  Pencil1Icon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { AlertCircle, Loader2, Sparkles, Search } from "lucide-react";

import { SEKTOR_LISTESI, SEKTOR_MESLEK, MESLEK_TANIM, YETKINLIKLER, BIRIMLER_LISTESI, UNVAN_LISTESI } from "@/data/sektor-meslek";

// ─── Library docs — merged from localStorage + defaults ───────────────────────

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string;
  source: "upload" | "ai";
  topic?: string;
  sector?: string;
  date?: string;
}

const DEFAULT_DOCS: LibraryDoc[] = [
  { id: "DOC-001", title: "Tedarik Zinciri Müdürü — RACI & Yetkinlik Formu", category: "RACI / Süreç", format: "HTML", size: "248 KB", source: "upload", topic: "RACI Matrisi, Yetkinlik Değerlendirme", sector: "Lojistik & Tedarik", date: "12 Şub 2026" },
  { id: "DOC-002", title: "Satış Mühendisleri İçin Müşteri Yönetimi El Kitabı", category: "İş Tanımı", format: "DOCX", size: "184 KB", source: "ai", topic: "Müşteri İlişkileri, Satış Süreçleri", sector: "Satış & Pazarlama", date: "28 Oca 2026" },
  { id: "DOC-003", title: "Finans Departmanı Yetkinlik Çerçevesi", category: "Yetkinlik Çerçevesi", format: "PDF", size: "1.2 MB", source: "upload", topic: "Finansal Analiz, Bütçe Yönetimi", sector: "Finans & Muhasebe", date: "15 Oca 2026" },
  { id: "DOC-004", title: "Yazılım Geliştirici İş Tanımı Şablonu", category: "İş Tanımı", format: "DOCX", size: "96 KB", source: "ai", topic: "Yazılım Mühendisliği, Agile, DevOps", sector: "Bilgi Teknolojileri", date: "3 Mar 2026" },
  { id: "DOC-005", title: "İK Politika ve Prosedürler Rehberi", category: "Politika & Prosedür", format: "PDF", size: "2.4 MB", source: "upload", topic: "İşe Alım, Performans Yönetimi", sector: "İnsan Kaynakları", date: "20 Ara 2025" },
];

function loadLibraryDocs(): LibraryDoc[] {
  try {
    const saved = JSON.parse(localStorage.getItem("sb_docs") || "[]") as LibraryDoc[];
    const savedIds = new Set(saved.map((d) => d.id));
    return [...saved, ...DEFAULT_DOCS.filter((d) => !savedIds.has(d.id))];
  } catch {
    return DEFAULT_DOCS;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────


const SORU_TIPLERI = [
  { id: "multiple_choice", label: "Çoktan Seçmeli", desc: "4 seçenek, 1 doğru" },
  { id: "multi_correct",   label: "Çoklu Doğru",    desc: "Birden fazla doğru seçenek" },
  { id: "open_ended",      label: "Açık Uçlu",       desc: "Serbest yazılı yanıt" },
  { id: "yes_no",          label: "Evet / Hayır",     desc: "İkili karar sorusu" },
  { id: "ordering",        label: "Sıralama",         desc: "Öğeleri öncelik sırasına diz" },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const STEPS = [
  "Doküman Seçimi",
  "Parametre",
  "Yetkinlik",
  "AI Sohbet",
  "Taslak İnceleme",
  "Yayınlama",
] as const;

type ChatMessage = { role: "user" | "ai"; text: string };

type QuestionOption = { id: string; text: string; isCorrect: boolean };

type GeneratedQuestion = {
  type: string;
  content: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  competency: string;
  difficulty: string;
};


const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

const TYPE_LABEL: Record<string, string> = {
  multiple_choice: "Çoktan Seçmeli",
  multi_correct: "Çoklu Doğru",
  open_ended: "Açık Uçlu",
  yes_no: "Evet / Hayır",
  ordering: "Sıralama",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function YeniTestPage() {
  const [step, setStep] = useState<Step>(0);

  // §5.1 – Doküman
  const [docSelected, setDocSelected] = useState(false);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<LibraryDoc | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryDocs, setLibraryDocs] = useState<LibraryDoc[]>(DEFAULT_DOCS);
  const [libSearch, setLibSearch] = useState("");

  useEffect(() => {
    setLibraryDocs(loadLibraryDocs());
  }, []);

  // §5.2 – Parametreler
  const [sektor, setSektor] = useState("");
  const [meslek, setMeslek] = useState("");
  const [birim, setBirim] = useState("");
  const [unvan, setUnvan] = useState("");

  // §5.3 – Yetkinlikler
  const [seciliYetkinlikler, setSeciliYetkinlikler] = useState<Set<string>>(new Set());
  const [seciliTipler, setSeciliTipler] = useState<Set<string>>(new Set(["multiple_choice"]));

  // §5.4 – AI Chat
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Initial message is derived from selectedDoc — set when entering step 3
  const [chatInitialized, setChatInitialized] = useState(false);
  const [chatGenerating, setChatGenerating] = useState(false);
  const [soruSayisi, setSoruSayisi] = useState(10);
  const [zorluk, setZorluk] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  // §5.5 – Üretilen sorular
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState("");

  const [kontor] = useState(340);
  const meslekler = sektor ? SEKTOR_MESLEK[sektor] ?? [] : [];

  function toggleYetkinlik(item: string) {
    setSeciliYetkinlikler((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  function toggleTip(id: string) {
    setSeciliTipler((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Initialize chat with document context when entering step 3
  useEffect(() => {
    if (step === 3 && !chatInitialized) {
      setChatInitialized(true);
      const docInfo = selectedDoc
        ? `"${selectedDoc.title}"${selectedDoc.topic ? ` (Konu: ${selectedDoc.topic})` : ""}${selectedDoc.sector ? ` — Sektör: ${selectedDoc.sector}` : ""}`
        : selectedDocName
        ? `"${selectedDocName}"`
        : "seçilen doküman";
      setMessages([{
        role: "ai",
        text: `Merhaba! ${docInfo} dokümanını aldım. Bu doküman içeriğine dayalı sorular üreteceğim.\n\nKaç soru üretmemi istersiniz? Zorluk seviyesi ne olsun? (Başlangıç / Orta / İleri)`,
      }]);
    }
  }, [step, chatInitialized, selectedDoc, selectedDocName]);

  function parseChatForParams(text: string) {
    const lower = text.toLowerCase();
    const numMatch = lower.match(/\b(\d+)\b/);
    if (numMatch) {
      const n = parseInt(numMatch[1]);
      if (n >= 1 && n <= 50) setSoruSayisi(n);
    }
    if (lower.includes("kolay") || lower.includes("başlangıç") || lower.includes("basit")) {
      setZorluk("beginner");
    } else if (lower.includes("zor") || lower.includes("ileri") || lower.includes("advanced")) {
      setZorluk("advanced");
    } else if (lower.includes("orta")) {
      setZorluk("intermediate");
    }
  }

  async function sendMessage() {
    if (!chatInput.trim() || chatGenerating) return;
    const userText = chatInput.trim();
    const userMsg: ChatMessage = { role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    parseChatForParams(userText);

    setChatGenerating(true);
    await new Promise((r) => setTimeout(r, 500));

    const diffLabel = zorluk === "beginner" ? "başlangıç" : zorluk === "advanced" ? "ileri" : "orta";
    const docRef = selectedDoc ? `"${selectedDoc.title}" dokümanından ` : "";
    const aiReply = `Anlaşıldı! ${docRef}${soruSayisi} adet ${diffLabel} seviye soru hazırlayacağım. Soru tipleri: ${Array.from(seciliTipler).map((t) => TYPE_LABEL[t] ?? t).join(", ")}. Hazır olduğunuzda "Test Üret" butonuna tıklayın (50 kontör düşülecek).`;
    setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    setChatGenerating(false);
  }

  async function generateTest() {
    setGenerating(true);
    setApiError("");
    try {
      const res = await fetch("/api/ai/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competencies: Array.from(seciliYetkinlikler),
          questionCount: soruSayisi,
          difficulty: zorluk,
          questionTypes: Array.from(seciliTipler),
          sector: sektor || selectedDoc?.sector || undefined,
          occupation: meslek || selectedDoc?.title || undefined,
          documentContent: selectedDoc
            ? `Doküman Başlığı: ${selectedDoc.title}\nKategori: ${selectedDoc.category}${selectedDoc.topic ? `\nKonu: ${selectedDoc.topic}` : ""}${selectedDoc.sector ? `\nSektör: ${selectedDoc.sector}` : ""}\n\nBu doküman içeriğine uygun, gerçekçi ve uygulamalı sorular üret.`
            : undefined,
          language: "tr",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu.");
      setGeneratedQuestions(data.questions ?? []);
      setStep(4);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Test üretilemedi. Lütfen tekrar deneyin.");
    } finally {
      setGenerating(false);
    }
  }

  function removeQuestion(index: number) {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  const canGoNext: Record<Step, boolean> = {
    0: docSelected,
    1: true,
    2: seciliYetkinlikler.size > 0 && seciliTipler.size > 0,
    3: true,
    4: generatedQuestions.length > 0,
    5: false,
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Test Oluştur</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Parametreleri belirleyin, AI test sorularını otomatik üretsin.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900">
          <span className="text-xs text-zinc-500">Kontör</span>
          <span className="text-sm font-semibold text-white">{kontor}</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 flex-wrap">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-indigo-500 text-white"
                    : done
                    ? "bg-zinc-800 text-emerald-400"
                    : "bg-zinc-900 text-zinc-600"
                }`}
              >
                {done ? <CheckIcon className="h-3 w-3" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRightIcon className="h-4 w-4 text-zinc-700 mx-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Split-screen body */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── Left: Document Preview ── */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Doküman Önizleme
            </p>
            <button
              onClick={() => { setDocSelected(false); setSelectedDoc(null); setSelectedDocName(""); setStep(0); }}
              className="text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
            >
              Değiştir
            </button>
          </div>

          {docSelected ? (
            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                  <FileTextIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{selectedDocName || "Yüklenen Doküman"}</p>
                  <p className="text-[10px] text-zinc-600">Test oluşturmaya hazır</p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center" style={{ minHeight: 400 }}>
                <div className="text-center space-y-2">
                  <FileTextIcon className="h-10 w-10 text-zinc-700 mx-auto" />
                  <p className="text-xs text-zinc-600">Doküman önizlemesi</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-4 px-6 text-center"
              style={{ minHeight: 300 }}
            >
              <div className="w-12 h-12 rounded-2xl border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                <UploadIcon className="h-5 w-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Doküman Seçin</p>
                <p className="text-xs text-zinc-600 mt-1">PDF, DOCX, TXT — maks. 20 MB</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer text-center">
                  Dosya Yükle
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.html"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedDocName(file.name);
                        setSelectedDoc({
                          id: "upload",
                          title: file.name.replace(/\.[^/.]+$/, ""),
                          category: "Yüklenen Doküman",
                          format: file.name.split(".").pop()?.toUpperCase() ?? "DOC",
                          size: file.size < 1024 * 1024
                            ? (file.size / 1024).toFixed(0) + " KB"
                            : (file.size / (1024 * 1024)).toFixed(1) + " MB",
                          source: "upload",
                        });
                        setDocSelected(true);
                      }
                    }}
                  />
                </label>
                <button
                  onClick={() => setShowLibrary(true)}
                  className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors border border-zinc-700"
                >
                  Kütüphaneden Seç
                </button>
              </div>
            </div>
          )}

          {/* Library modal */}
          {showLibrary && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLibrary(false)} />
              <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-white">Kütüphaneden Seç</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{libraryDocs.length} doküman</p>
                  </div>
                  <button onClick={() => setShowLibrary(false)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                    <Cross2Icon className="h-4 w-4" />
                  </button>
                </div>
                {/* Search */}
                <div className="px-3 pt-3 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      value={libSearch}
                      onChange={(e) => setLibSearch(e.target.value)}
                      placeholder="Doküman, konu veya sektör ara…"
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                {/* List */}
                <div className="overflow-y-auto flex-1 px-3 pb-3 flex flex-col gap-1.5">
                  {libraryDocs
                    .filter((d) =>
                      !libSearch ||
                      d.title.toLowerCase().includes(libSearch.toLowerCase()) ||
                      (d.topic ?? "").toLowerCase().includes(libSearch.toLowerCase()) ||
                      (d.sector ?? "").toLowerCase().includes(libSearch.toLowerCase()) ||
                      d.category.toLowerCase().includes(libSearch.toLowerCase())
                    )
                    .map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocName(doc.title);
                          setSelectedDoc(doc);
                          setDocSelected(true);
                          setShowLibrary(false);
                          setLibSearch("");
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
                          {doc.source === "ai"
                            ? <Sparkles className="w-4 h-4 text-indigo-400" />
                            : <FileTextIcon className="h-4 w-4 text-zinc-400 group-hover:text-indigo-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{doc.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-zinc-500">{doc.format} · {doc.size}</span>
                            {doc.sector && <span className="text-[10px] text-zinc-600">{doc.sector}</span>}
                            {doc.date && <span className="text-[10px] text-zinc-700">{doc.date}</span>}
                          </div>
                        </div>
                        <CheckIcon className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </button>
                    ))
                  }
                  {libraryDocs.filter((d) =>
                    !libSearch ||
                    d.title.toLowerCase().includes(libSearch.toLowerCase()) ||
                    (d.topic ?? "").toLowerCase().includes(libSearch.toLowerCase()) ||
                    (d.sector ?? "").toLowerCase().includes(libSearch.toLowerCase()) ||
                    d.category.toLowerCase().includes(libSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <FileTextIcon className="h-8 w-8 text-zinc-700" />
                      <p className="text-xs text-zinc-500">Eşleşen doküman bulunamadı.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Wizard panels ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <AnimatePresence mode="wait">

            {/* Step 0: Doküman Seçimi */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-white font-semibold">Doküman Seçimi</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Test oluşturulacak kaynak dokümanı sol panelden seçin veya yükleyin.
                    </p>
                  </div>
                  {docSelected ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <CheckIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm text-white font-medium">Doküman seçildi</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Doküman başarıyla seçildi. Devam edebilirsiniz.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <FileTextIcon className="h-4 w-4 text-amber-400 shrink-0" />
                      <p className="text-sm text-zinc-400">Sol panelden bir doküman seçin veya yükleyin.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 1: Parametreler */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-white font-semibold">Kurumsal Parametreler</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Testin hangi role ve bağlama göre oluşturulacağını belirler.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-sm font-medium">Sektör</label>
                      <select
                        value={sektor}
                        onChange={(e) => { setSektor(e.target.value); setMeslek(""); }}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Sektör seçin</option>
                        {SEKTOR_LISTESI.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-sm font-medium">
                        Meslek
                        {sektor && <span className="text-indigo-400 ml-1 text-xs">({sektor})</span>}
                      </label>
                      <select
                        value={meslek}
                        onChange={(e) => setMeslek(e.target.value)}
                        disabled={!sektor}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <option value="">{sektor ? "Meslek seçin" : "Önce sektör seçin"}</option>
                        {meslekler.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-sm font-medium">Şirket Birimi</label>
                      <select
                        value={birim}
                        onChange={(e) => setBirim(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Birim seçin</option>
                        {BIRIMLER_LISTESI.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-sm font-medium">Ünvan</label>
                      <select
                        value={unvan}
                        onChange={(e) => setUnvan(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Ünvan seçin</option>
                        {UNVAN_LISTESI.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    {meslek && MESLEK_TANIM[meslek] && (
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm font-medium flex items-center gap-1.5">
                          Meslek Tanımı
                          <span className="text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded-full">otomatik</span>
                        </label>
                        <p className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3 text-zinc-300 text-sm leading-relaxed">
                          {MESLEK_TANIM[meslek]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Yetkinlik */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col gap-4 overflow-y-auto"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-white font-semibold">Yetkinlik Seçimi</h2>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Testin ölçeceği yetkinlikleri seçin.{" "}
                        <span className="text-amber-400">En az 1 zorunludur.</span>
                      </p>
                    </div>
                    {seciliYetkinlikler.size > 0 && (
                      <span className="shrink-0 text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                        {seciliYetkinlikler.size} seçili
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {YETKINLIKLER.map((kat) => (
                      <div key={kat.kategori}>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          {kat.kategori}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {kat.items.map((item) => {
                            const sel = seciliYetkinlikler.has(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleYetkinlik(item)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                  sel
                                    ? "bg-indigo-500 border-indigo-400 text-white"
                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-white font-semibold">Soru Tipleri</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">AI&apos;ın kullanacağı soru formatlarını seçin.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SORU_TIPLERI.map(({ id, label, desc }) => {
                      const sel = seciliTipler.has(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleTip(id)}
                          className={`flex flex-col gap-0.5 p-3 rounded-xl border text-left transition-colors ${
                            sel
                              ? "border-indigo-500/50 bg-indigo-500/8 text-white"
                              : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-xs font-medium">{label}</span>
                          <span className="text-[10px] text-zinc-600">{desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: AI Sohbet */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                      <MagicWandIcon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI Test Asistanı</p>
                      <p className="text-xs text-zinc-500">Her üretimde 50 kontör düşülür</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {/* Quick params */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Soru:</span>
                        <input
                          type="number"
                          value={soruSayisi}
                          onChange={(e) => setSoruSayisi(Math.max(1, Math.min(50, +e.target.value)))}
                          min={1} max={50}
                          className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Zorluk:</span>
                        <select
                          value={zorluk}
                          onChange={(e) => setZorluk(e.target.value as typeof zorluk)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="beginner">Başlangıç</option>
                          <option value="intermediate">Orta</option>
                          <option value="advanced">İleri</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Aktif
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: 220 }}>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-indigo-500 text-white rounded-br-sm"
                              : "bg-zinc-800 text-zinc-300 rounded-bl-sm border border-zinc-700"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {chatGenerating && (
                      <div className="flex gap-2 justify-start">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-zinc-800 border border-zinc-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="px-4 py-3 border-t border-zinc-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Mesajınızı yazın… (Enter ile gönderin)"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={chatGenerating || !chatInput.trim()}
                      className="p-2.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
                    >
                      <ChatBubbleIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Error */}
                {apiError && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {apiError}
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={generateTest}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Test soruları üretiliyor… (bu işlem ~15 sn sürebilir)
                    </>
                  ) : (
                    <>
                      <MagicWandIcon className="h-4 w-4" />
                      Test Üret — {soruSayisi} Soru · {DIFFICULTY_LABEL[zorluk]} · 50 Kontör
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 4: Taslak İnceleme */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col gap-4 overflow-y-auto"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-white font-semibold">Taslak İnceleme</h2>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        AI tarafından üretilen soruları inceleyin, düzenleyin veya kaldırın.
                      </p>
                    </div>
                    <span className="shrink-0 text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                      {generatedQuestions.length} soru
                    </span>
                  </div>

                  {generatedQuestions.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-sm">
                      Henüz soru üretilmedi. AI Sohbet adımına geri dönün.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {generatedQuestions.map((q, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50 group">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 font-medium mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                                {TYPE_LABEL[q.type] ?? q.type}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                q.difficulty === "beginner"
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : q.difficulty === "advanced"
                                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                                  : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                              }`}>
                                {DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}
                              </span>
                              {q.competency && (
                                <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                                  {q.competency}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white leading-relaxed">{q.content}</p>
                            {q.options && q.options.length > 0 && (
                              <div className="mt-2 flex flex-col gap-1">
                                {q.options.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className={`text-xs px-3 py-1.5 rounded-lg ${
                                      opt.isCorrect
                                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                        : "text-zinc-500"
                                    }`}
                                  >
                                    <span className="font-medium uppercase mr-1">{opt.id})</span>
                                    {opt.text}
                                    {opt.isCorrect && <span className="ml-1 text-emerald-400">✓</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.explanation && (
                              <p className="mt-2 text-xs text-zinc-500 italic">{q.explanation}</p>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors">
                              <Pencil1Icon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeQuestion(i)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Yayınlama */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <RocketIcon className="h-8 w-8 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Test Yayınlandı!</h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Testiniz aktif. Aday davetiyelerini Testler sayfasından gönderebilirsiniz.
                  </p>
                </div>
                <a
                  href="/tests"
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Testlere Git →
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation — step 3 uses generateTest instead */}
          {step !== 3 && step < 5 && (
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Geri
              </button>
              <button
                onClick={() => {
                  if (step === 4) {
                    // Publish: save to localStorage
                    const newTest = {
                      id: "TST-" + String(Date.now()).slice(-5),
                      title: selectedDoc
                        ? `${selectedDoc.title} — ${DIFFICULTY_LABEL[zorluk]} Test`
                        : `${selectedDocName || "Yeni Test"} — ${DIFFICULTY_LABEL[zorluk]}`,
                      sektor: selectedDoc?.sector || sektor || "Genel",
                      meslek: meslek || selectedDoc?.topic || selectedDoc?.title || "Genel",
                      source: "custom",
                      status: "aktif",
                      soruSayisi: generatedQuestions.length,
                      sure: `${Math.ceil(generatedQuestions.length * 1.5)} dk`,
                      adaySayisi: 0,
                      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
                    };
                    try {
                      const existing = JSON.parse(localStorage.getItem("sb_tests") || "[]");
                      localStorage.setItem("sb_tests", JSON.stringify([newTest, ...existing]));
                    } catch {}
                  }
                  setStep((s) => Math.min(5, s + 1) as Step);
                }}
                disabled={!canGoNext[step]}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {step === 4 ? "Yayınla" : "Devam Et"}
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Back button only for step 3 */}
          {step === 3 && (
            <div className="flex items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Geri
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
