"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, CheckCircle2, Clock, Edit2, Play, Copy, Share2 } from "lucide-react";

export default function TestDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tests" className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Yazılım Geliştirici - Temel Seviye</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Aktif</span>
            <span className="text-xs text-zinc-500">Teknoloji / Yazılım</span>
            <span className="text-xs text-zinc-500">• Oluşturulma: 12 Mar 2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Toplam Aday", value: "48", icon: Users },
          { label: "Tamamlanma", value: "%85", icon: CheckCircle2 },
          { label: "Ort. Süre", value: "24 dk", icon: Clock },
          { label: "Ort. Başarı", value: "%72", icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
              <stat.icon className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Share2 className="w-4 h-4" /> Aday Davet Et
        </button>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Copy className="w-4 h-4" /> Bağlantıyı Kopyala
        </button>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Play className="w-4 h-4" /> Testi Önizle
        </button>
        <Link
          href={`/tests/${id}/edit`}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ml-auto"
        >
          <Edit2 className="w-4 h-4" /> Düzenle
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Davet Edilen Adaylar</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Aday Adı</th>
              <th className="px-6 py-3 font-medium">Davet Tarihi</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium">Skor</th>
              <th className="px-6 py-3 font-medium text-right">Rapor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {[
              { ad: "Ali Veli",    tarih: "14 Mar 2026", durum: "Tamamlandı", skor: "%88", resultId: "a1" },
              { ad: "Ayşe Yılmaz", tarih: "14 Mar 2026", durum: "Tamamlandı", skor: "%92", resultId: "a2" },
              { ad: "Can Kaya",    tarih: "13 Mar 2026", durum: "Bekliyor",   skor: "-",   resultId: null },
            ].map((aday, i) => (
              <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{aday.ad}</td>
                <td className="px-6 py-4">{aday.tarih}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${aday.durum === "Tamamlandı" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {aday.durum}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{aday.skor}</td>
                <td className="px-6 py-4 text-right">
                  {aday.resultId && (
                    <Link href={`/results/${aday.resultId}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                      İncele
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
