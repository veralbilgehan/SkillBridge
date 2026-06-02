"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock, ChevronRight, ChevronLeft, Flag,
  CheckCircle2, AlertTriangle, BookOpen, ShieldAlert, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock questions ────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    content: "Aşağıdaki JavaScript kod bloğunun çıktısı ne olur?\n\nconsole.log(typeof null);",
    options: [
      { id: "a", text: "\"null\"" },
      { id: "b", text: "\"object\"" },
      { id: "c", text: "\"undefined\"" },
      { id: "d", text: "null" },
    ],
    correct: "b",
  },
  {
    id: 2,
    content: "REST API tasarımında idempotent olmayan HTTP metodu hangisidir?",
    options: [
      { id: "a", text: "GET" },
      { id: "b", text: "PUT" },
      { id: "c", text: "POST" },
      { id: "d", text: "DELETE" },
    ],
    correct: "c",
  },
  {
    id: 3,
    content: "Big-O notasyonunda aşağıdaki ifadelerden hangisi en iyi (en hızlı) karmaşıklığı temsil eder?",
    options: [
      { id: "a", text: "O(n²)" },
      { id: "b", text: "O(n log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(1)" },
    ],
    correct: "d",
  },
  {
    id: 4,
    content: "SQL'de bir tablodan yinelenen satırları kaldırmak için hangi anahtar kelime kullanılır?",
    options: [
      { id: "a", text: "UNIQUE" },
      { id: "b", text: "DISTINCT" },
      { id: "c", text: "FILTER" },
      { id: "d", text: "REMOVE" },
    ],
    correct: "b",
  },
  {
    id: 5,
    content: "Git'te yeni bir branch oluşturup aynı anda o branch'e geçmek için doğru komut hangisidir?",
    options: [
      { id: "a", text: "git branch -b yeni-dal" },
      { id: "b", text: "git new yeni-dal" },
      { id: "c", text: "git checkout -b yeni-dal" },
      { id: "d", text: "git switch --create yeni-dal" },
    ],
    correct: "c",
  },
  {
    id: 6,
    content: "SOLID prensiplerinde 'S' harfinin temsil ettiği prensip hangisidir?",
    options: [
      { id: "a", text: "Separation of Concerns" },
      { id: "b", text: "Single Responsibility Principle" },
      { id: "c", text: "Substitution Principle" },
      { id: "d", text: "Synchronous Design" },
    ],
    correct: "b",
  },
  {
    id: 7,
    content: "Aşağıdakilerden hangisi NoSQL veritabanı türü değildir?",
    options: [
      { id: "a", text: "MongoDB" },
      { id: "b", text: "Redis" },
      { id: "c", text: "PostgreSQL" },
      { id: "d", text: "Cassandra" },
    ],
    correct: "c",
  },
  {
    id: 8,
    content: "HTTP status kodu '401' neyi ifade eder?",
    options: [
      { id: "a", text: "Sayfa bulunamadı" },
      { id: "b", text: "Sunucu hatası" },
      { id: "c", text: "Kimlik doğrulama gerekli" },
      { id: "d", text: "Erişim yasak" },
    ],
    correct: "c",
  },
  {
    id: 9,
    content: "Mikro servis mimarisinde servisler arası iletişimde hangisi asenkron bir yöntemdir?",
    options: [
      { id: "a", text: "REST API çağrısı" },
      { id: "b", text: "gRPC" },
      { id: "c", text: "Message Queue (RabbitMQ / Kafka)" },
      { id: "d", text: "GraphQL sorgusu" },
    ],
    correct: "c",
  },
  {
    id: 10,
    content: "Aşağıdaki veri yapılarından hangisi LIFO (Last In First Out) prensibine göre çalışır?",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Stack" },
      { id: "c", text: "Linked List" },
      { id: "d", text: "Heap" },
    ],
    correct: "b",
  },
];

