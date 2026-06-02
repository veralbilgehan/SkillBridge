"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Scale, TrendingUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Karar = {
  id: number;
  karar_id: string;
  kaynak: string;
  daire: string;
  esas_no: string;
  karar_no: string;
  karar_tarihi: string;
  durum: string;
  sonuc: string;
  aranan_kelime: string;
  text_len: number;
};

type SearchResult = {
  data: Karar[];
  total: number;
  page: number;
  limit: number;
};

// ── Mock data (Supabase bağlanana kadar) ──────────────────────────────────────
const MOCK: SearchResult = {
  total: 516105,
  page: 1,
  limit: 20,
  data: [
    { id: 1, karar_id: "413805800", kaynak: "yargitay", daire: "18. Ceza Dairesi", esas_no: "2016/6000", karar_no: "2018/3079", karar_tarihi: "07.03.2018", durum: "", sonuc: "Onama", aranan_kelime: "haksız tahrik", text_len: 4030 },
    { id: 2, karar_id: "89274400",  kaynak: "yargitay", daire: "Ceza Genel Kurulu", esas_no: "2013/441", karar_no: "2014/123", karar_tarihi: "11.03.2014", durum: "", sonuc: "Bozma", aranan_kelime: "haksız tahrik", text_len: 15254 },
    { id: 3, karar_id: "920541700", kaynak: "yargitay", daire: "Ceza Genel Kurulu", esas_no: "2021/179", karar_no: "2023/229", karar_tarihi: "25.04.2023", durum: "", sonuc: "Bozma", aranan_kelime: "haksız tahrik", text_len: 9280 },
    { id: 4, karar_id: "1188757600", kaynak: "emsal", daire: "İstanbul Bölge Adliye Mahkemesi 45. Hukuk Dairesi", esas_no: "2022/218", karar_no: "2026/58", karar_tarihi: "14.01.2026", durum: "KESİNLEŞTİ", sonuc: "", aranan_kelime: "işçilik alacakları", text_len: 0 },
    { id: 5, karar_id: "1168683900", kaynak: "emsal", daire: "Ankara 13. Asliye Ticaret Mahkemesi", esas_no: "2023/566", karar_no: "2024/987", karar_tarihi: "25.12.2024", durum: "KESİNLEŞTİ", sonuc: "", aranan_kelime: "işçilik alacakları", text_len: 0 },
    { id: 6, karar_id: "434177300", kaynak: "yargitay", daire: "18. Ceza Dairesi", esas_no: "2016/9638", karar_no: "2018/6863", karar_tarihi: "12.04.2018", durum: "", sonuc: "Onama", aranan_kelime: "haksız tahrik", text_len: 3800 },
    { id: 7, karar_id: "1162195700", kaynak: "yargitay", daire: "1. Ceza Dairesi", esas_no: "2025/1857", karar_no: "2025/5064", karar_tarihi: "18.03.2025", durum: "", sonuc: "Bozma", aranan_kelime: "haksız tahrik", text_len: 7420 },
  ],
};

const SONUC_BADGE: Record<string, string> = {
  Bozma:    "bg-red-500/15 text-red-400 border border-red-500/30",
  Onama:    "bg-green-500/15 text-green-400 border border-green-500/30",
  Red:      "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Belirsiz: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
};

const KAYNAK_BADGE: Record<string, string> = {
  yargitay: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  emsal:    "bg-violet-500/15 text-violet-400 border border-violet-500/30",
};

export default function KararAramaPage() {
  const [query,   setQuery]   = useState("");
  const [kaynak,  setKaynak]  = useState("");
  const [sonuc,   setSonuc]   = useState("");
  const [results, setResults] = useState<SearchResult>(MOCK);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(1);

  const search = useCallback(async (q: string, k: string, s: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (q) params.set("q", q);
      if (k) params.set("kaynak", k);
      if (s) params.set("sonuc", s);
      const res = await fetch(`/api/karar?${params}`);
      if (res.ok) setResults(await res.json());
    } catch {
      // Supabase henüz bağlı değilse mock veri göster
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); search(query, kaynak, sonuc, 1); }, 400);
    return () => clearTimeout(t);
  }, [query, kaynak, sonuc, search]);

  useEffect(() => { search(query, kaynak, sonuc, page); }, [page]);// eslint-disable-line

  const totalPages = Math.ceil((results.total ?? 0) / results.limit);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-400" />
            Karar Arama
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            emsal.uyap.gov.tr &amp; karararama.yargitay.gov.tr
          </p>
        </div>
        <Link
          href="/karar-arama/istatistik"
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          İstatistikler
        </Link>
      </div>

      {/* Arama + Filtreler */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Anahtar kelime, daire veya esas no..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-zinc-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs">Filtrele:</span>
          </div>
          <select
            value={kaynak}
            onChange={e => setKaynak(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Tüm Kaynaklar</option>
            <option value="yargitay">Yargıtay</option>
            <option value="emsal">Emsal (BAM + Yerel)</option>
          </select>
          <select
            value={sonuc}
            onChange={e => setSonuc(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Tüm Sonuçlar</option>
            <option value="Bozma">Bozma</option>
            <option value="Onama">Onama</option>
            <option value="Red">Red</option>
          </select>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <span>
          {loading ? "Aranıyor..." : (
            <><span className="text-white font-medium">{(results.total ?? 0).toLocaleString("tr")}</span> karar bulundu</>
          )}
        </span>
        {totalPages > 1 && (
          <span>Sayfa {page} / {totalPages.toLocaleString("tr")}</span>
        )}
      </div>

      {/* Sonuç listesi */}
      <div className="space-y-2">
        {results.data?.map(karar => (
          <Link
            key={`${karar.karar_id}-${karar.kaynak}`}
            href={`/karar-arama/${karar.karar_id}__${karar.kaynak}`}
            className="block bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", KAYNAK_BADGE[karar.kaynak] ?? "bg-zinc-700 text-zinc-300")}>
                    {karar.kaynak === "yargitay" ? "Yargıtay" : "Emsal"}
                  </span>
                  {karar.sonuc && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", SONUC_BADGE[karar.sonuc] ?? "bg-zinc-700 text-zinc-300")}>
                      {karar.sonuc}
                    </span>
                  )}
                  {karar.durum === "KESİNLEŞTİ" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-400">
                      Kesinleşti
                    </span>
                  )}
                  {karar.text_len > 0 && (
                    <span className="text-xs text-zinc-600">
                      {Math.round(karar.text_len / 1000)}K karakter
                    </span>
                  )}
                </div>
                <p className="text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">
                  {karar.daire}
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  {karar.esas_no} E. — {karar.karar_no} K.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-zinc-400 text-xs">{karar.karar_tarihi}</p>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 mt-2 ml-auto transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Önceki
          </button>
          <span className="text-zinc-500 text-sm px-2">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
