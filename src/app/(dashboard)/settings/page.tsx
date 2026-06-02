"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Plus, CheckCircle2, Info, CreditCard, Lock } from "lucide-react";

// Mock — gerçekte auth context'ten gelecek
const mockUser = {
  role: "individual" as "corporate" | "individual" | "admin",
  company: null as { name: string; sector: string; employeeCount: number } | null,
};

// ─── PRD §10.1 — Kontör Fiyat Tablosu ────────────────────────────────────────

const KONTOR_FIYATLARI = [
  { islem: "Yeni Üyelik Hediyesi",             bedel: "+50",  aciklama: "Üye olan herkese başlangıçta tanımlanır", tip: "gelir" },
  { islem: "Hazır Test Çözümü",                bedel: "1",    aciklama: "Soru başına 1 kontör (10 soruluk test = 10 kontör)", tip: "gider" },
  { islem: "AI Test Yorumlama / Analiz",        bedel: "10",   aciklama: "Çözülen testin Claude tarafından yorumlanması", tip: "gider" },
  { islem: "Sıfırdan Doküman / Test Oluşturma", bedel: "50",   aciklama: "AI ile yeni doküman ve test üretme", tip: "gider" },
  { islem: "Kendi Dokümanından Test Üretme",    bedel: "50",   aciklama: "Yüklenen belgeden test oluşturma", tip: "gider" },
  { islem: "Seviye Tespit Sınavı (Anında)",     bedel: "100",  aciklama: "JD bazlı anlık vaka testi üretme", tip: "gider" },
];

// ─── PRD §10.2 — Paketler ─────────────────────────────────────────────────────

const PAKETLER = [
  { ad: "Başlangıç",   kontor: 100,  fiyat: "₺99",   renk: "border-zinc-700",    vurgu: false },
  { ad: "Standart",    kontor: 300,  fiyat: "₺249",   renk: "border-zinc-700",    vurgu: false },
  { ad: "Profesyonel", kontor: 750,  fiyat: "₺499",   renk: "border-indigo-500",  vurgu: true },
  { ad: "Kurumsal",    kontor: 2000, fiyat: "₺999",   renk: "border-zinc-700",    vurgu: false },
];

// ─── Geçmiş ───────────────────────────────────────────────────────────────────

const MOCK_GECMIS = [
  { tarih: "2026-03-04", aciklama: "Seviye Tespit Sınavı — Operasyon Müdürü",       miktar: -100 },
  { tarih: "2026-03-03", aciklama: "AI Test Yorumlama — Tedarik Zinciri Krizi",     miktar: -10 },
  { tarih: "2026-03-02", aciklama: "Hazır Test Çözümü — 12 soru",                   miktar: -12 },
  { tarih: "2026-03-01", aciklama: "Kontör Yükleme — Profesyonel Paket",            miktar: +750 },
  { tarih: "2026-02-28", aciklama: "Sıfırdan Test Oluşturma — Analitik Düşünme",   miktar: -50 },
  { tarih: "2026-02-25", aciklama: "Kendi Dokümanından Test — İK El Kitabı",        miktar: -50 },
  { tarih: "2026-02-20", aciklama: "Hoş Geldiniz Bonusu",                           miktar: +50 },
];

// ─── Sekmeler ─────────────────────────────────────────────────────────────────

const BASE_TABS = [
  { id: "username", label: "Kullanıcı Adı" },
  { id: "password", label: "Şifre" },
  { id: "credits",  label: "Kontörler" },
] as const;

const COMPANY_TAB = { id: "company", label: "Bağlı Şirket" } as const;

type TabId = "username" | "password" | "credits" | "company";

