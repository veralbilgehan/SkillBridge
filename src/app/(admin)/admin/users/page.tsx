"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Check, Shield, Coins } from "lucide-react";

type Rol = "Şirket Admini" | "Çalışan" | "Bireysel" | "Super Admin";

interface Kullanici {
  id: number;
  ad: string;
  email: string;
  rol: Rol;
  sirket: string;
  kontor: number;
  durum: "Aktif" | "Pasif";
}

const INITIAL: Kullanici[] = [
  { id: 1, ad: "Alper Yılmaz", email: "alper@technova.com", rol: "Şirket Admini", sirket: "TechNova Ltd.", kontor: 200, durum: "Aktif" },
  { id: 2, ad: "Selin Kaya", email: "selin@global.com", rol: "Çalışan", sirket: "Global Lojistik", kontor: 50, durum: "Aktif" },
  { id: 3, ad: "Mehmet Demir", email: "m.demir@example.com", rol: "Bireysel", sirket: "-", kontor: 100, durum: "Aktif" },
  { id: 4, ad: "Zeynep Çelik", email: "zeynep@finansbank.com", rol: "Şirket Admini", sirket: "FinansBank", kontor: 350, durum: "Aktif" },
  { id: 5, ad: "Bilgehan Veral", email: "bilgehanveral@gmail.com", rol: "Super Admin", sirket: "-", kontor: 9999, durum: "Aktif" },
];

const BOSH: Omit<Kullanici, "id"> = { ad: "", email: "", rol: "Çalışan", sirket: "", kontor: 0, durum: "Aktif" };
const ROLLER: Rol[] = ["Super Admin", "Şirket Admini", "Çalışan", "Bireysel"];

export default function UsersPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>(INITIAL);
  const [arama, setArama] = useState("");
  const [modal, setModal] = useState<"ekle" | "duzenle" | "sil" | "kontor" | null>(null);
  const [secili, setSecili] = useState<Kullanici | null>(null);
  const [form, setForm] = useState<Omit<Kullanici, "id">>(BOSH);
  const [kontorMiktar, setKontorMiktar] = useState("");

  const filtreli = kullanicilar.filter(
    (k) =>
      k.ad.toLowerCase().includes(arama.toLowerCase()) ||
      k.email.toLowerCase().includes(arama.toLowerCase()) ||
      k.sirket.toLowerCase().includes(arama.toLowerCase())
  );

  function ac(tip: typeof modal, k?: Kullanici) {
    setSecili(k ?? null);
    setForm(k ? { ad: k.ad, email: k.email, rol: k.rol, sirket: k.sirket, kontor: k.kontor, durum: k.durum } : BOSH);
    setKontorMiktar("");
    setModal(tip);
  }

  function kaydet() {
    if (!form.ad.trim() || !form.email.trim()) return;
    if (modal === "ekle") {
      setKullanicilar((p) => [...p, { ...form, id: Date.now() }]);
    } else if (modal === "duzenle" && secili) {
      setKullanicilar((p) => p.map((k) => (k.id === secili.id ? { ...secili, ...form } : k)));
    }
    setModal(null);
  }

  function sil() {
    if (!secili) return;
    setKullanicilar((p) => p.filter((k) => k.id !== secili.id));
    setModal(null);
  }

  function kontorYukle() {
    const miktar = parseInt(kontorMiktar);
    if (!secili || isNaN(miktar) || miktar <= 0) return;
    setKullanicilar((p) =>
      p.map((k) => (k.id === secili.id ? { ...k, kontor: k.kontor + miktar } : k))
    );
    setModal(null);
  }

  const rolRenk: Record<Rol, string> = {
    "Super Admin": "bg-red-500/10 text-red-400",
    "Şirket Admini": "bg-indigo-500/10 text-indigo-400",
    "Çalışan": "bg-zinc-800 text-zinc-400",
    "Bireysel": "bg-zinc-800 text-zinc-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Platformdaki bireysel ve kurumsal kullanıcıları yönetin.</p>
        </div>
        <button
          onClick={() => ac("ekle")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Kullanıcı Ekle
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="İsim, e-posta veya şirket ara..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-sm text-zinc-400">Toplam: {filtreli.length}</span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Kullanıcı</th>
              <th className="px-6 py-3 font-medium">Rol</th>
              <th className="px-6 py-3 font-medium">Şirket</th>
              <th className="px-6 py-3 font-medium">Kontör</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtreli.map((k) => (
              <tr key={k.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{k.ad}</p>
                  <p className="text-xs text-zinc-500">{k.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium ${rolRenk[k.rol]}`}>
                    {(k.rol === "Şirket Admini" || k.rol === "Super Admin") && <Shield className="w-3 h-3" />}
                    {k.rol}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">{k.sirket}</td>
                <td className="px-6 py-4 text-indigo-400 font-medium">{k.kontor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${k.durum === "Aktif" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {k.durum}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => ac("kontor", k)} title="Kontör Yükle" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-indigo-400 transition-colors">
                      <Coins className="w-4 h-4" />
                    </button>
                    <button onClick={() => ac("duzenle", k)} title="Düzenle" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => ac("sil", k)} title="Sil" className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors">
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
              <h2 className="text-white font-semibold">{modal === "ekle" ? "Kullanıcı Ekle" : "Kullanıcıyı Düzenle"}</h2>
              <button onClick={() => setModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Ad Soyad", key: "ad", type: "text" },
                { label: "E-posta", key: "email", type: "email" },
                { label: "Şirket", key: "sirket", type: "text" },
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Rol</label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value as Rol }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {ROLLER.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
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
            <p className="text-sm text-zinc-400"><span className="text-white font-medium">{secili.ad}</span> — Mevcut: <span className="text-indigo-400 font-medium">{secili.kontor} kontör</span></p>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Eklenecek Miktar</label>
              <input
                type="number"
                min={1}
                value={kontorMiktar}
                onChange={(e) => setKontorMiktar(e.target.value)}
                placeholder="Örn: 100"
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
              <h2 className="text-white font-semibold">Kullanıcıyı Sil</h2>
              <button onClick={() => setModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <p className="text-sm text-zinc-400"><span className="text-white font-medium">{secili.ad}</span> kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?</p>
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