const TOTAL = QUESTIONS.length;
const DURATION = 20 * 60; // 20 dakika

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestTakingPage() {
  // Name gate — must enter name before starting
  const [candidateName, setCandidateName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [showConfirm, setShowConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  function startTest() {
    if (nameInput.trim().length < 2) { setNameError(true); return; }
    setCandidateName(nameInput.trim());
  }

  const q = QUESTIONS[currentQ];
  const answeredCount = Object.keys(answers).length;
  const markedCount = marked.size;
  const unansweredCount = TOTAL - answeredCount;

  useEffect(() => {
    if (completed) return;
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(iv); setCompleted(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [completed]);

  // Tab-switch detection
  useEffect(() => {
    if (completed) return;
    function onVisibility() {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
        setShowSecurityWarning(true);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [completed]);

  // Disable right-click, copy, and common devtools shortcuts
  useEffect(() => {
    if (completed) return;
    const prevent = (e: Event) => e.preventDefault();
    function onKey(e: KeyboardEvent) {
      if (e.key === "F12") { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && ["c", "a", "u", "s"].includes(e.key.toLowerCase())) e.preventDefault();
    }
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("keydown", onKey);
    };
  }, [completed]);

  function selectAnswer(optId: string) {
    setAnswers((prev) => ({ ...prev, [currentQ]: optId }));
  }

  function toggleMark() {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ)) next.delete(currentQ);
      else next.add(currentQ);
      return next;
    });
  }

  function submit() {
    setCompleted(true);
    setShowConfirm(false);
  }

  // Score calculation
  const correctCount = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const score = Math.round((correctCount / TOTAL) * 100);

  // ── Name gate ─────────────────────────────────────────────────────────────
  if (!candidateName) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo / title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Teste Başla</h1>
            <p className="text-sm text-zinc-400">Teste başlamadan önce adınızı girin.</p>
          </div>

          {/* Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); setNameError(false); }}
                onKeyDown={(e) => e.key === "Enter" && startTest()}
                placeholder="Adınızı ve soyadınızı girin"
                autoFocus
                className={cn(
                  "w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors",
                  nameError ? "border-red-500" : "border-zinc-700 focus:border-indigo-500"
                )}
              />
              {nameError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> En az 2 karakter giriniz.
                </p>
              )}
            </div>

            <div className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/50 space-y-1.5 text-xs text-zinc-400">
              <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> Süre: 20 dakika</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> 10 soru</p>
              <p className="flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> Sekme değişikliği kayıt altına alınır</p>
            </div>

            <button
              onClick={startTest}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Teste Başla <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion screen ──────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white">%{score}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Test Tamamlandı!</h1>
            <p className="text-zinc-400 mt-1 text-sm">{candidateName}</p>
            <p className="text-zinc-500 mt-0.5 text-xs">Yazılım Geliştirici — Temel Seviye</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
              <p className="text-emerald-400 font-bold text-xl">{correctCount}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Doğru</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
              <p className="text-red-400 font-bold text-xl">{TOTAL - correctCount - unansweredCount}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Yanlış</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
              <p className="text-zinc-400 font-bold text-xl">{unansweredCount > 0 ? unansweredCount : 0}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Boş</p>
            </div>
          </div>
          <p className="text-sm text-zinc-500">Sonuçlarınız değerlendirilmektedir. Detaylı rapor için platforma giriş yapın.</p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Sonuçlarımı Gör
          </Link>
        </div>
      </div>
    );
  }

  // ── Confirm modal ──────────────────────────────────────────────────────────
  if (showConfirm) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-white">Testi bitirmek istiyor musunuz?</h2>
              <p className="text-sm text-zinc-400 mt-1">Bu işlem geri alınamaz.</p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Yanıtlanan</span>
              <span className="font-semibold text-white">{answeredCount} / {TOTAL}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5"><Flag className="w-3.5 h-3.5 text-amber-400" /> İşaretlenen</span>
              <span className="font-semibold text-white">{markedCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Boş bırakılan</span>
                <span className="font-semibold text-red-400">{unansweredCount}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm transition-colors"
            >
              Geri Dön
            </button>
            <button
              onClick={submit}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Testi Bitir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main test UI ───────────────────────────────────────────────────────────
  const timerUrgent = timeLeft < 5 * 60;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between px-5 sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">Skill<span className="text-indigo-400">Bridge</span></span>
          <span className="hidden sm:block h-4 w-px bg-zinc-700" />
          <span className="hidden sm:block text-sm text-zinc-400 truncate max-w-xs">Yazılım Geliştirici — Temel Seviye</span>
          {candidateName && (
            <>
              <span className="hidden sm:block h-4 w-px bg-zinc-700" />
              <span className="hidden sm:block text-sm text-white font-medium truncate max-w-xs">{candidateName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {tabSwitchCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              {tabSwitchCount} ihlal
            </div>
          )}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold",
            timerUrgent
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
              : "bg-zinc-800/50 border-zinc-700/50 text-emerald-400"
          )}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Body: Question + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question area */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {/* Security warning banner */}
          {showSecurityWarning && (
            <div className="max-w-2xl mx-auto mb-4 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Dikkat:</span> Test dışına çıkma tespit edildi ({tabSwitchCount} kez). Bu durum kayıt altına alınmaktadır.
              </div>
              <button onClick={() => setShowSecurityWarning(false)} className="shrink-0 hover:text-red-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* Progress */}
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Soru {currentQ + 1} / {TOTAL}</span>
              <span>{answeredCount} yanıtlandı</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
              Soru {currentQ + 1}
            </p>
            <h2 className="text-base md:text-lg text-white font-medium leading-relaxed mb-7 whitespace-pre-line">
              {q.content}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt) => {
                const selected = answers[currentQ] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectAnswer(opt.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      selected
                        ? "bg-indigo-500/12 border-indigo-500 text-white"
                        : "bg-zinc-800/30 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        selected ? "border-indigo-400" : "border-zinc-600"
                      )}>
                        {selected && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />}
                      </div>
                      <span className="text-sm md:text-base">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="max-w-2xl mx-auto mt-6 flex items-center justify-between gap-3">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((c) => c - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Önceki
            </button>

            <div className="flex gap-2">
              <button
                onClick={toggleMark}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                  marked.has(currentQ)
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Flag className="w-3.5 h-3.5" />
                {marked.has(currentQ) ? "İşaret Kaldır" : "İşaretle"}
              </button>

              {currentQ < TOTAL - 1 ? (
                <button
                  onClick={() => setCurrentQ((c) => c + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Sonraki <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Testi Bitir
                </button>
              )}
            </div>
          </div>

          {/* Complete button (always visible below) */}
          <div className="max-w-2xl mx-auto mt-4 text-center">
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Tüm soruları cevaplamadan bitir →
            </button>
          </div>
        </main>

        {/* Question navigation sidebar */}
        <aside className="hidden lg:flex flex-col w-56 border-l border-zinc-800 bg-zinc-900/40 p-4 gap-4 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Soru Navigasyonu
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {QUESTIONS.map((_, i) => {
                const isAnswered = i in answers;
                const isMarked = marked.has(i);
                const isCurrent = i === currentQ;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={cn(
                      "w-full aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-all",
                      isCurrent
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1 ring-offset-zinc-900"
                        : isMarked
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : isAnswered
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 hover:bg-zinc-800"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs text-zinc-500 pt-2 border-t border-zinc-800">
            {[
              { color: "bg-indigo-600", label: "Şu an" },
              { color: "bg-emerald-500/30 border border-emerald-500/30", label: "Yanıtlandı" },
              { color: "bg-amber-500/20 border border-amber-500/40", label: "İşaretlendi" },
              { color: "bg-zinc-800/50 border border-zinc-700/50", label: "Boş" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded", color)} />
                {label}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="pt-2 border-t border-zinc-800 space-y-1 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Yanıtlanan</span>
              <span className="text-white font-medium">{answeredCount}/{TOTAL}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>İşaretlenen</span>
              <span className="text-amber-400 font-medium">{markedCount}</span>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-auto w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Testi Tamamla
          </button>
        </aside>
      </div>
    </div>
  );
}
