"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Users,
  BarChart2,
  Coins,
  TrendingUp,
  Plus,
  ChevronRight,
  UserPlus,
  FileSearch,
  Layers,
  CheckCircle2,
  Search,
  Sparkles,
  Send,
  Bot,
  X,
  ArrowRight,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Seviye = "Çok Yetkin" | "Yetkin" | "Ortalama" | "Yetkin Olmayan";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

// ─── Komut Eşleme ─────────────────────────────────────────────────────────────

const KOMUTLAR = [
  { anahtar: ["test oluştur", "yeni test", "test ekle"], href: "/tests/new", label: "Test Oluştur", icon: Plus, renk: "text-indigo-400" },
  { anahtar: ["testler", "test listesi", "testlerim"], href: "/tests", label: "Test Listesi", icon: ClipboardList, renk: "text-indigo-400" },
  { anahtar: ["aday", "adaylar", "aday davet"], href: "/candidates", label: "Adaylar", icon: Users, renk: "text-violet-400" },
  { anahtar: ["sonuç", "sonuçlar", "analiz"], href: "/results", label: "Sonuçlar", icon: BarChart2, renk: "text-amber-400" },
  { anahtar: ["cv", "cv analiz", "özgeçmiş"], href: "/cv-analysis", label: "CV Analizi", icon: FileSearch, renk: "text-emerald-400" },
  { anahtar: ["belge", "doküman", "döküman"], href: "/documents", label: "Dokümanlar", icon: Layers, renk: "text-rose-400" },
  { anahtar: ["kontör", "bakiye", "satın al", "kredi"], href: "/settings#credits", label: "Kontör Yönetimi", icon: Coins, renk: "text-yellow-400" },
  { anahtar: ["vaka", "senaryo", "vaka analizi"], href: "/tests?tab=Vaka+Analizi", label: "Vaka Analizi", icon: Layers, renk: "text-violet-400" },
];

