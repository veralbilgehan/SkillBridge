"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BarChart, CheckCircle2, Clock, Mail,
  Sparkles, Loader2, AlertCircle, TrendingUp, BookOpen, Compass,
} from "lucide-react";

// ─── Mock sonuç verisi (ileride API'den gelecek) ──────────────────────────────

const MOCK_RESULT = {
  ad: "Ali Veli",
  testTitle: "Yazılım Geliştirici — Temel Seviye",
  tarih: "14 Mar 2026",
  score: 88,
  sure: "22:45",
  sureLimiti: "30:00",
  dogru: 18,
  yanlis: 2,
  bos: 0,
  competencies: ["Algoritma ve Mantık", "HTML/CSS", "JavaScript ES6+", "Problem Çözme"],
};

type AiReport = {
  levelLabel: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: { area: string; action: string }[];
  careerGuidance: string;
};

// ─── Puan rengi ───────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 90) return "border-emerald-500 text-emerald-400";
  if (s >= 80) return "border-indigo-500 text-indigo-400";
  if (s >= 50) return "border-amber-500 text-amber-400";
  return "border-red-500 text-red-400";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultDetailsPage() {
  const r = MOCK_RESULT;
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AiReport | null>(null);
  const [error, setError] = useState("");

  async function getAiReport() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: r.score,
          testTitle: r.testTitle,
          competencies: r.competencies,
          dogruSayisi: r.dogru,
          yanlisSayisi: r.yanlis,
          bosSayisi: r.bos,
          language: "tr",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analiz hatası");
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "AI yorumu alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  const ringColor = scoreColor(r.score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/results"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{r.ad}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Tamamlandı
              </span>
              <span className="text-xs text-zinc-500">test: {r.testTitle}</span>
              <span className="text-xs text-zinc-500">• {r.tarih}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Mail className="w-4 h-4" /> Adaya Geri Bildirim Gönder
        </button>
      </div>

      {/* Skor + Detaylar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skor halkası */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <BarChart className="w-4 h-4 text-indigo-400" /> Genel Başarı
          </h2>
          <div className="flex flex-col items-center justify-center py-4 gap-3">
            <div className={`w-32 h-32 rounded-full border-8 ${ringColor.split(" ")[0]} flex items-center justify-center`}>
              <span className={`text-4xl font-bold ${ringColor.split(" ")[1]}`}>%{r.score}</span>
            </div>
            <p className="text-emerald-400 font-medium text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Hedef skoru geçti (%70)
            </p>
          </div>

          {/* Yetkinlikler */}
          <div className="mt-4 space-y-2">
            {r.competencies.map((c) => (
              <div key={c} className="text-xs text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Test Detayları */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:col-span-2 space-y-5">
          <h2 className="text-sm font-semibold text-white">Test Detayları</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">Çözüm Süresi</p>
              <div className="flex items-center justify-center gap-1.5 text-white text-sm font-semibold">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> {r.sure}
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">/ {r.sureLimiti}</p>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">Doğru</p>
              <p className="text-emerald-400 font-bold text-lg">{r.dogru}</p>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">Yanlış</p>
              <p className="text-red-400 font-bold text-lg">{r.yanlis}</p>
            </div>
          </div>

          {/* AI Yorum Alanı */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                AI Değerlendirmesi
              </h3>
              {!report && (
                <button
                  onClick={getAiReport}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analiz ediliyor…</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> AI Yorumu Al — 10 Kontör</>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {!report && !loading && !error && (
              <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-4 text-center">
                <p className="text-xs text-zinc-500">
                  "AI Yorumu Al" butonuna tıklayarak Claude'dan kişiselleştirilmiş değerlendirme alın.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4 flex items-center justify-center gap-2 text-indigo-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Claude analiz hazırlıyor…
              </div>
            )}

            {report && (
              <div className="space-y-4">
                {/* Özet */}
                <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-400">
                      Seviye: {report.levelLabel}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{report.summary}</p>
                </div>

                {/* Güçlü / Gelişim */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Güçlü Yönler</span>
                    </div>
                    <ul className="space-y-1">
                      {report.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">Gelişim Alanları</span>
                    </div>
                    <ul className="space-y-1">
                      {report.improvements.map((s, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                          <span className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 text-[10px] font-bold">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Kariyer */}
                {report.careerGuidance && (
                  <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-3 flex items-start gap-2">
                    <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400">{report.careerGuidance}</p>
                  </div>
                )}

                {/* Öneriler */}
                {report.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-zinc-500">Önerilen Aksiyonlar</p>
                    {report.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="shrink-0 w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span><span className="text-zinc-300 font-medium">{rec.area}:</span> {rec.action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
