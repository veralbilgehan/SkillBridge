"use client";

import { useState } from "react";
import {
  FileSearch,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  Brain,
  Users,
  Send,
  BookOpen,
  Zap,
  AlertCircle,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Seviye = "Çok Yetkin" | "Yetkin" | "Ortalama" | "Yetkin Olmayan";

interface VakaTest {
  id: string;
  baslik: string;
  pozisyon: string;
  yetkinlikler: string[];
  sure: string;
  sorular: number;
  zorluk: "Başlangıç" | "Orta" | "İleri";
  aciklama: string;
}

interface SonucYetkinlik {
  ad: string;
  dogru: number;
  tutarli: number;
  toplam: number;
  seviye: Seviye;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_VAKALAR: VakaTest[] = [
  {
    id: "v1",
    baslik: "Tedarik Zinciri Krizi",
    pozisyon: "Operasyon Yöneticisi",
    yetkinlikler: ["Problem Çözme", "Karar Verme", "Kriz ve Risk Yönetimi"],
    sure: "25 dk",
    sorular: 20,
    zorluk: "İleri",
    aciklama: "Küresel bir tedarik zinciri aksayan bir şirkette kıdemli yönetici olarak acil eylem planı hazırlamanız bekleniyor.",
  },
  {
    id: "v2",
    baslik: "Müşteri Kayıp Analizi",
    pozisyon: "Pazarlama Müdürü",
    yetkinlikler: ["Analitik Düşünme", "Müşteri Odaklılık", "Veri ile Çalışma"],
    sure: "20 dk",
    sorular: 16,
    zorluk: "Orta",
    aciklama: "SaaS şirketinde churn oranı %15'e yükseldi. Kök nedeni tespit edip strateji belirlemeniz gerekiyor.",
  },
  {
    id: "v3",
    baslik: "Yeni Ürün Lansmanı",
    pozisyon: "Proje Yöneticisi",
    yetkinlikler: ["Planlama ve Organizasyon", "Paydaş Yönetimi", "Risk Yönetimi"],
    sure: "30 dk",
    sorular: 24,
    zorluk: "İleri",
    aciklama: "Bütçesi kısıtlı ve son tarihi sıkı olan bir ürün lansmanını yönetmeniz gerekiyor. Önceliklendirme kararları alacaksınız.",
  },
  {
    id: "v4",
    baslik: "Ekip Performans Sorunu",
    pozisyon: "Takım Lideri",
    yetkinlikler: ["Koçluk ve Ekip Geliştirme", "İletişim", "Karar Verme"],
    sure: "15 dk",
    sorular: 12,
    zorluk: "Başlangıç",
    aciklama: "Ekibinizde bir çalışanın performansı düşüyor ve ekip dinamikleri bozuluyor. Nasıl yönetirsiniz?",
  },
];

const MOCK_RAPOR: SonucYetkinlik[] = [
  { ad: "Problem Çözme", dogru: 17, tutarli: 19, toplam: 20, seviye: "Çok Yetkin" },
  { ad: "Karar Verme", dogru: 14, tutarli: 16, toplam: 20, seviye: "Yetkin" },
  { ad: "Kriz ve Risk Yönetimi", dogru: 10, tutarli: 13, toplam: 20, seviye: "Ortalama" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const seviyeConfig: Record<Seviye, { color: string; bg: string; range: string }> = {
  "Çok Yetkin":    { color: "text-emerald-400", bg: "bg-emerald-400/10", range: "%90–100" },
  "Yetkin":        { color: "text-indigo-400",  bg: "bg-indigo-400/10",  range: "%80–89"  },
  "Ortalama":      { color: "text-yellow-400",  bg: "bg-yellow-400/10",  range: "%50–79"  },
  "Yetkin Olmayan":{ color: "text-red-400",     bg: "bg-red-400/10",     range: "%0–49"   },
};

function SeviyeBadge({ seviye }: { seviye: Seviye }) {
  const cfg = seviyeConfig[seviye];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      {seviye}
    </span>
  );
}

function ZorluBadge({ zorluk }: { zorluk: VakaTest["zorluk"] }) {
  const map = {
    Başlangıç: "text-emerald-400 bg-emerald-400/10",
    Orta:      "text-yellow-400 bg-yellow-400/10",
    İleri:     "text-violet-400 bg-violet-400/10",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[zorluk]}`}>{zorluk}</span>
  );
}

// ─── Puanlama Mantığı Tablosu ─────────────────────────────────────────────────

function PuanlamaTablosu() {
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-700/50">
        <span className="text-sm font-medium text-zinc-300">Seviye Tablosu</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-zinc-500 border-b border-zinc-700/30">
            <th className="text-left px-4 py-2.5 font-medium">Puan Aralığı</th>
            <th className="text-left px-4 py-2.5 font-medium">Seviye</th>
          </tr>
        </thead>
        <tbody>
          {(Object.entries(seviyeConfig) as [Seviye, typeof seviyeConfig[Seviye]][]).map(([seviye, cfg]) => (
            <tr key={seviye} className="border-b border-zinc-700/20 last:border-b-0">
              <td className="px-4 py-2.5 text-zinc-400">{cfg.range}</td>
              <td className="px-4 py-2.5"><SeviyeBadge seviye={seviye} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Vaka Kartı ───────────────────────────────────────────────────────────────

function VakaKart({ vaka }: { vaka: VakaTest }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-800/40 border border-violet-500/20 hover:border-violet-500/40 rounded-xl p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <FileSearch className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{vaka.baslik}</span>
              <ZorluBadge zorluk={vaka.zorluk} />
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">{vaka.pozisyon}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
              <span>{vaka.sorular} soru</span>
              <span>·</span>
              <span>{vaka.sure}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-violet-400">
                <CheckCircle2 className="w-3 h-3" />
                Evet / Hayır
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {vaka.yetkinlikler.map((y) => (
                <span key={y} className="text-xs px-2 py-0.5 bg-zinc-700/60 text-zinc-400 rounded-md">{y}</span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-1"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pl-12 space-y-4">
          <p className="text-sm text-zinc-400">{vaka.aciklama}</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Send className="w-4 h-4" />
              Bu Vakayı Kullan
            </button>
            <button className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              <BookOpen className="w-4 h-4" />
              Önizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Seviye Tespit Sınavı ─────────────────────────────────────────────────────

type GeneratedMeta = { totalQuestions: number; estimatedDuration: number };

function SeviyeTespitBanner() {
  const [expanded, setExpanded] = useState(false);
  const [jd, setJd] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [meta, setMeta] = useState<GeneratedMeta | null>(null);
  const [apiError, setApiError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setApiError("");
    try {
      const res = await fetch("/api/ai/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentContent: jd,
          questionCount: 20,
          questionTypes: ["yes_no"],
          difficulty: "intermediate",
          language: "tr",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Test üretilemedi");
      setMeta(data.metadata ?? null);
      setGenerated(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Test üretilirken hata oluştu.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">Seviye Tespit Sınavı</span>
              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-medium">100 kontör</span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Görev Tanımını girin — Claude o pozisyona özel vaka ve doğrulama sorularını anında üretsin.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Doğruluk Puanı", "Tutarlılık Analizi", "AI Raporu", "Kariyer Planlaması"].map((f) => (
                <span key={f} className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-700/50 px-2 py-1 rounded-md">
                  <Star className="w-3 h-3 text-violet-400" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-violet-400 hover:text-violet-300 transition-colors"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && !generated && (
        <div className="space-y-3 pt-2 border-t border-violet-500/20">
          <label className="block text-xs text-zinc-400">Görev Tanımı (JD) — en az 100 karakter</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={6}
            placeholder="Pozisyon başlığı, sorumluluklar, beklenen yetkinlikler, sektör… ne kadar detaylı olursa AI o kadar isabetli sorular üretir."
            className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
          />
          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {apiError}
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={jd.length < 100 || generating}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Claude analiz ediyor… (~20 sn)</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Test Oluştur <span className="text-violet-200 text-xs">(100 kontör)</span></>
            )}
          </button>
        </div>
      )}

      {generated && (
        <div className="pt-2 border-t border-violet-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Test oluşturuldu —{" "}
            {meta ? `${meta.totalQuestions} soru · ~${meta.estimatedDuration} dakika` : "20 soru"}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Send className="w-4 h-4" /> Adaya Gönder
            </button>
            <button className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              <BookOpen className="w-4 h-4" /> Kütüphaneye Kaydet
            </button>
            <button
              onClick={() => { setGenerated(false); setMeta(null); setJd(""); setExpanded(true); }}
              className="text-xs text-zinc-500 hover:text-white px-3 py-2 rounded-lg bg-zinc-800 transition-colors"
            >
              Yeniden Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Örnek AI Raporu ──────────────────────────────────────────────────────────

function OrnekRapor() {
  const [open, setOpen] = useState(false);

  const toplam = MOCK_RAPOR.reduce((s, y) => s + y.dogru, 0);
  const toplamMaks = MOCK_RAPOR.reduce((s, y) => s + y.toplam, 0);
  const genelPuan = Math.round((toplam / toplamMaks) * 100);

  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-700/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-zinc-200">Örnek AI Raporu — Tedarik Zinciri Krizi</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-zinc-700/50">
          {/* Genel Skor */}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white">%{genelPuan}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Genel Skor</div>
              <SeviyeBadge seviye="Yetkin" />
              <div className="text-xs text-zinc-500 mt-1">{toplam}/{toplamMaks} doğru yanıt</div>
            </div>
          </div>

          {/* Yetkinlik Sonuçları */}
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Ölçülen Yetkinlikler</div>
            <div className="space-y-3">
              {MOCK_RAPOR.map((y) => {
                const pct = Math.round((y.dogru / y.toplam) * 100);
                const tutarliPct = Math.round((y.tutarli / y.toplam) * 100);
                return (
                  <div key={y.ad} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{y.ad}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Tutarlılık: %{tutarliPct}</span>
                        <SeviyeBadge seviye={y.seviye} />
                      </div>
                    </div>
                    <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-zinc-600">Doğruluk: %{pct} · {y.dogru}/{y.toplam} doğru</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analiz Türleri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/60 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                120° Analiz
              </div>
              <p className="text-xs text-zinc-500">Kişinin kendi değerlendirmesi + AI değerlendirmesi birleştirildi.</p>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Users className="w-3.5 h-3.5 text-violet-400" />
                360° Analiz
              </div>
              <p className="text-xs text-zinc-500">Yönetici, iş arkadaşı ve farklı departman girdileri mevcut olduğunda etkinleşir.</p>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Kariyer Planlaması
              </div>
              <p className="text-xs text-zinc-500">Mevcut seviyeye göre gelişim önerileri ve ilerleme yolu.</p>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Mesleğin Geleceği
              </div>
              <p className="text-xs text-zinc-500">AI teknoloji trendleri ve değişen roller hakkında yorum üretir.</p>
            </div>
          </div>

          {/* Geçmiş Karşılaştırma */}
          <div className="bg-zinc-900/60 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
              Geçmiş Performans Karşılaştırması
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                Önceki test (Şub 2026): %71
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Bu test (Mar 2026): %{genelPuan}
              </div>
              <span className="text-emerald-400 font-semibold">+{genelPuan - 71} puan ↑</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <AlertCircle className="w-3.5 h-3.5" />
            Bu rapor gerçek bir test sonucunu değil, temsili bir örneği göstermektedir.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "kutuphane",   label: "Vaka Kütüphanesi" },
  { id: "puanlama",    label: "Puanlama & Seviyeler" },
  { id: "rapor",       label: "AI Raporu (Örnek)" },
];

export default function VakaAnaliziPage() {
  const [activeTab, setActiveTab] = useState("kutuphane");
  const [filtreZorluk, setFiltreZorluk] = useState<string>("Tümü");

  const filtredVakalar = filtreZorluk === "Tümü"
    ? MOCK_VAKALAR
    : MOCK_VAKALAR.filter((v) => v.zorluk === filtreZorluk);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileSearch className="w-5 h-5 text-violet-400" />
          <h1 className="text-2xl font-bold text-white">Vaka Analizi</h1>
        </div>
        <p className="text-zinc-400 text-sm">
          Adayları gerçek iş senaryoları üzerinden değerlendirin — Evet/Hayır yanıtlarıyla doğruluk ve tutarlılık puanlama.
        </p>
      </div>

      {/* Seviye Tespit Sınavı Banner */}
      <SeviyeTespitBanner />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === id
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Vaka Kütüphanesi */}
      {activeTab === "kutuphane" && (
        <div className="space-y-4">
          {/* Zorluk Filtresi */}
          <div className="flex gap-2">
            {["Tümü", "Başlangıç", "Orta", "İleri"].map((z) => (
              <button
                key={z}
                onClick={() => setFiltreZorluk(z)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filtreZorluk === z
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtredVakalar.map((v) => <VakaKart key={v.id} vaka={v} />)}
          </div>
        </div>
      )}

      {/* Puanlama & Seviyeler */}
      {activeTab === "puanlama" && (
        <div className="space-y-6 max-w-2xl">
          <PuanlamaTablosu />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">Puanlama Mantığı</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-zinc-200">Doğruluk Puanı</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Verilen yanıtın vakadaki nesnel doğruya uygunluğu. Her soru bağımsız olarak değerlendirilir.
                </p>
              </div>
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-zinc-200">Tutarlılık Puanı</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Birbiriyle çelişen yanıtların tespiti. A sorusuna "Evet", A'yı çürüten B sorusuna da "Evet" vermek tutarsız sayılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Raporu */}
      {activeTab === "rapor" && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-sm text-zinc-400">
            Vaka testi tamamlandıktan sonra aşağıdaki bileşenleri içeren detaylı AI raporu otomatik oluşturulur.
          </p>
          <OrnekRapor />
        </div>
      )}
    </div>
  );
}
