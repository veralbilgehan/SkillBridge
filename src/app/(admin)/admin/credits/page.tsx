"use client";

import { Search, Plus, Coins, ShieldCheck } from "lucide-react";

export default function CreditsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kontör Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Paketleri düzenleyin ve şirketlere/kullanıcılara manuel bakiye atayın.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Bakiye Yükle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Aktif Paketler</h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">Düzenle</button>
          </div>
          <div className="space-y-3">
            {[
              { ad: "Başlangıç", kontor: 100, fiyat: "₺99" },
              { ad: "Standart", kontor: 300, fiyat: "₺249" },
              { ad: "Profesyonel", kontor: 750, fiyat: "₺499" },
              { ad: "Kurumsal", kontor: 2000, fiyat: "₺999" }
            ].map(p => (
              <div key={p.ad} className="flex justify-between items-center bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{p.ad}</p>
                    <p className="text-xs text-zinc-500">{p.kontor} kontör</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">{p.fiyat}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Son Yüklemeler</h2>
          <div className="space-y-4">
            {[
              { hedefo: "TechNova Ltd.", islem: "Manuel Yükleme (Admin)", miktar: "+500", tarih: "12 Mar 2026, 14:30" },
              { hedefo: "FinansBank", islem: "Kurumsal Paket Satın Alımı", miktar: "+2000", tarih: "10 Mar 2026, 09:15" },
              { hedefo: "Alper Yılmaz", islem: "Başlangıç Paket Satın Alımı", miktar: "+100", tarih: "08 Mar 2026, 18:45" },
            ].map((islem, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 border-b border-zinc-800 pb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-white">{islem.hedefo}</p>
                    <p className="text-sm font-bold text-emerald-400">{islem.miktar}</p>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{islem.islem}</p>
                  <p className="text-xs text-zinc-500 mt-1">{islem.tarih}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
