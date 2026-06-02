"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Scale, Calendar, Hash, Building2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type KararDetay = {
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
  anon_text: string | null;
};

// Mock detay (Supabase bağlanana kadar)
const MOCK_DETAY: KararDetay = {
  karar_id: "89274400",
  kaynak: "yargitay",
  daire: "Ceza Genel Kurulu",
  esas_no: "2013/441",
  karar_no: "2014/123",
  karar_tarihi: "11.03.2014",
  durum: "",
  sonuc: "Bozma",
  aranan_kelime: "haksız tahrik",
  text_len: 15254,
  anon_text: `Ceza Genel Kurulu         2013/441 E.  ,  2014/123 K.
OLASI KASTLA ADAM ÖLDÜRME
TÜRK CEZA KANUNU (TCK) (5237) Madde 21, 29, 53, 62, 63

KARAR
Yerel Mahkemece verilen hüküm temyiz edilmekle, Yargıtay Cumhuriyet Başsavcılığının "bozma"
istekli tebliğnamesi ile Yargıtay Birinci Başkanlığına gönderilen dosya, Ceza Genel Kurulunca
değerlendirilmiş ve açıklanan gerekçelerle BOZULMASINA karar verilmiştir.

Sanık hakkında haksız tahrik hükümlerinin uygulanması gerektiği, yerel mahkeme kararının bu
yönüyle hukuka aykırı olduğu sonucuna varılmıştır.

SONUÇ: Yerel Mahkeme kararının BOZULMASINA, oybirliğiyle karar verildi.`,
};

const SONUC_COLORS: Record<string, string> = {
  Bozma:    "text-red-400 bg-red-500/10 border-red-500/30",
  Onama:    "text-green-400 bg-green-500/10 border-green-500/30",
  Red:      "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Belirsiz: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
};

export default function KararDetayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [karar, setKarar] = useState<KararDetay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/karar/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setKarar(data || MOCK_DETAY))
      .catch(() => setKarar(MOCK_DETAY))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!karar) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-zinc-400">
      <AlertCircle className="w-8 h-8" />
      <p>Karar bulunamadı</p>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">

      {/* Geri butonu */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Arama Sonuçlarına Dön
      </button>

      {/* Başlık kartı */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/15 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{karar.daire}</h1>
              <p className="text-zinc-500 text-sm">
                {karar.kaynak === "yargitay" ? "Yargıtay" : "Emsal (BAM / Yerel)"}
              </p>
            </div>
          </div>
          {karar.sonuc && (
            <span className={cn("text-sm px-3 py-1 rounded-lg font-semibold border", SONUC_COLORS[karar.sonuc])}>
              {karar.sonuc}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Hash,      label: "Esas No",       value: karar.esas_no },
            { icon: Hash,      label: "Karar No",      value: karar.karar_no },
            { icon: Calendar,  label: "Tarih",         value: karar.karar_tarihi },
            { icon: Building2, label: "Durum",         value: karar.durum || "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1">
                <Icon className="w-3 h-3" />
                {label}
              </div>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {karar.aranan_kelime && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Arama terimi:</span>
            <span className="bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
              {karar.aranan_kelime}
            </span>
          </div>
        )}
      </div>

      {/* Karar metni */}
      {karar.anon_text ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <FileText className="w-4 h-4" />
            <span>Karar Metni</span>
            <span className="text-zinc-600">({Math.round(karar.text_len / 1000)}K karakter — anonimleştirilmiş)</span>
          </div>
          <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600">
            {karar.anon_text}
          </pre>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-8 text-center">
          <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm">Tam metin henüz çekilmedi.</p>
          <p className="text-zinc-600 text-xs mt-1">
            Scraper&apos;ı <code className="bg-zinc-800 px-1 rounded">--no-details</code> olmadan çalıştırınca metin burada görünür.
          </p>
        </div>
      )}
    </div>
  );
}