function araKomutlar(q: string) {
  if (!q.trim()) return [];
  const ql = q.toLowerCase();
  return KOMUTLAR.filter((k) => k.anahtar.some((a) => a.includes(ql) || ql.includes(a)));
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SON_AKTIVITELER = [
  { id: "a1", ad: "Ahmet Yılmaz",  test: "Yazılım Geliştirici", seviye: "Çok Yetkin" as Seviye, puan: 90, tarih: "2 Mar" },
  { id: "a2", ad: "Elif Demir",    test: "Yazılım Geliştirici", seviye: "Çok Yetkin" as Seviye, puan: 83, tarih: "2 Mar" },
  { id: "a7", ad: "Burak Özkan",   test: "Yazılım Geliştirici", seviye: "Çok Yetkin" as Seviye, puan: 90, tarih: "28 Şub" },
  { id: "b1", ad: "Hakan Yurt",    test: "Finans Uzmanı",       seviye: "Çok Yetkin" as Seviye, puan: 89, tarih: "25 Şub" },
  { id: "c1", ad: "Aslı Yıldırım", test: "İK Uzmanı",           seviye: "Çok Yetkin" as Seviye, puan: 93, tarih: "20 Şub" },
];

const AKTIF_TESTLER = [
  { id: "1", title: "Yazılım Geliştirici — Teknik Yetkinlik Testi", sektor: "Bilişim Teknolojileri", adaySayisi: 12, ortPuan: 69 },
  { id: "2", title: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık",  adaySayisi: 8,  ortPuan: 70 },
  { id: "3", title: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",         adaySayisi: 34, ortPuan: 72 },
];

const SEVIYE_DAGILIMI: { seviye: Seviye; sayi: number; yuzde: number }[] = [
  { seviye: "Çok Yetkin",     sayi: 9,  yuzde: 30 },
  { seviye: "Yetkin",         sayi: 8,  yuzde: 27 },
  { seviye: "Ortalama",       sayi: 9,  yuzde: 30 },
  { seviye: "Yetkin Olmayan", sayi: 4,  yuzde: 13 },
];

const SEVIYE_CONFIG: Record<Seviye, { color: string; bg: string; border: string; bar: string }> = {
  "Çok Yetkin":     { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
  "Yetkin":         { color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  bar: "bg-indigo-500"  },
  "Ortalama":       { color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   bar: "bg-amber-500"   },
  "Yetkin Olmayan": { color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     bar: "bg-red-500"     },
};

const HIZLI_ERISIM = [
  { href: "/tests/new",  icon: <Plus className="w-5 h-5 text-indigo-400" />,   iconBg: "bg-indigo-500/10 border-indigo-500/20",  title: "Test Oluştur",  desc: "Yeni bir yetkinlik veya teknik testi oluştur ve adaylara gönder." },
  { href: "/candidates", icon: <UserPlus className="w-5 h-5 text-violet-400" />, iconBg: "bg-violet-500/10 border-violet-500/20", title: "Aday Davet Et", desc: "E-posta ile aday davet et ve sonuçları tek ekrandan takip et." },
  { href: "/cv-analysis", icon: <FileSearch className="w-5 h-5 text-emerald-400" />, iconBg: "bg-emerald-500/10 border-emerald-500/20", title: "CV Analizi Yap", desc: "Yüklenen CV'yi AI ile analiz et, pozisyona uygunluğunu ölç." },
  { href: "/tests?tab=Vaka+Analizi", icon: <Layers className="w-5 h-5 text-amber-400" />, iconBg: "bg-amber-500/10 border-amber-500/20", title: "Vaka Analizi", desc: "Gerçekçi senaryo testleriyle adayın karar alma yetkinliğini değerlendir." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  // ── Arama ──────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sonuclar = araKomutlar(query);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocus(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSelect(href: string) {
    setQuery("");
    setSearchFocus(false);
    router.push(href);
  }

  // ── Chat ───────────────────────────────────────────────────────────────────
  const [chatAcik, setChatAcik] = useState(false);
  const [mesajlar, setMesajlar] = useState<ChatMsg[]>([
    { role: "assistant", content: "Merhaba! SkillBridge asistanınım. Test oluşturma, aday yönetimi veya platform hakkında her konuda yardımcı olabilirim. Ne yapmak istersiniz?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatAcik) chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar, chatAcik]);

  const sendMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    const newMsgs: ChatMsg[] = [...mesajlar, { role: "user", content: text }];
    setMesajlar(newMsgs);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMesajlar((p) => [...p, { role: "assistant", content: data.content ?? data.error ?? "Bir hata oluştu." }]);
    } catch {
      setMesajlar((p) => [...p, { role: "assistant", content: "Bağlantı hatası. Lütfen tekrar deneyin." }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }
  }, [chatInput, chatLoading, mesajlar]);

  const HAYALET_AKSIYONLAR = [
    { label: "Test Oluştur", href: "/tests/new", renk: "indigo" },
    { label: "Aday Davet Et", href: "/candidates", renk: "violet" },
    { label: "CV Analizi", href: "/cv-analysis", renk: "emerald" },
    { label: "Sonuçlar", href: "/results", renk: "amber" },
    { label: "Dokümanlar", href: "/documents", renk: "rose" },
    { label: "Vaka Analizi", href: "/tests?tab=Vaka+Analizi", renk: "purple" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hoş geldin, Ayşe Kaya</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} · Son güncelleme az önce
          </p>
        </div>
        <Link
          href="/tests/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Test Oluştur
        </Link>
      </div>

      {/* ── Komut Arama ────────────────────────────────────────────────────── */}
      <div ref={searchRef} className="relative">
        {/* Arka plan hayalet aksiyonlar */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-300",
            searchFocus || query ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-2xl" />
          <div className="flex items-center h-full px-5 gap-3 overflow-hidden">
            <Search className="w-4 h-4 text-zinc-700 shrink-0" />
            <span className="text-sm text-zinc-700 shrink-0">Ne yapmak istersiniz?</span>
            <div className="flex items-center gap-2 ml-2 overflow-hidden">
              {HAYALET_AKSIYONLAR.map((a) => (
                <span
                  key={a.label}
                  className="shrink-0 text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-600 whitespace-nowrap"
                >
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gerçek input */}
        <div
          className={cn(
            "relative flex items-center rounded-2xl border transition-all duration-200",
            searchFocus || query
              ? "bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-500/5"
              : "bg-transparent border-transparent"
          )}
        >
          <Search className={cn("absolute left-4 w-4 h-4 transition-colors", searchFocus || query ? "text-indigo-400" : "text-transparent")} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && sonuclar.length > 0) handleSelect(sonuclar[0].href);
              if (e.key === "Escape") { setSearchFocus(false); setQuery(""); }
            }}
            placeholder={searchFocus ? "Test oluştur, aday davet et, CV analizi yap…" : ""}
            className="w-full h-12 pl-11 pr-4 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="absolute right-4 text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sonuç dropdown */}
        {(searchFocus && query) && (
          <div className="absolute top-full mt-2 left-0 right-0 z-40 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {sonuclar.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-zinc-500">Eşleşme bulunamadı.</p>
                <button
                  onClick={() => { setChatAcik(true); setSearchFocus(false); setChatInput(query); setQuery(""); }}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mx-auto"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  AI Asistana sor: &quot;{query}&quot;
                </button>
              </div>
            ) : (
              <div className="py-1">
                {sonuclar.map((k) => {
                  const Icon = k.icon;
                  return (
                    <button
                      key={k.href}
                      onClick={() => handleSelect(k.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <Icon className={cn("w-4 h-4", k.renk)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{k.label}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Boş focus — hızlı aksiyonlar göster */}
        {(searchFocus && !query) && (
          <div className="absolute top-full mt-2 left-0 right-0 z-40 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Hızlı Erişim</p>
            </div>
            <div className="py-1">
              {KOMUTLAR.slice(0, 6).map((k) => {
                const Icon = k.icon;
                return (
                  <button
                    key={k.href}
                    onClick={() => handleSelect(k.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Icon className={cn("w-3.5 h-3.5", k.renk)} />
                    </div>
                    <p className="text-sm text-zinc-300">{k.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Metrik Kartları ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetrikKart icon={<ClipboardList className="w-4 h-4 text-emerald-400" />} iconBg="bg-emerald-500/10 border-emerald-500/20" label="Aktif Test" value="3" trend="+1 bu hafta" trendColor="text-emerald-400" border="border-emerald-500/15" />
        <MetrikKart icon={<Users className="w-4 h-4 text-violet-400" />} iconBg="bg-violet-500/10 border-violet-500/20" label="Toplam Katılım" value="76" trend="+12 bu hafta" trendColor="text-violet-400" sub="aday" border="border-violet-500/15" />
        <MetrikKart icon={<BarChart2 className="w-4 h-4 text-amber-400" />} iconBg="bg-amber-500/10 border-amber-500/20" label="Ortalama Başarı" value="%70" trend="tüm testler" trendColor="text-zinc-500" border="border-amber-500/15" />
        <MetrikKart icon={<Coins className="w-4 h-4 text-indigo-400" />} iconBg="bg-indigo-500/10 border-indigo-500/20" label="Kontör Bakiyesi" value="247" trend="Paket Al" trendColor="text-indigo-400" trendHref="/settings#credits" border="border-indigo-500/15" />
      </div>

      {/* ── Son Aktiviteler + Seviye Dağılımı ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Son Aktiviteler</h2>
            <Link href="/results" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Tümünü Gör <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {SON_AKTIVITELER.map((item) => {
              const cfg = SEVIYE_CONFIG[item.seviye];
              const initials = item.ad.split(" ").map((n) => n[0]).join("").slice(0, 2);
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-zinc-300">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.ad}</p>
                    <p className="text-xs text-zinc-500 truncate">{item.test}</p>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline", cfg.bg, cfg.color, cfg.border)}>
                    {item.seviye}
                  </span>
                  <span className={cn("text-sm font-bold shrink-0", item.puan >= 85 ? "text-emerald-400" : item.puan >= 70 ? "text-indigo-400" : item.puan >= 50 ? "text-amber-400" : "text-red-400")}>
                    %{item.puan}
                  </span>
                  <span className="text-xs text-zinc-600 shrink-0 w-14 text-right hidden md:block">{item.tarih}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Seviye Dağılımı</h2>
            <span className="text-xs text-zinc-500">30 tamamlama</span>
          </div>
          <div className="flex flex-col gap-3.5">
            {SEVIYE_DAGILIMI.map(({ seviye, sayi, yuzde }) => {
              const cfg = SEVIYE_CONFIG[seviye];
              return (
                <div key={seviye} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-medium", cfg.color)}>{seviye}</span>
                    <span className="text-xs text-zinc-400">{sayi} <span className="text-zinc-600">(%{yuzde})</span></span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", cfg.bar)} style={{ width: `${yuzde}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 flex-wrap border-t border-zinc-800 pt-4">
            {SEVIYE_DAGILIMI.map(({ seviye, yuzde }) => {
              const cfg = SEVIYE_CONFIG[seviye];
              return (
                <span key={seviye} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.bar)} />
                  {yuzde}%
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Aktif Testler ──────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Aktif Testler</h2>
          <Link href="/tests" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Tüm Testler <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Test Adı</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 hidden md:table-cell">Sektör</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500">Aday</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 hidden sm:table-cell">Ort. Puan</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500">Durum</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500" />
              </tr>
            </thead>
            <tbody>
              {AKTIF_TESTLER.map((test, i) => (
                <tr key={test.id} className={cn("border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors", i % 2 !== 0 && "bg-zinc-900/50")}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ClipboardList className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <p className="text-sm font-medium text-white line-clamp-1">{test.title.split("—")[0].trim()}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs text-zinc-400">{test.sektor}</span></td>
                  <td className="px-4 py-3.5 text-center"><span className="text-sm font-medium text-white">{test.adaySayisi}</span></td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <span className={cn("text-sm font-bold", test.ortPuan >= 75 ? "text-emerald-400" : test.ortPuan >= 60 ? "text-indigo-400" : "text-amber-400")}>
                      %{test.ortPuan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Aktif</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/results" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors justify-end">
                      Sonuçlar <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Hızlı Erişim ───────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {HIZLI_ERISIM.map((item) => (
            <Link key={item.title} href={item.href} className="group flex flex-col gap-3 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0", item.iconBg)}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors mt-auto">
                Başla <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── AI Öneri Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-zinc-900 p-5">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-indigo-500/6 blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">AI Önerileri</h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {[
                "Yazılım Geliştirici testindeki 4 Çok Yetkin aday teknik mülakate hazır.",
                "Finans Uzmanı pozisyonunda 2 Çok Yetkin, 3 Yetkin aday ile kısa liste oluşturabilirsiniz.",
                "İK testinde tamamlanmayan 4 adaya hatırlatma gönderilmesi önerilir.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setChatAcik(true)}
            className="shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-400 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sohbet Et
          </button>
        </div>
      </div>

      {/* ── Chat Balonu (FAB) ───────────────────────────────────────────────── */}
      {!chatAcik && (
        <button
          onClick={() => setChatAcik(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-105"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
      {chatAcik && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[560px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">SkillBridge Asistanı</p>
              <p className="text-[10px] text-zinc-500">Proje dahilinde yardım eder</p>
            </div>
            <button onClick={() => setChatAcik(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
            {mesajlar.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-indigo-400" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] text-xs leading-relaxed px-3 py-2 rounded-2xl",
                    m.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-300 rounded-bl-sm"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Hızlı sorular */}
          {mesajlar.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {[
                "Test nasıl oluşturabilirim?",
                "Aday nasıl davet ederim?",
                "Kontör ne işe yarar?",
                "CV analizi nedir?",
              ].map((soru) => (
                <button
                  key={soru}
                  onClick={() => { setChatInput(soru); setTimeout(() => { setChatInput(soru); }, 0); }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  {soru}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-zinc-800 shrink-0">
            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2">
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Bir şey sorun…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="w-7 h-7 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Metrik Kart ──────────────────────────────────────────────────────────────

function MetrikKart({
  icon, iconBg, label, value, trend, trendColor, trendHref, sub, border,
}: {
  icon: React.ReactNode; iconBg: string; label: string; value: string;
  trend: string; trendColor: string; trendHref?: string; sub?: string; border: string;
}) {
  return (
    <div className={cn("bg-zinc-900 border rounded-2xl px-5 py-4", border)}>
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center shrink-0", iconBg)}>{icon}</div>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value}
        {sub && <span className="text-sm font-normal text-zinc-500 ml-1">{sub}</span>}
      </p>
      {trendHref ? (
        <Link href={trendHref} className={cn("text-xs mt-1 flex items-center gap-0.5 hover:underline", trendColor)}>
          {trend} <ChevronRight className="w-3 h-3" />
        </Link>
      ) : (
        <p className={cn("text-xs mt-1 flex items-center gap-1", trendColor)}>
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      )}
    </div>
  );
}
