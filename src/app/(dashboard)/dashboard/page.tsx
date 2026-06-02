"use client";

import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Seviye = "Çok Yetkin" | "Yetkin" | "Ortalama" | "Yetkin Olmayan";

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
  {
    href: "/tests/new",
    icon: <Plus className="w-5 h-5 text-indigo-400" />,
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Test Oluştur",
    desc: "Yeni bir yetkinlik veya teknik testi oluştur ve adaylara gönder.",
  },
  {
    href: "/candidates",
    icon: <UserPlus className="w-5 h-5 text-violet-400" />,
    iconBg: "bg-violet-500/10 border-violet-500/20",
    title: "Aday Davet Et",
    desc: "E-posta ile aday davet et ve sonuçları tek ekrandan takip et.",
  },
  {
    href: "/cv-analysis",
    icon: <FileSearch className="w-5 h-5 text-emerald-400" />,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "CV Analizi Yap",
    desc: "Yüklenen CV'yi AI ile analiz et, pozisyona uygunluğunu ölç.",
  },
  {
    href: "/tests?tab=Vaka+Analizi",
    icon: <Layers className="w-5 h-5 text-amber-400" />,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    title: "Vaka Analizi",
    desc: "Gerçekçi senaryo testleriyle adayın karar alma yetkinliğini değerlendir.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hoş geldin, Ayşe Kaya</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            6 Mart 2026 · Son güncelleme az önce
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

      {/* ── Metrik Kartları ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetrikKart
          icon={<ClipboardList className="w-4 h-4 text-emerald-400" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          label="Aktif Test"
          value="3"
          trend="+1 bu hafta"
          trendColor="text-emerald-400"
          border="border-emerald-500/15"
        />
        <MetrikKart
          icon={<Users className="w-4 h-4 text-violet-400" />}
          iconBg="bg-violet-500/10 border-violet-500/20"
          label="Toplam Katılım"
          value="76"
          trend="+12 bu hafta"
          trendColor="text-violet-400"
          sub="aday"
          border="border-violet-500/15"
        />
        <MetrikKart
          icon={<BarChart2 className="w-4 h-4 text-amber-400" />}
          iconBg="bg-amber-500/10 border-amber-500/20"
          label="Ortalama Başarı"
          value="%70"
          trend="tüm testler"
          trendColor="text-zinc-500"
          border="border-amber-500/15"
        />
        <MetrikKart
          icon={<Coins className="w-4 h-4 text-indigo-400" />}
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          label="Kontör Bakiyesi"
          value="247"
          trend="Paket Al"
          trendColor="text-indigo-400"
          trendHref="/settings#credits"
          border="border-indigo-500/15"
        />
      </div>

      {/* ── Son Aktiviteler + Seviye Dağılımı ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Son Aktiviteler — 60% */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Son Aktiviteler</h2>
            <Link
              href="/results"
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Tümünü Gör
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {SON_AKTIVITELER.map((item) => {
              const cfg = SEVIYE_CONFIG[item.seviye];
              const initials = item.ad
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-zinc-300">{initials}</span>
                  </div>
                  {/* Name + test */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.ad}</p>
                    <p className="text-xs text-zinc-500 truncate">{item.test}</p>
                  </div>
                  {/* Seviye badge */}
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline",
                      cfg.bg,
                      cfg.color,
                      cfg.border
                    )}
                  >
                    {item.seviye}
                  </span>
                  {/* Puan */}
                  <span
                    className={cn(
                      "text-sm font-bold shrink-0",
                      item.puan >= 85
                        ? "text-emerald-400"
                        : item.puan >= 70
                        ? "text-indigo-400"
                        : item.puan >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                    )}
                  >
                    %{item.puan}
                  </span>
                  {/* Tarih */}
                  <span className="text-xs text-zinc-600 shrink-0 w-14 text-right hidden md:block">
                    {item.tarih}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seviye Dağılımı — 40% */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Seviye Dağılımı</h2>
            <span className="text-xs text-zinc-500">30 tamamlama</span>
          </div>

          {/* Bar chart */}
          <div className="flex flex-col gap-3.5">
            {SEVIYE_DAGILIMI.map(({ seviye, sayi, yuzde }) => {
              const cfg = SEVIYE_CONFIG[seviye];
              return (
                <div key={seviye} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-medium", cfg.color)}>{seviye}</span>
                    <span className="text-xs text-zinc-400">
                      {sayi} <span className="text-zinc-600">(%{yuzde})</span>
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", cfg.bar)}
                      style={{ width: `${yuzde}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend dots */}
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

      {/* ── Aktif Testler Tablosu ───────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Aktif Testler</h2>
          <Link
            href="/tests"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Tüm Testler
            <ChevronRight className="w-3.5 h-3.5" />
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
                <tr
                  key={test.id}
                  className={cn(
                    "border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors",
                    i % 2 !== 0 && "bg-zinc-900/50"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ClipboardList className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <p className="text-sm font-medium text-white line-clamp-1">
                        {test.title.split("—")[0].trim()}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-zinc-400">{test.sektor}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-medium text-white">{test.adaySayisi}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        test.ortPuan >= 75
                          ? "text-emerald-400"
                          : test.ortPuan >= 60
                          ? "text-indigo-400"
                          : "text-amber-400"
                      )}
                    >
                      %{test.ortPuan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Aktif
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/results"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors justify-end"
                    >
                      Sonuçlar
                      <ChevronRight className="w-3.5 h-3.5" />
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
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col gap-3 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
                  item.iconBg
                )}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors mt-auto">
                Başla
                <ChevronRight className="w-3.5 h-3.5" />
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
        </div>
      </div>
    </div>
  );
}

// ─── Metrik Kart ──────────────────────────────────────────────────────────────

function MetrikKart({
  icon,
  iconBg,
  label,
  value,
  trend,
  trendColor,
  trendHref,
  sub,
  border,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  trendHref?: string;
  sub?: string;
  border: string;
}) {
  return (
    <div className={cn("bg-zinc-900 border rounded-2xl px-5 py-4", border)}>
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center shrink-0", iconBg)}>
          {icon}
        </div>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value}
        {sub && <span className="text-sm font-normal text-zinc-500 ml-1">{sub}</span>}
      </p>
      {trendHref ? (
        <Link href={trendHref} className={cn("text-xs mt-1 flex items-center gap-0.5 hover:underline", trendColor)}>
          {trend}
          <ChevronRight className="w-3 h-3" />
        </Link>
      ) : (
        <p className={cn("text-xs mt-1 flex items-center gap-1", trendColor)}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </p>
      )}
    </div>
  );
}