export default function SettingsPage() {
  const hasCompany = !!mockUser.company;
  const tabs = hasCompany ? [...BASE_TABS, COMPANY_TAB] : [...BASE_TABS];

  const [active, setActive] = useState<TabId>("username");
  const [expanded, setExpanded] = useState(false);
  const [fiyatAcik, setFiyatAcik] = useState(false);

  const bakiye = MOCK_GECMIS.reduce((s, g) => s + g.miktar, 0);

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Hesap bilgilerinizi, şifrenizi ve kontörlerinizi yönetin.
        </p>
      </div>

      {/* Stacking Navbar */}
      <div
        className="flex items-center gap-x-2"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ x: -110 * index }}
            animate={{ x: expanded ? 0 : -110 * index }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.07 * index }}
            style={{ zIndex: 100 - index }}
          >
            <button
              onClick={() => setActive(tab.id as TabId)}
              className={`flex items-center text-sm px-5 py-3 rounded-3xl backdrop-blur-lg transition-colors duration-300 ease-in-out whitespace-nowrap border ${
                active === tab.id
                  ? "bg-indigo-500 text-white border-indigo-400"
                  : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">

        {/* ── Kullanıcı Adı ── */}
        {active === "username" && (
          <motion.div key="username" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-white font-semibold">Kullanıcı Bilgileri</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Ad, soyad ve e-posta adresinizi güncelleyin.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">Ad</label>
                <input type="text" placeholder="Adınız" className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">Soyad</label>
                <input type="text" placeholder="Soyadınız" className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-zinc-400 text-sm font-medium">E-posta</label>
                <input type="email" placeholder="ornek@sirket.com" className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">Kaydet</button>
            </div>
          </motion.div>
        )}

        {/* ── Şifre ── */}
        {active === "password" && (
          <motion.div key="password" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-white font-semibold">Şifre Değiştir</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Min. 8 karakter, en az 1 büyük harf ve 1 rakam.</p>
            </div>
            <div className="flex flex-col gap-4">
              {["Mevcut Şifre", "Yeni Şifre", "Yeni Şifre (Tekrar)"].map((label) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium">{label}</label>
                  <input type="password" placeholder="••••••••" className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">Şifreyi Güncelle</button>
            </div>
          </motion.div>
        )}

        {/* ── Kontörler ── */}
        {active === "credits" && (
          <motion.div key="credits" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">

            {/* Bakiye Kartı */}
            <div className={`bg-gradient-to-r ${bakiye === 0 ? "from-red-500/10 to-orange-500/5 border-red-500/25" : bakiye < 10 ? "from-yellow-500/10 to-orange-500/5 border-yellow-500/25" : "from-indigo-500/10 to-violet-500/5 border-indigo-500/25"} border rounded-2xl p-5 flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Coins className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-400 font-medium">Mevcut Bakiye</div>
                <div className="text-3xl font-bold text-white mt-0.5">{bakiye} <span className="text-base font-normal text-zinc-400">kontör</span></div>
              </div>
              {bakiye === 0 && <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/25 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1"><Lock className="w-3 h-3" />Hesap Kilitli</span>}
              {bakiye > 0 && bakiye < 10 && <span className="text-xs bg-yellow-400/15 text-yellow-400 border border-yellow-400/25 px-2.5 py-1 rounded-full shrink-0">Düşük Bakiye</span>}
            </div>

            {/* Kurallar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "Kontörü biten kullanıcı yalnızca Kontör Yükleme ekranını görebilir.",
                "Kontör 10'un altına düştüğünde e-posta bildirimi gönderilir.",
                "Kontör iadesi yapılmaz (AI üretimi başladıktan sonra).",
                "Kurumsal hesaplarda kontör şirket havuzundan düşülür.",
              ].map((kural) => (
                <div key={kural} className="flex items-start gap-1.5 text-zinc-500 bg-zinc-800/30 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" /> {kural}
                </div>
              ))}
            </div>

            {/* Fiyat Tablosu Accordion */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setFiyatAcik(!fiyatAcik)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-800/40 transition-colors"
              >
                <span className="text-sm font-semibold text-zinc-300">İşlem Başına Kontör Bedeli</span>
                <span className={`text-xs text-zinc-500 transition-transform ${fiyatAcik ? "rotate-180" : ""}`}>▼</span>
              </button>
              {fiyatAcik && (
                <table className="w-full text-sm border-t border-zinc-800">
                  <thead>
                    <tr className="text-xs text-zinc-500 border-b border-zinc-800">
                      <th className="text-left px-4 py-2.5 font-medium">İşlem</th>
                      <th className="text-center px-4 py-2.5 font-medium">Kontör</th>
                      <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KONTOR_FIYATLARI.map((f) => (
                      <tr key={f.islem} className="border-b border-zinc-800/60 last:border-b-0">
                        <td className="px-4 py-2.5 text-zinc-300 text-xs">{f.islem}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`text-sm font-bold ${f.tip === "gelir" ? "text-emerald-400" : "text-indigo-400"}`}>
                            {f.tip === "gelir" ? f.bedel : f.bedel}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-zinc-500 text-xs hidden sm:table-cell">{f.aciklama}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Paket Seçimi */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">Kontör Paketi Satın Al</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAKETLER.map((p) => (
                  <div key={p.ad} className={`relative bg-zinc-900 border-2 ${p.renk} rounded-xl p-4 flex flex-col gap-3 ${p.vurgu ? "ring-1 ring-indigo-500/30" : ""}`}>
                    {p.vurgu && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">Popüler</span>
                    )}
                    <div className="text-sm font-semibold text-zinc-200">{p.ad}</div>
                    <div>
                      <span className="text-2xl font-bold text-white">{p.kontor}</span>
                      <span className="text-xs text-zinc-500 ml-1">kontör</span>
                    </div>
                    <div className="text-base font-bold text-indigo-400">{p.fiyat}</div>
                    <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${p.vurgu ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>
                      <CreditCard className="w-3.5 h-3.5" /> Satın Al
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">Ödeme iyzico / Stripe ile güvenli kart ödemesi üzerinden gerçekleştirilir.</p>
            </div>

            {/* İşlem Geçmişi */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">İşlem Geçmişi</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500 border-b border-zinc-800">
                      <th className="text-left px-4 py-3 font-medium">Tarih</th>
                      <th className="text-left px-4 py-3 font-medium">İşlem</th>
                      <th className="text-right px-4 py-3 font-medium">Kontör</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_GECMIS.map((g, i) => (
                      <tr key={i} className="border-b border-zinc-800/60 last:border-b-0 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{g.tarih}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{g.aciklama}</td>
                        <td className={`px-4 py-3 text-right text-sm font-semibold ${g.miktar > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {g.miktar > 0 ? "+" : ""}{g.miktar}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-zinc-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-0.5" />
              Bakiyeniz 10 kontörün altına düştüğünde, 0&apos;a ulaştığında otomatik e-posta bildirimi alırsınız.
            </div>
          </motion.div>
        )}

        {/* ── Bağlı Şirket ── */}
        {active === "company" && hasCompany && (
          <motion.div key="company" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-white font-semibold">Bağlı Şirket</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Hesabınızın bağlı olduğu şirket bilgileri.</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                {mockUser.company!.name[0]}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{mockUser.company!.name}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{mockUser.company!.sector} · {mockUser.company!.employeeCount} çalışan</p>
              </div>
              <span className="ml-auto text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full">Aktif</span>
            </div>
            <p className="text-zinc-600 text-xs">Şirket bilgilerini değiştirmek için şirket adminiyle iletişime geçin.</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
