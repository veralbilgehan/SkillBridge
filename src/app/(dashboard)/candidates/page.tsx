"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Upload,
  Link2,
  Copy,
  Check,
  Bell,
  Webhook,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  MailOpen,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  QrCode,
  X,
  MessageCircle,
  Loader2,
  Phone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DavetDurum = "Gönderildi" | "Açıldı" | "Başlatıldı" | "Tamamlandı";

interface Aday {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  test: string;
  durum: DavetDurum;
  tarih: string;
}

interface Bildirim {
  id: string;
  tip: string;
  icerik: string;
  tarih: string;
  okundu: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface TestKatilim {
  testAdi: string;
  tarih: string;
  puan: number | null; // null = henüz tamamlanmadı
  durum: DavetDurum;
}

interface AdayPortfoy {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  departman: string;
  pozisyon: string;
  katilimlar: [TestKatilim, ...TestKatilim[]]; // en az 1
}

const MOCK_ADAYLAR_PORTFOY: AdayPortfoy[] = [
  {
    id: "a1", ad: "Ayşe", soyad: "Kaya", email: "ayse.kaya@example.com",
    departman: "Yazılım / Mühendislik", pozisyon: "Frontend Geliştirici",
    katilimlar: [
      { testAdi: "Yazılım Geliştirici Teknik Değerlendirme", tarih: "2026-02-10", puan: 62, durum: "Tamamlandı" },
      { testAdi: "Yazılım Geliştirici Teknik Değerlendirme", tarih: "2026-03-01", puan: 81, durum: "Tamamlandı" },
    ],
  },
  {
    id: "a2", ad: "Mehmet", soyad: "Demir", email: "mehmet.demir@example.com",
    departman: "Veri / Analitik / İş Zekası", pozisyon: "Veri Analisti",
    katilimlar: [
      { testAdi: "Analitik Düşünme Testi", tarih: "2026-03-02", puan: null, durum: "Başlatıldı" },
    ],
  },
  {
    id: "a3", ad: "Zeynep", soyad: "Arslan", email: "zeynep.arslan@example.com",
    departman: "Müşteri Hizmetleri", pozisyon: "Müşteri Deneyimi Uzmanı",
    katilimlar: [
      { testAdi: "İletişim Becerileri Değerlendirme", tarih: "2026-03-03", puan: null, durum: "Açıldı" },
    ],
  },
  {
    id: "a4", ad: "Burak", soyad: "Yıldız", email: "burak.yildiz@example.com",
    departman: "İcra Kurulu / Üst Yönetim", pozisyon: "Takım Lideri",
    katilimlar: [
      { testAdi: "Liderlik Yetkinlikleri Testi", tarih: "2026-03-04", puan: null, durum: "Gönderildi" },
    ],
  },
  {
    id: "a5", ad: "Selin", soyad: "Çelik", email: "selin.celik@example.com",
    departman: "Yazılım / Mühendislik", pozisyon: "Backend Geliştirici",
    katilimlar: [
      { testAdi: "Yazılım Geliştirici Teknik Değerlendirme", tarih: "2026-02-15", puan: 55, durum: "Tamamlandı" },
      { testAdi: "Yazılım Geliştirici Teknik Değerlendirme", tarih: "2026-03-05", puan: 74, durum: "Tamamlandı" },
    ],
  },
  {
    id: "a6", ad: "Can", soyad: "Öztürk", email: "can.ozturk@example.com",
    departman: "İnsan Kaynakları", pozisyon: "IK Uzmanı",
    katilimlar: [
      { testAdi: "Temel Yetkinlik Değerlendirmesi", tarih: "2026-03-10", puan: 88, durum: "Tamamlandı" },
    ],
  },
  {
    id: "a7", ad: "Deniz", soyad: "Şahin", email: "deniz.sahin@example.com",
    departman: "Satış", pozisyon: "Satış Temsilcisi",
    katilimlar: [
      { testAdi: "Müşteri Odaklılık Testi", tarih: "2026-01-20", puan: 58, durum: "Tamamlandı" },
      { testAdi: "Müşteri Odaklılık Testi", tarih: "2026-03-12", puan: 71, durum: "Tamamlandı" },
    ],
  },
  {
    id: "a8", ad: "Elif", soyad: "Aydın", email: "elif.aydin@example.com",
    departman: "Finans ve Muhasebe", pozisyon: "Finans Uzmanı",
    katilimlar: [
      { testAdi: "Sayısal Yetenek Testi", tarih: "2026-03-15", puan: null, durum: "Gönderildi" },
    ],
  },
];

// Geriye dönük uyumluluk için (bildirimler vs. hâlâ DavetDurum kullanıyor)
const MOCK_ADAYLAR: Aday[] = MOCK_ADAYLAR_PORTFOY.map((a) => ({
  id: a.id, ad: a.ad, soyad: a.soyad, email: a.email,
  test: a.katilimlar[a.katilimlar.length - 1].testAdi,
  durum: a.katilimlar[a.katilimlar.length - 1].durum,
  tarih: a.katilimlar[a.katilimlar.length - 1].tarih,
}));

const MOCK_BILDIRIMLER: Bildirim[] = [
  { id: "b1", tip: "Test Tamamlandı", icerik: "Ayşe Kaya 'Yazılım Geliştirici' testini tamamladı.", tarih: "5 dk önce", okundu: false },
  { id: "b2", tip: "Test Tamamlandı", icerik: "Selin Çelik 'Yazılım Geliştirici' testini tamamladı.", tarih: "2 saat önce", okundu: false },
  { id: "b3", tip: "Kontör Uyarısı", icerik: "Kontör bakiyeniz 10'un altına düştü. Lütfen yükleyin.", tarih: "Dün", okundu: true },
  { id: "b4", tip: "Davet Açıldı", icerik: "Zeynep Arslan davet e-postanızı açtı.", tarih: "Dün", okundu: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const durumConfig: Record<DavetDurum, { label: string; color: string; icon: React.ElementType }> = {
  Gönderildi: { label: "Davet Gönderildi", color: "text-zinc-400 bg-zinc-800", icon: Clock },
  Açıldı:    { label: "E-posta Açıldı",   color: "text-yellow-400 bg-yellow-400/10", icon: MailOpen },
  Başlatıldı:{ label: "Test Başlatıldı",  color: "text-blue-400 bg-blue-400/10", icon: Play },
  Tamamlandı:{ label: "Tamamlandı",       color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle2 },
};

function DurumBadge({ durum }: { durum: DavetDurum }) {
  const cfg = durumConfig[durum];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Tab Bileşenleri ──────────────────────────────────────────────────────────

interface TestItem { id: string; title: string; }

const MOCK_TESTS_FALLBACK: TestItem[] = [
  { id: "TST-001", title: "Yazılım Geliştirici Teknik Değerlendirme" },
  { id: "TST-002", title: "Analitik Düşünme Testi" },
  { id: "TST-003", title: "İletişim Becerileri Değerlendirme" },
  { id: "TST-004", title: "Liderlik Yetkinlikleri Testi" },
];

function loadTests(): TestItem[] {
  try {
    const stored = localStorage.getItem("sb_tests");
    if (stored) {
      const parsed = JSON.parse(stored) as { id: string; title: string }[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((t) => ({ id: t.id, title: t.title }));
    }
  } catch {}
  return MOCK_TESTS_FALLBACK;
}

function DavetSekmesi() {
  const [activeMethod, setActiveMethod] = useState<"email" | "whatsapp" | "toplu" | "link">("email");
  const [testler, setTestler] = useState<TestItem[]>(MOCK_TESTS_FALLBACK);

  useEffect(() => { setTestler(loadTests()); }, []);
  const [email, setEmail] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [son_tarih, setSonTarih] = useState("");
  const [sent, setSent] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [csvRows, setCsvRows] = useState<{ ad: string; soyad: string; email: string }[]>([
    { ad: "", soyad: "", email: "" },
  ]);
  const [bulkSent, setBulkSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkExpiry, setLinkExpiry] = useState<"daima" | "tarih">("daima");
  const [selectedLinkTest, setSelectedLinkTest] = useState("");
  const [linkUrl, setLinkUrl] = useState<string>("");

  function generateToken() {
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  }

  function sendInvite() {
    const token = generateToken();
    const url = `${window.location.origin}/test/${token}`;
    setQrUrl(url);
    setShowQrModal(true);
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(""); setSelectedTest(""); setSonTarih(""); }, 3000);
  }

  function sendBulk() {
    setBulkSent(true);
    setTimeout(() => { setBulkSent(false); setCsvRows([{ ad: "", soyad: "", email: "" }]); }, 3000);
  }

  function generateLinkUrl() {
    const token = generateToken();
    const url = `${window.location.origin}/test/${token}`;
    setLinkUrl(url);
    return url;
  }


  // WhatsApp state
  const [waPhone, setWaPhone] = useState("");
  const [waName, setWaName] = useState("");
  const [waTest, setWaTest] = useState("");
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function sendWhatsApp() {
    if (!waPhone || !waTest) return;
    setWaSending(true);
    setWaResult(null);
    const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    const testUrl = `${window.location.origin}/test/${token}`;
    try {
      const res = await fetch("/api/whatsapp/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: waPhone, candidateName: waName, testName: waTest, testUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWaResult({ ok: true, msg: data.dev ? `Test modu: ${data.to} numarasına gönderildi (gerçek mesaj için Twilio yapılandırın).` : `Mesaj gönderildi! SID: ${data.sid}` });
      setWaPhone(""); setWaName(""); setWaTest("");
    } catch (err: unknown) {
      setWaResult({ ok: false, msg: err instanceof Error ? err.message : "Gönderilemedi." });
    } finally {
      setWaSending(false);
    }
  }

  const methods = [
    { id: "email" as const, label: "E-posta Daveti", icon: Mail },
    { id: "whatsapp" as const, label: "WhatsApp Daveti", icon: MessageCircle },
    { id: "toplu" as const, label: "Toplu Davet (CSV)", icon: Upload },
    { id: "link"  as const, label: "Davet Bağlantısı", icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      {/* Method Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-800/60 rounded-lg w-fit">
        {methods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveMethod(id);
              if (id === "link" && !linkUrl) generateLinkUrl();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeMethod === id
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* E-posta Daveti */}
      {activeMethod === "email" && (
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4 max-w-lg">
          <p className="text-sm text-zinc-400">Adayın e-posta adresini girin. Sistem, adaya özel test bağlantısı içeren bir davet e-postası gönderir.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Test Seç</label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">— Test seçin —</option>
                {testler.map((t) => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Aday E-postası</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aday@ornek.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Son Başvuru Tarihi (opsiyonel)</label>
              <input
                type="date"
                value={son_tarih}
                onChange={(e) => setSonTarih(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={sendInvite}
              disabled={!email || !selectedTest || sent}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {sent ? <><Check className="w-4 h-4" />Davet Gönderildi!</> : <><Mail className="w-4 h-4" />Daveti Gönder</>}
            </button>
            {sent && qrUrl && (
              <button
                onClick={() => setQrUrl(qrUrl)}
                className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <QrCode className="w-4 h-4" /> QR Kodu Göster
              </button>
            )}
          </div>

          {/* QR Modal */}
          {qrUrl && showQrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowQrModal(false)} />
              <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl w-full max-w-sm">
                <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <p className="text-white font-semibold">Davet QR Kodu</p>
                  <p className="text-xs text-zinc-400 mt-1">Aday bu kodu okutarak teste erişir</p>
                </div>
                <div className="p-4 bg-white rounded-2xl">
                  <QRCodeSVG value={qrUrl} size={200} />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
                    <span className="flex-1 text-xs text-zinc-400 truncate">{qrUrl}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(qrUrl).catch(() => {})}
                      className="shrink-0 text-zinc-500 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-600 text-center">
                    Aday QR&apos;ı okutunca adını girerek testi başlatır
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Daveti */}
      {activeMethod === "whatsapp" && (
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4 max-w-lg">
          {/* Info banner */}
          <div className="flex items-start gap-2.5 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Adaya WhatsApp üzerinden <span className="text-white font-medium">test bağlantısı + QR kod</span> içeren davet mesajı gönderilir.
              Twilio yapılandırılmadan geliştirme modunda çalışır (konsol çıktısı verir).
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Test Seç</label>
              <select
                value={waTest}
                onChange={(e) => setWaTest(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">— Test seçin —</option>
                {testler.map((t) => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Aday Adı (opsiyonel)</label>
              <input
                type="text"
                value={waName}
                onChange={(e) => setWaName(e.target.value)}
                placeholder="ör: Ahmet Yılmaz"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> WhatsApp Numarası
              </label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400 shrink-0">+90</span>
                <input
                  type="tel"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="532 000 00 00"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">Ülke kodu olmadan 10 haneli numara girin.</p>
            </div>
          </div>

          {/* Result feedback */}
          {waResult && (
            <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
              waResult.ok
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {waResult.ok ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              {waResult.msg}
            </div>
          )}

          <button
            onClick={sendWhatsApp}
            disabled={!waPhone || !waTest || waSending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {waSending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Gönderiliyor…</>
              : <><MessageCircle className="w-4 h-4" />WhatsApp ile Davet Gönder</>
            }
          </button>
        </div>
      )}

      {/* Toplu Davet */}
      {activeMethod === "toplu" && (
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4 max-w-2xl">
          <p className="text-sm text-zinc-400">CSV yükleyin veya aşağıya aday bilgilerini girin. Her satır bir aday için ad, soyad ve e-posta içermelidir.</p>

          {/* Manuel tablo */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-500 px-1">
              <span>Ad</span><span>Soyad</span><span>E-posta</span>
            </div>
            {csvRows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={row.ad} onChange={(e) => { const r = [...csvRows]; r[i].ad = e.target.value; setCsvRows(r); }} placeholder="Ad" className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
                <input value={row.soyad} onChange={(e) => { const r = [...csvRows]; r[i].soyad = e.target.value; setCsvRows(r); }} placeholder="Soyad" className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
                <div className="flex gap-2">
                  <input value={row.email} onChange={(e) => { const r = [...csvRows]; r[i].email = e.target.value; setCsvRows(r); }} placeholder="e-posta" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
                  {csvRows.length > 1 && (
                    <button onClick={() => setCsvRows(csvRows.filter((_, j) => j !== i))} className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => setCsvRows([...csvRows, { ad: "", soyad: "", email: "" }])} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mt-1">
              <Plus className="w-3.5 h-3.5" /> Satır Ekle
            </button>
          </div>

          {/* CSV yükle */}
          <div className="border-t border-zinc-700/50 pt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              CSV Yükle
              <input type="file" accept=".csv" className="hidden" />
            </label>
            <span className="text-xs text-zinc-500">Format: ad, soyad, e-posta</span>
          </div>

          <button
            onClick={sendBulk}
            disabled={csvRows.filter((r) => r.email).length === 0 || bulkSent}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {bulkSent ? <><Check className="w-4 h-4" />Davetler Gönderildi!</> : <><Mail className="w-4 h-4" />Toplu Davet Gönder ({csvRows.filter((r) => r.email).length} aday)</>}
          </button>
        </div>
      )}

      {/* Davet Bağlantısı */}
      {activeMethod === "link" && (
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4 max-w-lg">
          <p className="text-sm text-zinc-400">Benzersiz test bağlantısını WhatsApp, LinkedIn veya e-posta ile paylaşın.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Test Seç</label>
              <select
                value={selectedLinkTest}
                onChange={(e) => setSelectedLinkTest(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">— Test seçin —</option>
                {testler.map((t) => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Geçerlilik</label>
              <div className="flex gap-2">
                {(["daima", "tarih"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setLinkExpiry(v)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      linkExpiry === v
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {v === "daima" ? "Her Zaman Aktif" : "Belirli Tarih"}
                  </button>
                ))}
              </div>
              {linkExpiry === "tarih" && (
                <input type="date" className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
              )}
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-zinc-300 truncate">
                {linkUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/test/...`}
              </span>
              <button
                onClick={() => {
                  const url = linkUrl || generateLinkUrl();
                  navigator.clipboard.writeText(url).catch(() => {});
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="shrink-0 text-zinc-400 hover:text-white transition-colors"
              >
                {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Bağlantıyı alan herkes platforma kayıtsız olsa bile testi başlatabilir. Platforma kayıtsız adaylar için geçici hesap otomatik oluşturulur.</p>

          {/* QR Code */}
          <div className="border-t border-zinc-700/50 pt-4">
            <p className="text-xs text-zinc-400 font-medium mb-3 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" /> QR Kod ile Paylaş
            </p>
            <div className="flex items-start gap-5">
              <div className="p-3 bg-white rounded-xl shrink-0">
                <QRCodeSVG value={linkUrl || `${typeof window !== "undefined" ? window.location.origin : "https://skillbridge.co"}/test/demo`} size={120} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Adaylar QR kodu telefon kameralarıyla okutarak doğrudan teste erişir. Teste başlamadan önce <span className="text-white font-medium">adlarını girmek zorundadır</span>.
                </p>
                <button
                  onClick={() => {
                    const svg = document.querySelector(".qr-link-svg");
                    if (!svg) return;
                    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "davet-qr.svg";
                    a.click();
                  }}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors w-fit"
                >
                  <Download className="w-3.5 h-3.5" /> QR&apos;ı İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PuanBadge({ puan }: { puan: number }) {
  const color =
    puan >= 80 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" :
    puan >= 60 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/25" :
                 "text-red-400 bg-red-400/10 border-red-400/25";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {puan}<span className="font-normal opacity-70">/100</span>
    </span>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
      positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
    }`}>
      {positive ? "▲" : "▼"} {Math.abs(delta)} puan
    </span>
  );
}

function AdayListesi() {
  const [depFiltre, setDepFiltre] = useState("Tümü");
  const [aramaText, setAramaText] = useState("");

  const departmanlar = ["Tümü", ...Array.from(new Set(MOCK_ADAYLAR_PORTFOY.map((a) => a.departman))).sort()];

  const filtered = MOCK_ADAYLAR_PORTFOY.filter((a) => {
    const depOk = depFiltre === "Tümü" || a.departman === depFiltre;
    const q = aramaText.toLowerCase();
    const aramaOk = !q ||
      `${a.ad} ${a.soyad}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.pozisyon.toLowerCase().includes(q);
    return depOk && aramaOk;
  });

  return (
    <div className="space-y-4">
      {/* Arama + Departman Filtresi */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={aramaText}
          onChange={(e) => setAramaText(e.target.value)}
          placeholder="Aday ara (ad, e-posta, pozisyon)…"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {departmanlar.map((d) => (
            <button
              key={d}
              onClick={() => setDepFiltre(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                depFiltre === d ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Özet İstatistik */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Toplam Aday", value: MOCK_ADAYLAR_PORTFOY.length },
          { label: "Tamamlandı", value: MOCK_ADAYLAR_PORTFOY.filter((a) => a.katilimlar.some((k) => k.durum === "Tamamlandı")).length },
          { label: "Tekrar Katılan", value: MOCK_ADAYLAR_PORTFOY.filter((a) => a.katilimlar.length >= 2).length },
          { label: "Ort. Puan", value: (() => {
            const puanlar = MOCK_ADAYLAR_PORTFOY.flatMap((a) => a.katilimlar.map((k) => k.puan).filter((p): p is number => p !== null));
            return puanlar.length ? Math.round(puanlar.reduce((s, p) => s + p, 0) / puanlar.length) : "—";
          })() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="text-xl font-bold text-white mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Ana Tablo */}
      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-zinc-700/50 text-zinc-500 text-xs">
              <th className="text-left px-4 py-3 font-medium">Aday</th>
              <th className="text-left px-4 py-3 font-medium">Departman</th>
              <th className="text-left px-4 py-3 font-medium">1. Test</th>
              <th className="text-left px-4 py-3 font-medium w-24">Tarih</th>
              <th className="text-left px-4 py-3 font-medium">Sonuç</th>
              <th className="text-left px-4 py-3 font-medium">2. Test</th>
              <th className="text-left px-4 py-3 font-medium w-24">Tarih</th>
              <th className="text-left px-4 py-3 font-medium">Sonuç</th>
              <th className="text-left px-4 py-3 font-medium">Gelişim</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => {
              const k1 = a.katilimlar[0];
              const k2 = a.katilimlar[1] ?? null;
              const delta = (k1.puan !== null && k2?.puan !== null && k2?.puan !== undefined)
                ? k2.puan - k1.puan
                : null;

              return (
                <tr
                  key={a.id}
                  className={`border-b border-zinc-700/30 hover:bg-zinc-700/20 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                >
                  {/* Aday */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-300">
                        {a.ad[0]}{a.soyad[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{a.ad} {a.soyad}</div>
                        <div className="text-xs text-zinc-500">{a.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Departman */}
                  <td className="px-4 py-3.5">
                    <div className="text-xs text-zinc-300 font-medium">{a.departman}</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">{a.pozisyon}</div>
                  </td>

                  {/* 1. Test */}
                  <td className="px-4 py-3.5 max-w-[160px]">
                    <span className="text-zinc-300 text-xs leading-snug line-clamp-2">{k1.testAdi}</span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap">{k1.tarih}</td>
                  <td className="px-4 py-3.5">
                    {k1.puan !== null
                      ? <PuanBadge puan={k1.puan} />
                      : <DurumBadge durum={k1.durum} />}
                  </td>

                  {/* 2. Test */}
                  <td className="px-4 py-3.5 max-w-[160px]">
                    {k2
                      ? <span className="text-zinc-300 text-xs leading-snug line-clamp-2">{k2.testAdi}</span>
                      : <span className="text-zinc-700 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap">
                    {k2 ? k2.tarih : ""}
                  </td>
                  <td className="px-4 py-3.5">
                    {k2
                      ? k2.puan !== null
                        ? <PuanBadge puan={k2.puan} />
                        : <DurumBadge durum={k2.durum} />
                      : <span className="text-zinc-700 text-xs">—</span>}
                  </td>

                  {/* Gelişim */}
                  <td className="px-4 py-3.5">
                    {delta !== null
                      ? <DeltaBadge delta={delta} />
                      : <span className="text-zinc-700 text-xs">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-600 text-sm">Aday bulunamadı.</div>
      )}

      {/* ── Test Paylaş & QR ───────────────────────────────────────────── */}
      <TestPaylasPanel />
    </div>
  );
}

function TestPaylasPanel() {
  const [testler, setTestler] = useState<TestItem[]>(MOCK_TESTS_FALLBACK);
  const [seciliTest, setSeciliTest] = useState<TestItem | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [waPhone, setWaPhone] = useState("");
  const [showWaInput, setShowWaInput] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [mailAddress, setMailAddress] = useState("");
  const [showMailInput, setShowMailInput] = useState(false);

  useEffect(() => { setTestler(loadTests()); }, []);

  function generateToken() {
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  }

  function selectTest(test: TestItem) {
    const token = generateToken();
    const url = `${window.location.origin}/test/${token}`;
    setSeciliTest(test);
    setQrUrl(url);
    setWaResult(null);
    setMailSent(false);
    setShowWaInput(false);
    setShowMailInput(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(qrUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendMail() {
    if (!mailAddress) return;
    setMailSent(true);
    setTimeout(() => { setMailSent(false); setMailAddress(""); setShowMailInput(false); }, 3000);
  }

  async function sendWhatsApp() {
    if (!waPhone || !seciliTest) return;
    setWaSending(true);
    setWaResult(null);
    try {
      const res = await fetch("/api/whatsapp/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: waPhone, testName: seciliTest.title, testUrl: qrUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWaResult({ ok: true, msg: data.dev ? `Test modu: ${data.to} numarasına gönderildi.` : `Gönderildi! SID: ${data.sid}` });
      setWaPhone("");
      setShowWaInput(false);
    } catch (err: unknown) {
      setWaResult({ ok: false, msg: err instanceof Error ? err.message : "Gönderilemedi." });
    } finally {
      setWaSending(false);
    }
  }

  return (
    <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      {/* Başlık */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" />
            Testi Paylaş
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            Bir test seçin; QR kodu ve paylaşım bağlantısı otomatik oluşur.
          </p>
        </div>
        {seciliTest && (
          <button
            onClick={() => { setSeciliTest(null); setQrUrl(""); }}
            className="text-zinc-600 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Test Seç */}
      {!seciliTest ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {testler.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTest(t)}
              className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-indigo-500/50 rounded-xl text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{t.title}</p>
                <p className="text-[11px] text-zinc-500">{t.id}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* QR Kodu */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="p-4 bg-white rounded-2xl shadow-lg">
              <QRCodeSVG value={qrUrl} size={180} />
            </div>
            <p className="text-[11px] text-zinc-600 text-center max-w-[200px]">
              Adaylar bu kodu okutarak teste erişir; adlarını girdikten sonra test başlar.
            </p>
            <button
              onClick={() => {
                const canvas = document.querySelector<HTMLCanvasElement>(".qr-share-canvas");
                if (!canvas) {
                  const svg = document.querySelector(".qr-share-svg") as SVGElement | null;
                  if (!svg) return;
                  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
                  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "test-qr.svg"; a.click();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> QR&apos;ı İndir
            </button>
          </div>

          {/* Sağ Panel */}
          <div className="flex-1 space-y-4">
            {/* Seçili Test Bilgisi */}
            <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{seciliTest.title}</p>
                <p className="text-xs text-zinc-500">{seciliTest.id}</p>
              </div>
            </div>

            {/* Bağlantı kopyala */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Test Bağlantısı</label>
              <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5">
                <span className="flex-1 text-xs text-zinc-300 truncate">{qrUrl}</span>
                <button onClick={copyLink} className="shrink-0 text-zinc-400 hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Paylaşım Butonları */}
            <div>
              <label className="block text-xs text-zinc-500 mb-2">Paylaş</label>
              <div className="flex flex-wrap gap-2">
                {/* E-posta */}
                <button
                  onClick={() => { setShowMailInput((v) => !v); setShowWaInput(false); }}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-indigo-400" /> E-posta ile Gönder
                </button>
                {/* WhatsApp */}
                <button
                  onClick={() => { setShowWaInput((v) => !v); setShowMailInput(false); }}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp ile Gönder
                </button>
                {/* Fotoğraf/Mobil */}
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" /> Bağlantıyı Aç
                </a>
              </div>
            </div>

            {/* E-posta Girişi */}
            {showMailInput && (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={mailAddress}
                  onChange={(e) => setMailAddress(e.target.value)}
                  placeholder="aday@ornek.com"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={sendMail}
                  disabled={!mailAddress || mailSent}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  {mailSent ? <><Check className="w-4 h-4" />Gönderildi</> : <><Mail className="w-4 h-4" />Gönder</>}
                </button>
              </div>
            )}

            {/* WhatsApp Girişi */}
            {showWaInput && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400 shrink-0">+90</span>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="532 000 00 00"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={sendWhatsApp}
                    disabled={!waPhone || waSending}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {waSending
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Gönderiliyor</>
                      : <><MessageCircle className="w-4 h-4" />Gönder</>}
                  </button>
                </div>
                {waResult && (
                  <p className={`text-xs px-3 py-2 rounded-lg border ${waResult.ok ? "text-emerald-300 bg-emerald-500/5 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
                    {waResult.msg}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BildirimlerSekmesi() {
  const [bildirimler, setBildirimler] = useState(MOCK_BILDIRIMLER);

  function temizle() {
    setBildirimler((prev) => prev.map((b) => ({ ...b, okundu: true })));
  }

  const okunmamis = bildirimler.filter((b) => !b.okundu).length;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300 font-medium">Bildirim Merkezi</span>
          {okunmamis > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{okunmamis}</span>
          )}
        </div>
        <button onClick={temizle} className="text-xs text-zinc-500 hover:text-white transition-colors">
          Tümünü okundu işaretle
        </button>
      </div>

      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden divide-y divide-zinc-700/30">
        {bildirimler.map((b) => (
          <div key={b.id} className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${!b.okundu ? "bg-indigo-500/5" : ""}`}>
            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!b.okundu ? "bg-indigo-400" : "bg-zinc-700"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-300">{b.tip}</span>
                {b.tip === "Kontör Uyarısı" && <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
              <p className="text-sm text-zinc-400 mt-0.5">{b.icerik}</p>
            </div>
            <span className="text-xs text-zinc-600 shrink-0">{b.tarih}</span>
          </div>
        ))}
      </div>

      {/* E-posta Bildirimleri Tablosu */}
      <div>
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Otomatik E-posta Bildirimleri</h3>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-700/50 text-zinc-500">
                <th className="text-left px-4 py-2.5 font-medium">Tetikleyici</th>
                <th className="text-left px-4 py-2.5 font-medium">Alıcı</th>
                <th className="text-left px-4 py-2.5 font-medium">İçerik</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {[
                ["Yeni üyelik", "Kullanıcı", "Hoş geldiniz + 50 kontör bilgisi"],
                ["Test daveti", "Aday", "Test bağlantısı + talimatlar"],
                ["Test tamamlandı", "Şirket admini", "Adayın test bitirdiği bilgisi"],
                ["Kontör azaldı (10 kaldı)", "Kullanıcı", "Bakiye uyarısı"],
                ["Kontör tükendi", "Kullanıcı", "Bakiye yükleme yönlendirmesi"],
                ["Şifre sıfırlama", "Kullanıcı", "Sıfırlama bağlantısı"],
              ].map(([tetikleyici, alici, icerik]) => (
                <tr key={tetikleyici} className="border-b border-zinc-700/30 last:border-b-0">
                  <td className="px-4 py-2.5 text-zinc-300 font-medium">{tetikleyici}</td>
                  <td className="px-4 py-2.5">{alici}</td>
                  <td className="px-4 py-2.5">{icerik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EntegrasyonlarSekmesi() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [faz2Open, setFaz2Open] = useState(false);

  function saveWebhook() {
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2000);
  }

  const faz2Items = [
    { baslik: "API Erişimi", aciklama: "Şirketlerin kendi sistemleriyle entegrasyon kurabilmesi için belgelenmiş REST API.", durum: "Yol Haritası" },
    { baslik: "SAP SuccessFactors", aciklama: "OAuth tabanlı iki yönlü entegrasyon.", durum: "Yol Haritası" },
    { baslik: "Workday", aciklama: "OAuth tabanlı iki yönlü entegrasyon.", durum: "Yol Haritası" },
    { baslik: "BambooHR", aciklama: "OAuth tabanlı iki yönlü entegrasyon.", durum: "Yol Haritası" },
    { baslik: "Greenhouse ATS", aciklama: "İki yönlü veri senkronizasyonu.", durum: "Yol Haritası" },
    { baslik: "Lever ATS", aciklama: "İki yönlü veri senkronizasyonu.", durum: "Yol Haritası" },
    { baslik: "Recruitee ATS", aciklama: "İki yönlü veri senkronizasyonu.", durum: "Yol Haritası" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Faz 1 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Faz 1 · Aktif</span>
          <h3 className="text-sm font-medium text-zinc-300">Mevcut Entegrasyonlar</h3>
        </div>

        <div className="space-y-4">
          {/* Webhook */}
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                <Webhook className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Webhook Desteği</div>
                <p className="text-xs text-zinc-400 mt-0.5">Test tamamlandığında seçtiğiniz URL'ye otomatik POST isteği gönderilir. ATS entegrasyonu için idealdir.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-ats.example.com/webhook"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={saveWebhook}
                disabled={!webhookUrl}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {webhookSaved ? <Check className="w-4 h-4" /> : null}
                {webhookSaved ? "Kaydedildi" : "Kaydet"}
              </button>
            </div>
            <p className="text-xs text-zinc-600">Örnek payload: <code className="text-zinc-400">{"{ candidateId, testId, score, completedAt }"}</code></p>
          </div>

          {/* CSV Export */}
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">CSV Dışa Aktarma</div>
                <p className="text-xs text-zinc-400 mt-0.5">Tüm test sonuçlarını CSV formatında indirin. Tarih aralığı ve test bazlı filtreleme desteklenir.</p>
              </div>
              <button className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors shrink-0">
                <Download className="w-4 h-4" />
                İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Faz 2 */}
      <div>
        <button
          onClick={() => setFaz2Open(!faz2Open)}
          className="flex items-center gap-2 w-full text-left"
        >
          <span className="text-xs font-semibold bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">Faz 2 · Yol Haritası</span>
          <h3 className="text-sm font-medium text-zinc-300">Gelecek Entegrasyonlar</h3>
          {faz2Open ? <ChevronUp className="w-4 h-4 text-zinc-500 ml-auto" /> : <ChevronDown className="w-4 h-4 text-zinc-500 ml-auto" />}
        </button>

        {faz2Open && (
          <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden divide-y divide-zinc-700/30">
            {faz2Items.map((item) => (
              <div key={item.baslik} className="flex items-center gap-4 px-4 py-3">
                <ExternalLink className="w-4 h-4 text-zinc-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-300">{item.baslik}</div>
                  <div className="text-xs text-zinc-500">{item.aciklama}</div>
                </div>
                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-full shrink-0">{item.durum}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "davet",         label: "Aday Davet" },
  { id: "adaylar",      label: "Aday Listesi" },
  { id: "bildirimler",  label: "Bildirimler" },
  { id: "entegrasyonlar", label: "Entegrasyonlar" },
];

export default function CandidatesPage() {
  const [activeTab, setActiveTab] = useState("davet");

  const okunmamis = MOCK_BILDIRIMLER.filter((b) => !b.okundu).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analizler ve Entegrasyonlar</h1>
        <p className="text-zinc-400 text-sm mt-1">Aday davetleri, bildirimler ve sistem entegrasyonlarını yönetin.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === id
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
            {id === "bildirimler" && okunmamis > 0 && (
              <span className="ml-1.5 bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{okunmamis}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "davet"         && <DavetSekmesi />}
      {activeTab === "adaylar"       && <AdayListesi />}
      {activeTab === "bildirimler"   && <BildirimlerSekmesi />}
      {activeTab === "entegrasyonlar"&& <EntegrasyonlarSekmesi />}
    </div>
  );
}
