"use client";

import { useState } from "react";
import {
  FileScan,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
  Star,
  ArrowUpDown,
  Download,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdayCV {
  id: string;
  ad: string;
  cvText: string;
  cvSkor: number;
  testSkor: number | null;
  nihai: number;
  gucluYonler: string[];
  eksikYetkinlikler: string[];
  ozet: string;
  tavsiye?: string;
  mulakat?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SkorRenk(skor: number) {
  if (skor >= 85) return "text-emerald-400";
  if (skor >= 70) return "text-indigo-400";
  if (skor >= 55) return "text-yellow-400";
  return "text-red-400";
}

function SkorBar({ skor, renk }: { skor: number; renk: string }) {
  const bg =
    renk === "text-emerald-400" ? "bg-emerald-400"
    : renk === "text-indigo-400" ? "bg-indigo-400"
    : renk === "text-yellow-400" ? "bg-yellow-400"
    : "bg-red-400";
  return (
    <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${skor}%` }} />
    </div>
  );
}

// ─── Aday Kartı ───────────────────────────────────────────────────────────────

function AdayKart({ aday, rank }: { aday: AdayCV; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const renk = SkorRenk(aday.nihai);

  return (
    <div className={`bg-zinc-800/40 border rounded-xl overflow-hidden transition-colors ${rank === 1 ? "border-emerald-500/30" : "border-zinc-700/50"}`}>
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-zinc-700/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${rank === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700/60 text-zinc-400"}`}>
          {rank === 1 ? <Trophy className="w-4 h-4" /> : rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{aday.ad}</span>
            {rank === 1 && <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">En Uyumlu</span>}
          </div>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-center hidden sm:block">
            <div className="text-xs text-zinc-500">CV Uyumu</div>
            <div className={`text-sm font-bold ${SkorRenk(aday.cvSkor)}`}>%{aday.cvSkor}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-zinc-500">Nihai</div>
            <div className={`text-lg font-bold ${renk}`}>%{aday.nihai}</div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
      </div>

      {expanded && (
        <div className="border-t border-zinc-700/50 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">CV Uyumu</span>
                <span className={SkorRenk(aday.cvSkor)}>%{aday.cvSkor}</span>
              </div>
              <SkorBar skor={aday.cvSkor} renk={SkorRenk(aday.cvSkor)} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Nihai Skor</span>
                <span className={`font-bold ${renk}`}>%{aday.nihai}</span>
              </div>
              <SkorBar skor={aday.nihai} renk={renk} />
            </div>
          </div>

          {aday.ozet && (
            <div className="bg-zinc-900/50 rounded-lg px-3 py-2.5 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400">{aday.ozet}</p>
            </div>
          )}

          {aday.tavsiye && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-indigo-300"><span className="font-semibold">AI Tavsiyesi:</span> {aday.tavsiye}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aday.gucluYonler.length > 0 && (
              <div>
                <div className="text-xs font-medium text-emerald-400 mb-1.5">Öne Çıkan Güçlü Yönler</div>
                <ul className="space-y-1">
                  {aday.gucluYonler.map((g) => (
                    <li key={g} className="flex items-start gap-1.5 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {aday.eksikYetkinlikler.length > 0 && (
              <div>
                <div className="text-xs font-medium text-red-400 mb-1.5">Eksik Yetkinlikler</div>
                <ul className="space-y-1">
                  {aday.eksikYetkinlikler.map((e) => (
                    <li key={e} className="flex items-start gap-1.5 text-xs text-zinc-400">
                      <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {aday.mulakat && aday.mulakat.length > 0 && (
            <div>
              <div className="text-xs font-medium text-zinc-400 mb-1.5">Mülakat Soruları Önerileri</div>
              <ul className="space-y-1">
                {aday.mulakat.map((s, i) => (
                  <li key={i} className="text-xs text-zinc-500 pl-3 border-l border-zinc-700">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Karşılaştırma Tablosu ────────────────────────────────────────────────────

function KarsilastirmaTablosu({ adaylar }: { adaylar: AdayCV[] }) {
  const [sirala, setSirala] = useState<"nihai" | "cv">("nihai");
  const sorted = [...adaylar].sort((a, b) =>
    sirala === "cv" ? b.cvSkor - a.cvSkor : b.nihai - a.nihai
  );

  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Karşılaştırma Tablosu</span>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          {(["nihai", "cv"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSirala(k)}
              className={`px-2 py-0.5 rounded ${sirala === k ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {k === "nihai" ? "Nihai" : "CV"}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-zinc-500 border-b border-zinc-700/30">
            <th className="text-left px-4 py-2.5 font-medium">Sıra</th>
            <th className="text-left px-4 py-2.5 font-medium">Aday</th>
            <th className="text-center px-4 py-2.5 font-medium">CV Uyumu</th>
            <th className="text-center px-4 py-2.5 font-medium">Nihai</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => (
            <tr key={a.id} className={`border-b border-zinc-700/20 last:border-b-0 ${i === 0 ? "bg-emerald-500/5" : ""}`}>
              <td className="px-4 py-3">
                {i === 0 ? <Trophy className="w-4 h-4 text-emerald-400" /> : <span className="text-zinc-500 text-xs">{i + 1}</span>}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-200 text-sm">{a.ad}</td>
              <td className={`px-4 py-3 text-center text-sm font-semibold ${SkorRenk(a.cvSkor)}`}>%{a.cvSkor}</td>
              <td className={`px-4 py-3 text-center text-sm font-bold ${SkorRenk(a.nihai)}`}>%{a.nihai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

interface AdayGirisi {
  id: string;
  ad: string;
  cvText: string;
}

export default function CVAnalysisPage() {
  const [jd, setJd] = useState("");
  const [adaylar, setAdaylar] = useState<AdayGirisi[]>([
    { id: "1", ad: "", cvText: "" },
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [results, setResults] = useState<AdayCV[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"liste" | "tablo">("liste");

  function addAday() {
    setAdaylar((prev) => [...prev, { id: Date.now().toString(), ad: "", cvText: "" }]);
  }

  function removeAday(id: string) {
    setAdaylar((prev) => prev.filter((a) => a.id !== id));
  }

  function updateAday(id: string, field: keyof AdayGirisi, value: string) {
    setAdaylar((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }

  async function handleAnalyze() {
    const validAdaylar = adaylar.filter((a) => a.cvText.trim().length > 30);
    if (jd.trim().length < 50) {
      setError("Görev tanımı en az 50 karakter olmalıdır.");
      return;
    }
    if (validAdaylar.length === 0) {
      setError("En az bir adayın CV metni girilmelidir (min. 30 karakter).");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const analysisResults: AdayCV[] = await Promise.all(
        validAdaylar.map(async (aday) => {
          const res = await fetch("/api/ai/match-cv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cvContent: aday.cvText,
              jobDescription: jd,
              candidateName: aday.ad || "Aday",
              language: "tr",
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Analiz hatası");

          return {
            id: aday.id,
            ad: aday.ad || "İsimsiz Aday",
            cvText: aday.cvText,
            cvSkor: data.matchScore ?? 0,
            testSkor: null,
            nihai: data.matchScore ?? 0,
            gucluYonler: data.strengths ?? [],
            eksikYetkinlikler: data.missingSkills ?? [],
            ozet: (data.matchedSkills ?? []).slice(0, 3).join(", "),
            tavsiye: data.recommendation,
            mulakat: data.interviewSuggestions ?? [],
          };
        })
      );

      setResults(analysisResults.sort((a, b) => b.nihai - a.nihai));
      setAnalyzed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analiz sırasında hata oluştu.");
    } finally {
      setAnalyzing(false);
    }
  }

  const sorted = [...results].sort((a, b) => b.nihai - a.nihai);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileScan className="w-5 h-5 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">CV Analizi</h1>
        </div>
        <p className="text-zinc-400 text-sm">
          Görev tanımı ile CV'leri karşılaştırın — AI uyum skoru ve aday sıralaması üretir.
        </p>
      </div>

      {!analyzed ? (
        <div className="space-y-5 max-w-3xl">
          {/* JD */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Görev Tanımı (JD)</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Pozisyon, sorumluluklar ve aranan yetkinlikler</p>
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              placeholder="Pozisyon başlığı, sorumluluklar, aranan yetkinlikler ve nitelikler…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
            />
            <p className="text-xs text-zinc-600">{jd.length} karakter</p>
          </div>

          {/* Adaylar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Aday CV Metinleri</h2>
                <p className="text-xs text-zinc-500 mt-0.5">CV içeriğini yapıştırın veya yazın</p>
              </div>
              <button
                onClick={addAday}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Aday Ekle
              </button>
            </div>

            <div className="space-y-4">
              {adaylar.map((aday, idx) => (
                <div key={aday.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-semibold text-zinc-500 shrink-0">#{idx + 1}</span>
                      <input
                        type="text"
                        value={aday.ad}
                        onChange={(e) => updateAday(aday.id, "ad", e.target.value)}
                        placeholder="Aday adı (opsiyonel)"
                        className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    {adaylar.length > 1 && (
                      <button
                        onClick={() => removeAday(aday.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={aday.cvText}
                    onChange={(e) => updateAday(aday.id, "cvText", e.target.value)}
                    rows={5}
                    placeholder="CV metnini buraya yapıştırın — deneyim, eğitim, beceriler, projeler…"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 text-xs text-zinc-400">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            Birden fazla aday aynı anda analiz edilebilir. Her aday için paralel Claude çağrısı yapılır.
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={jd.length < 50 || analyzing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Claude analiz ediyor… ({adaylar.filter(a => a.cvText.trim().length > 30).length} aday)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                CV&apos;leri Analiz Et
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {results.length} aday analiz edildi
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setAnalyzed(false); setResults([]); setError(""); }}
                className="text-xs text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 transition-colors"
              >
                Yeni Analiz
              </button>
              <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 transition-colors">
                <Download className="w-3.5 h-3.5" /> CSV İndir
              </button>
            </div>
          </div>

          {sorted.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-indigo-500/5 border border-emerald-500/25 rounded-xl px-5 py-4 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white">Önerilen Aday: {sorted[0].ad}</div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Nihai skor %{sorted[0].nihai} ile listenin birincisi.
                  {sorted[0].tavsiye && ` ${sorted[0].tavsiye}`}
                </p>
              </div>
              <div className="ml-auto shrink-0">
                <span className="flex items-center gap-1 text-lg font-bold text-emerald-400">
                  <Star className="w-4 h-4" /> %{sorted[0].nihai}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-1 border-b border-zinc-800">
            {(["liste", "tablo"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === id
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {id === "liste" ? "Aday Detayları" : "Karşılaştırma Tablosu"}
              </button>
            ))}
          </div>

          {activeTab === "liste" && (
            <div className="space-y-3">
              {sorted.map((a, i) => <AdayKart key={a.id} aday={a} rank={i + 1} />)}
            </div>
          )}

          {activeTab === "tablo" && (
            <div className="max-w-2xl">
              <KarsilastirmaTablosu adaylar={results} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
