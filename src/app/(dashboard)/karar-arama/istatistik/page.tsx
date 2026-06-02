"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Database, FileSearch, TrendingUp, Building2 } from "lucide-react";

type Stats = {
  total: number;
  byKaynak: Record<string, number>;
  bySonuc: Record<string, number>;
  topDaire: { daire: string; sayi: number }[];
};

const MOCK_STATS: Stats = {
  total: 140000,
  byKaynak: { emsal: 70000, yargitay: 70000 },
  bySonuc: { Bozma: 7, Onama: 2, Belirsiz: 1 },
  topDaire: [
    { daire: "1. Ceza Dairesi", sayi: 104 },
    { daire: "Ceza Genel Kurulu", sayi: 37 },
    { daire: "4. Ceza Dairesi", sayi: 24 },
    { daire: "İstanbul BAM 17. Hukuk Dairesi", sayi: 24 },
    { daire: "Ankara 9. Asliye Ticaret Mahkemesi", sayi: 15 },
    { daire: "18. Ceza Dairesi", sayi: 14 },
    { daire: "İstanbul BAM 45. Hukuk Dairesi", sayi: 14 },
    { daire: "Ankara 5. Asliye Ticaret Mahkemesi", sayi: 12 },
  ],
};

const SONUC_COLORS: Record<string, string> = {
  Bozma:    "bg-red-500",
  Onama:    "bg-green-500",
  Red:      "bg-yellow-500",
  Belirsiz: "bg-zinc-500",
};

export default function KararIstatistikPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS);

  useEffect(() => {
    fetch("/api/karar/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStats(d))
      .catch(() => {});
  }, []);

  const totalSonuc = Object.values(stats.bySonuc).reduce((a, b) => a + b, 0);
  const maxDaire   = Math.max(...(stats.topDaire?.map(d => d.sayi) ?? [1]));

  return (
    <div className="max-w-5xl space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <Link href="/karar-arama" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Aramaya Dön
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Karar İstatistikleri
          </h1>
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Database,   label: "Toplam Karar",    value: (stats.total ?? 0).toLocaleString("tr"), sub: "Veritabanında" },
          { icon: Scale,      label: "Yargıtay",        value: (stats.byKaynak?.yargitay ?? 0).toLocaleString("tr"), sub: "karararama.yargitay.gov.tr" },
          { icon: FileSearch, label: "Emsal",           value: (stats.byKaynak?.emsal ?? 0).toLocaleString("tr"), sub: "BAM + Yerel Mahkeme" },
          { icon: TrendingUp, label: "Bozma",           value: (stats.bySonuc?.Bozma ?? 0).toLocaleString("tr"), sub: "Tespit edilen" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
            <p className="text-white text-2xl font-bold">{value}</p>
            <p className="text-zinc-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Sonuç dağılımı */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Sonuç Dağılımı</h2>
          {totalSonuc === 0 ? (
            <p className="text-zinc-600 text-sm">Henüz tam metin verisi yok. Scraper&apos;ı <code className="bg-zinc-800 px-1 rounded">--no-details</code> olmadan çalıştırın.</p>
          ) : (
            Object.entries(stats.bySonuc).map(([sonuc, sayi]) => (
              <div key={sonuc} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">{sonuc}</span>
                  <span className="text-zinc-400">{sayi} <span className="text-zinc-600">({Math.round(sayi / totalSonuc * 100)}%)</span></span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${SONUC_COLORS[sonuc] ?? "bg-zinc-500"}`}
                    style={{ width: `${(sayi / totalSonuc) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Kaynak dağılımı */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Kaynak Dağılımı</h2>
          {Object.entries(stats.byKaynak).map(([kaynak, sayi]) => {
            const total = Object.values(stats.byKaynak).reduce((a, b) => a + b, 0);
            return (
              <div key={kaynak} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300 capitalize">{kaynak === "yargitay" ? "Yargıtay" : "Emsal"}</span>
                  <span className="text-zinc-400">{sayi.toLocaleString("tr")}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${kaynak === "yargitay" ? "bg-indigo-500" : "bg-violet-500"}`}
                    style={{ width: `${(sayi / total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* En aktif daireler */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          En Aktif 10 Daire
        </h2>
        <div className="space-y-2">
          {stats.topDaire?.map(({ daire, sayi }) => (
            <div key={daire} className="flex items-center gap-3">
              <div className="w-48 shrink-0 text-zinc-300 text-sm truncate">{daire}</div>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500/70 rounded-full"
                  style={{ width: `${(sayi / maxDaire) * 100}%` }}
                />
              </div>
              <span className="text-zinc-400 text-sm w-10 text-right shrink-0">{sayi.toLocaleString("tr")}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
