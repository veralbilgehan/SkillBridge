"use client";

import { useState } from "react";
import { Plus, Coins, ShieldCheck, Pencil, Trash2, X, Check } from "lucide-react";

interface Paket {
  id: number;
  ad: string;
  kontor: number;
  fiyat: number;
}

interface Yukleme {
  id: number;
  hedef: string;
  islem: string;
  miktar: number;
  tarih: string;
}

const INIT_PAKET: Paket[] = [
  { id: 1, ad: "Başlangıç", kontor: 100, fiyat: 99 },
  { id: 2, ad: "Standart", kontor: 300, fiyat: 249 },
  { id: 3, ad: "Profesyonel", kontor: 750, fiyat: 499 },
  { id: 4, ad: "Kurumsal", kontor: 2000, fiyat: 999 },
];

const INIT_YUKLEMELER: Yukleme[] = [
  { id: 1, hedef: "TechNova Ltd.", islem: "Manuel Yükleme (Admin)", miktar: 500, tarih: "12 Mar 2026, 14:30" },
  { id: 2, hedef: "FinansBank", islem: "Kurumsal Paket Satın Alımı", miktar: 2000, tarih: "10 Mar 2026, 09:15" },
  { id: 3, hedef: "Alper Yılmaz", islem: "Başlangıç Paket Satın Alımı", miktar: 100, tarih: "08 Mar 2026, 18:45" },
];

const BOSH_PAKET: Omit<Paket, "id"> = { ad: "", kontor: 0, fiyat: 0 };

export default function CreditsPage() {
  const [paketler, setPaketler] = useState<Paket[]>(INIT_PAKET);
  const [yuklemeler, setYuklemeler] = useState<Yukleme[]>(INIT_YUKLEMELER);

  const [paketModal, setPaketModal] = useState<"ekle" | "duzenle" | "sil" | null>(null);
  const [seciliPaket, setSeciliPaket] = useState<Paket | null>(null);
  const [paketForm, setPaketForm] = useState<Omit<Paket, "id">>(BOSH_PAKET);

  const [yukleModal, setYukleModal] = useState(false);
  const [yukleHedef, setYukleHedef] = useState("");
  const [yukleMiktar, setYukleMiktar] = useState("");

  function paketAc(tip: typeof paketModal, p?: Paket) {
    setSeciliPaket(p ?? null);
    setPaketForm(p ? { ad: p.ad, kontor: p.kontor, fiyat: p.fiyat } : BOSH_PAKET);
    setPaketModal(tip);
  }

  function paketKaydet() {
    if (!paketForm.ad.trim()) return;
    if (paketModal === "ekle") {
      setPaketler((prev) => [...prev, { ...paketForm, id: Date.now() }]);
    } else if (paketModal === "duzenle" && seciliPaket) {
      setPaketler((prev) => prev.map((p) => (p.id === seciliPaket.id ? { ...seciliPaket, ...paketForm } : p)));
    }
    setPaketModal(null);
  }

  function paketSil() {
    if (!seciliPaket) return;
    setPaketler((prev) => prev.filter((p) => p.id !== seciliPaket.id));
    setPaketModal(null);
  }

  function manuelYukle() {
    const miktar = parseInt(yukleMiktar);
    if (!yukleHedef.trim() || isNaN(miktar) || miktar <= 0) return;
    const now = new Date().toLocaleString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setYuklemeler((prev) => [{ id: Date.now(), hedef: yukleHedef, islem: "Manuel Yükleme (Admin)", miktar, tarih: now }, ...prev]);
    setYukleHedef("");
    setYukleMiktar("");
    setYukleModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kontör Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Paketleri düzenleyin ve şirketlere/kullanıcılara manuel bakiye atayın.</p>
        </div>
        <button
          onClick={() => setYukleModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Bakiye Yükle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paketler */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Aktif Paketler</h2>
            <button onClick={() => paketAc("ekle")} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Paket Ekle
            </button>
          </div>
          <div className="space-y-3">
            {paketler.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{p.ad}</p>
                    <p className="text-xs text-zinc-500">{p.kontor} kontör</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">₺{p.fiyat}</span>
                  <div className="flex gap-1">
                    <button onClick={() => paketAc("duzenle", p)} className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => paketAc("sil", p)} className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son Yüklemeler */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Son Yüklemeler</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {yuklemeler.map((y) => (
              <div key={y.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 border-b border-zinc-800 pb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-white">{y.hedef}</p>
                    <p className="text-sm font-bold text-emerald-400">+{y.miktar}</p>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{y.islem}</p>
                  <p className="text-xs text-zinc-500 mt-1">{y.tarih}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manuel Bakiye Yükle Modal */}
      {yukleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Manuel Bakiye Yükle</h2>
              <button onClick={() => setYukleModal(false)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Hedef (Şirket veya Kullanıcı Adı)</label>
                <input
                  type="text"
                  value={yukleHedef}
                  onChange={(e) => setYukleHedef(e.target.value)}
                  placeholder="Örn: TechNova Ltd."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Kontör Miktarı</label>
                <input
                  type="number"
                  min={1}
                  value={yukleMiktar}
                  onChange={(e) => setYukleMiktar(e.target.value)}
                  placeholder="Örn: 500"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setYukleModal(false)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={manuelYukle} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Coins className="w-4 h-4" /> Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paket Ekle / Düzenle Modal */}
      {(paketModal === "ekle" || paketModal === "duzenle") && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{paketModal === "ekle" ? "Paket Ekle" : "Paketi Düzenle"}</h2>
              <button onClick={() => setPaketModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Paket Adı</label>
                <input
                  type="text"
                  value={paketForm.ad}
                  onChange={(e) => setPaketForm((p) => ({ ...p, ad: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Kontör Miktarı</label>
                  <input
                    type="number"
                    min={1}
                    value={paketForm.kontor}
                    onChange={(e) => setPaketForm((p) => ({ ...p, kontor: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Fiyat (₺)</label>
                  <input
                    type="number"
                    min={0}
                    value={paketForm.fiyat}
                    onChange={(e) => setPaketForm((p) => ({ ...p, fiyat: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPaketModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={paketKaydet} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paket Sil Modal */}
      {paketModal === "sil" && seciliPaket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Paketi Sil</h2>
              <button onClick={() => setPaketModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <p className="text-sm text-zinc-400"><span className="text-white font-medium">{seciliPaket.ad}</span> paketini silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPaketModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={paketSil} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
