"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Check, Coins } from "lucide-react";

interface Sirket {
  id: number;
  ad: string;
  sektor: string;
  kullanici: number;
  kontor: number;
  durum: "Aktif" | "Pasif";
  email: string;
}

const INITIAL: Sirket[] = [
  { id: 1, ad: "TechNova Ltd.", sektor: "Yazılım", kullanici: 12, kontor: 450, durum: "Aktif", email: "info@technova.com" },
  { id: 2, ad: "Global Lojistik", sektor: "Lojistik", kullanici: 4, kontor: 120, durum: "Aktif", email: "info@global.com" },
  { id: 3, ad: "FinansBank", sektor: "Finans", kullanici: 45, kontor: 2100, durum: "Aktif", email: "info@finansbank.com" },
  { id: 4, ad: "Akıllı Ev A.Ş.", sektor: "Elektronik", kullanici: 8, kontor: 0, durum: "Pasif", email: "info@akilliev.com" },
];

const BOSH: Omit<Sirket, "id"> = { ad: "", sektor: "", kullanici: 0, kontor: 0, durum: "Aktif", email: "" };

export default function CompaniesPage() {
  const [sirketler, setSirketler] = useState<Sirket[]>(INITIAL);
  const [arama, setArama] = useState("");
  const [modal, setModal] = useState<"ekle" | "duzenle" | "sil" | "kontor" | null>(null);
  const [secili, setSecili] = useState<Sirket | null>(null);
  const [form, setForm] = useState<Omit<Sirket, "id">>(BOSH);
  const [kontorMiktar, setKontorMiktar] = useState("");

  const filtreli = sirketler.filter(
    (s) =>
      s.ad.toLowerCase().includes(arama.toLowerCase()) ||
      s.sektor.toLowerCase().includes(arama.toLowerCase())
  );

  function ac(tip: typeof modal, sirket?: Sirket) {
    setSecili(sirket ?? null);
    setForm(sirket ? { ad: sirket.ad, sektor: sirket.sektor, kullanici: sirket.kullanici, kontor: sirket.kontor, durum: sirket.durum, email: sirket.email } : BOSH);
    setKontorMiktar("");
    setModal(tip);
  }

  function kaydet() {
    if (!form.ad.trim()) return;
    if (modal === "ekle") {
      setSirketler((p) => [...p, { ...form, id: Date.now() }]);
    } else if (modal === "duzenle" && secili) {
      setSirketler((p) => p.map((s) => (s.id === secili.id ? { ...secili, ...form } : s)));
    }
    setModal(null);
  }

  function sil() {
    if (!secili) return;
    setSirketler((p) => p.filter((s) => s.id !== secili.id));
    setModal(null);
  }

  function kontorYukle() {
    const miktar = parseInt(kontorMiktar);
    if (!secili || isNaN(miktar) || miktar <= 0) return;
    setSirketler((p) =>
      p.map((s) => (s.id === secili.id ? { ...s, kontor: s.kontor + miktar } : s))
    );
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Şirket Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Platformdaki tüm kurumsal müşterileri yönetin.</p>
        </div>
        <button
          onClick={() => ac("ekle")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Şirket
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Şirket ara..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-sm text-zinc-400">Toplam: {filtreli.length}</span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Şirket Adı</th>
              <th className="px-6 py-3 font-medium">Sektör</th>
              <th className="px-6 py-3 font-medium">Kullanıcılar</th>
              <th className="px-6 py-3 font-medium">Kontör</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtreli.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{s.ad}</td>
                <td className="px-6 py-4">{s.sektor}</td>
                <td className="px-6 py-4">{s.kullanici}</td>
                <td className="px-6 py-4 text-indigo-400 font-medium">{s.kontor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.durum === "Aktif" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {s.durum}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => ac("kontor", s)} title="Kontör Yükle" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-indigo-400 transition-colors">
                      <Coins className="w-4 h-4" />
                    </button>
                    <button onClick={() => ac("duzenle", s)} title="Düzenle" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => ac("sil", s)} title="Sil" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ekle / Düzenle Modal */}
      {(modal === "ekle" || modal === "duzenle") && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{modal === "ekle" ? "Yeni Şirket Ekle" : "Şirketi Düzenle"}</h2>
              <button onClick={() => setModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Şirket Adı", key: "ad", type: "text" },
                { label: "E-posta", key: "email", type: "email" },
                { label: "Sektör", key: "sektor", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-xs text-zinc-400 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Durum</label>
                <select
                  value={form.durum}
                  onChange={(e) => setForm((p) => ({ ...p, durum: e.target.value as "Aktif" | "Pasif" }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={kaydet} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kontör Yükle Modal */}
      {modal === "kontor" && secili && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Kontör Yükle</h2>
              <button onClick={() => setModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <p className="text-sm text-zinc-400"><span className="text-white font-medium">{secili.ad}</span> — Mevcut bakiye: <span className="text-indigo-400 font-medium">{secili.kontor} kontör</span></p>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Yüklenecek Kontör Miktarı</label>
              <input
                type="number"
                min={1}
                value={kontorMiktar}
                onChange={(e) => setKontorMiktar(e.target.value)}
                placeholder="Örn: 500"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={kontorYukle} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Coins className="w-4 h-4" /> Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sil Onay Modal */}
      {modal === "sil" && secili && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Şirketi Sil</h2>
              <button onClick={() => setModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <p className="text-sm text-zinc-400"><span className="text-white font-medium">{secili.ad}</span> adlı şirketi kalıcı olarak silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={sil} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
