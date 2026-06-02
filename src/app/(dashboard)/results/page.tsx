"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Users,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Award,
  AlertTriangle,
  Download,
  Eye,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Seviye = "Çok Yetkin" | "Yetkin" | "Ortalama" | "Yetkin Olmayan";

interface AdaySonucu {
  id: string;
  ad: string;
  testId: string;
  testTitle: string;
  sektor: string;
  tarih: string;
  dogruluk: number;
  tutarlilik: number;
  toplamPuan: number;
  seviye: Seviye;
  sure: string;
  tamamlandi: boolean;
}

interface TestSonucu {
  testId: string;
  testTitle: string;
  sektor: string;
  meslek: string;
  toplamAday: number;
  tamamlanan: number;
  ortPuan: number;
  ortDogruluk: number;
  ortTutarlilik: number;
  seviyeDagilim: Record<Seviye, number>;
  sorular: SoruAnaliz[];
}

interface SoruAnaliz {
  soru: string;
  dogruOrani: number;
  kategori: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ADAY_SONUCLARI: AdaySonucu[] = [
  // Test 1 — Yazılım Geliştirici (12 aday)
  { id: "a1",  ad: "Ahmet Yılmaz",   testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "2 Mar 2026",  dogruluk: 92, tutarlilik: 88, toplamPuan: 90, seviye: "Çok Yetkin",     sure: "38 dk", tamamlandi: true },
  { id: "a2",  ad: "Elif Demir",      testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "2 Mar 2026",  dogruluk: 85, tutarlilik: 80, toplamPuan: 83, seviye: "Çok Yetkin",     sure: "41 dk", tamamlandi: true },
  { id: "a3",  ad: "Can Kaya",        testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "2 Mar 2026",  dogruluk: 78, tutarlilik: 72, toplamPuan: 75, seviye: "Yetkin",         sure: "44 dk", tamamlandi: true },
  { id: "a4",  ad: "Zeynep Arslan",   testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "1 Mar 2026",  dogruluk: 72, tutarlilik: 65, toplamPuan: 69, seviye: "Ortalama",       sure: "43 dk", tamamlandi: true },
  { id: "a5",  ad: "Mert Şahin",      testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "1 Mar 2026",  dogruluk: 60, tutarlilik: 55, toplamPuan: 58, seviye: "Ortalama",       sure: "45 dk", tamamlandi: true },
  { id: "a6",  ad: "Selin Çelik",     testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "1 Mar 2026",  dogruluk: 48, tutarlilik: 40, toplamPuan: 44, seviye: "Yetkin Olmayan", sure: "45 dk", tamamlandi: true },
  { id: "a7",  ad: "Burak Özkan",     testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "28 Şub 2026", dogruluk: 88, tutarlilik: 91, toplamPuan: 90, seviye: "Çok Yetkin",     sure: "39 dk", tamamlandi: true },
  { id: "a8",  ad: "Ayşe Yıldız",     testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "28 Şub 2026", dogruluk: 74, tutarlilik: 76, toplamPuan: 75, seviye: "Yetkin",         sure: "42 dk", tamamlandi: true },
  { id: "a9",  ad: "Emre Doğan",      testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "28 Şub 2026", dogruluk: 55, tutarlilik: 60, toplamPuan: 57, seviye: "Ortalama",       sure: "45 dk", tamamlandi: true },
  { id: "a10", ad: "Nur Aydın",       testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "27 Şub 2026", dogruluk: 40, tutarlilik: 38, toplamPuan: 39, seviye: "Yetkin Olmayan", sure: "45 dk", tamamlandi: true },
  { id: "a11", ad: "Kerem Çoban",     testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "27 Şub 2026", dogruluk: 82, tutarlilik: 79, toplamPuan: 81, seviye: "Çok Yetkin",     sure: "40 dk", tamamlandi: true },
  { id: "a12", ad: "Gizem Polat",     testId: "1", testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",  sektor: "Bilişim Teknolojileri", tarih: "27 Şub 2026", dogruluk: 67, tutarlilik: 63, toplamPuan: 65, seviye: "Ortalama",       sure: "44 dk", tamamlandi: true },

  // Test 2 — Finans Uzmanı (8 aday)
  { id: "b1",  ad: "Hakan Yurt",      testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "25 Şub 2026", dogruluk: 91, tutarlilik: 87, toplamPuan: 89, seviye: "Çok Yetkin",     sure: "28 dk", tamamlandi: true },
  { id: "b2",  ad: "Derya Kılıç",     testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "24 Şub 2026", dogruluk: 76, tutarlilik: 70, toplamPuan: 73, seviye: "Yetkin",         sure: "30 dk", tamamlandi: true },
  { id: "b3",  ad: "Serhat Güler",    testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "24 Şub 2026", dogruluk: 63, tutarlilik: 58, toplamPuan: 61, seviye: "Ortalama",       sure: "30 dk", tamamlandi: true },
  { id: "b4",  ad: "Leyla Öztürk",    testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "23 Şub 2026", dogruluk: 87, tutarlilik: 84, toplamPuan: 86, seviye: "Çok Yetkin",     sure: "27 dk", tamamlandi: true },
  { id: "b5",  ad: "Ozan Toprak",     testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "23 Şub 2026", dogruluk: 44, tutarlilik: 50, toplamPuan: 47, seviye: "Yetkin Olmayan", sure: "30 dk", tamamlandi: true },
  { id: "b6",  ad: "Canan Tekin",     testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "22 Şub 2026", dogruluk: 71, tutarlilik: 68, toplamPuan: 70, seviye: "Yetkin",         sure: "29 dk", tamamlandi: true },
  { id: "b7",  ad: "Tolga Başar",     testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "22 Şub 2026", dogruluk: 56, tutarlilik: 52, toplamPuan: 54, seviye: "Ortalama",       sure: "30 dk", tamamlandi: true },
  { id: "b8",  ad: "Merve Coşkun",    testId: "2", testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi", sektor: "Finans ve Bankacılık", tarih: "21 Şub 2026", dogruluk: 79, tutarlilik: 75, toplamPuan: 77, seviye: "Yetkin",         sure: "28 dk", tamamlandi: true },

  // Test 3 — İK Uzmanı (34 aday — showing 10 for brevity)
  { id: "c1",  ad: "Aslı Yıldırım",   testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "20 Şub 2026", dogruluk: 94, tutarlilik: 92, toplamPuan: 93, seviye: "Çok Yetkin",     sure: "55 dk", tamamlandi: true },
  { id: "c2",  ad: "Furkan Demirci",  testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "20 Şub 2026", dogruluk: 82, tutarlilik: 78, toplamPuan: 80, seviye: "Çok Yetkin",     sure: "58 dk", tamamlandi: true },
  { id: "c3",  ad: "Şeyma Öz",        testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "19 Şub 2026", dogruluk: 73, tutarlilik: 69, toplamPuan: 71, seviye: "Yetkin",         sure: "60 dk", tamamlandi: true },
  { id: "c4",  ad: "Ali Karadağ",     testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "19 Şub 2026", dogruluk: 65, tutarlilik: 60, toplamPuan: 63, seviye: "Ortalama",       sure: "59 dk", tamamlandi: true },
  { id: "c5",  ad: "İpek Sönmez",     testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "18 Şub 2026", dogruluk: 88, tutarlilik: 85, toplamPuan: 87, seviye: "Çok Yetkin",     sure: "52 dk", tamamlandi: true },
  { id: "c6",  ad: "Yasin Ateş",      testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "18 Şub 2026", dogruluk: 42, tutarlilik: 45, toplamPuan: 43, seviye: "Yetkin Olmayan", sure: "60 dk", tamamlandi: true },
  { id: "c7",  ad: "Büşra Çakır",     testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "17 Şub 2026", dogruluk: 77, tutarlilik: 74, toplamPuan: 76, seviye: "Yetkin",         sure: "56 dk", tamamlandi: true },
  { id: "c8",  ad: "Ramazan Kurt",    testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "17 Şub 2026", dogruluk: 55, tutarlilik: 50, toplamPuan: 52, seviye: "Ortalama",       sure: "60 dk", tamamlandi: true },
  { id: "c9",  ad: "Eda Sarı",        testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "16 Şub 2026", dogruluk: 90, tutarlilik: 88, toplamPuan: 89, seviye: "Çok Yetkin",     sure: "54 dk", tamamlandi: true },
  { id: "c10", ad: "Onur Kılınç",     testId: "3", testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",   sektor: "Tüm Sektörler",        tarih: "16 Şub 2026", dogruluk: 68, tutarlilik: 64, toplamPuan: 66, seviye: "Ortalama",       sure: "58 dk", tamamlandi: true },
];

const TEST_SONUCLARI: TestSonucu[] = [
  {
    testId: "1",
    testTitle: "Yazılım Geliştirici — Teknik Yetkinlik Testi",
    sektor: "Bilişim Teknolojileri",
    meslek: "Yazılım Geliştirici",
    toplamAday: 12,
    tamamlanan: 12,
    ortPuan: 69,
    ortDogruluk: 70,
    ortTutarlilik: 67,
    seviyeDagilim: { "Çok Yetkin": 4, "Yetkin": 2, "Ortalama": 4, "Yetkin Olmayan": 2 },
    sorular: [
      { soru: "Algoritma ve Veri Yapıları",    dogruOrani: 78, kategori: "Teknik" },
      { soru: "Yazılım Mimarisi",              dogruOrani: 65, kategori: "Teknik" },
      { soru: "Kod Kalitesi & Clean Code",     dogruOrani: 72, kategori: "Teknik" },
      { soru: "Veritabanı & SQL",              dogruOrani: 60, kategori: "Teknik" },
      { soru: "Problem Çözme",                 dogruOrani: 74, kategori: "Yetkinlik" },
      { soru: "Takım Çalışması",               dogruOrani: 82, kategori: "Yetkinlik" },
    ],
  },
  {
    testId: "2",
    testTitle: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi",
    sektor: "Finans ve Bankacılık",
    meslek: "Finans Uzmanı",
    toplamAday: 8,
    tamamlanan: 8,
    ortPuan: 70,
    ortDogruluk: 71,
    ortTutarlilik: 68,
    seviyeDagilim: { "Çok Yetkin": 2, "Yetkin": 3, "Ortalama": 2, "Yetkin Olmayan": 1 },
    sorular: [
      { soru: "Finansal Raporlama",            dogruOrani: 74, kategori: "Teknik" },
      { soru: "Risk Analizi",                  dogruOrani: 66, kategori: "Teknik" },
      { soru: "Muhasebe İlkeleri",             dogruOrani: 72, kategori: "Teknik" },
      { soru: "Bütçe Yönetimi",               dogruOrani: 69, kategori: "Teknik" },
      { soru: "Analitik Düşünme",              dogruOrani: 77, kategori: "Yetkinlik" },
      { soru: "Karar Verme",                   dogruOrani: 71, kategori: "Yetkinlik" },
    ],
  },
  {
    testId: "3",
    testTitle: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",
    sektor: "Tüm Sektörler",
    meslek: "İnsan Kaynakları Uzmanı",
    toplamAday: 34,
    tamamlanan: 30,
    ortPuan: 72,
    ortDogruluk: 73,
    ortTutarlilik: 71,
    seviyeDagilim: { "Çok Yetkin": 10, "Yetkin": 9, "Ortalama": 7, "Yetkin Olmayan": 4 },
    sorular: [
      { soru: "İşe Alım Süreçleri",           dogruOrani: 80, kategori: "Teknik" },
      { soru: "Performans Yönetimi",           dogruOrani: 68, kategori: "Teknik" },
      { soru: "İş Hukuku",                    dogruOrani: 62, kategori: "Teknik" },
      { soru: "Mülakat Teknikleri",           dogruOrani: 75, kategori: "Teknik" },
      { soru: "İletişim & Empati",             dogruOrani: 84, kategori: "Yetkinlik" },
      { soru: "Organizasyon & Planlama",       dogruOrani: 70, kategori: "Yetkinlik" },
    ],
  },
];

const SEVIYE_CONFIG: Record<Seviye, { color: string; bg: string; border: string; dot: string }> = {
  "Çok Yetkin":     { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  "Yetkin":         { color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  dot: "bg-indigo-400"  },
  "Ortalama":       { color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   dot: "bg-amber-400"   },
  "Yetkin Olmayan": { color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     dot: "bg-red-400"     },
};

const TABS = ["Genel Bakış", "Aday Detayları", "AI Analizi"] as const;
type Tab = (typeof TABS)[number];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Genel Bakış");
  const [selectedTest, setSelectedTest] = useState<string>("Tümü");
  const [search, setSearch] = useState("");
  const [seviyeFilter, setSeviyeFilter] = useState<Seviye | "Tümü">("Tümü");
  const [expandedTest, setExpandedTest] = useState<string | null>("1");

  const toplamTamamlanan = TEST_SONUCLARI.reduce((s, t) => s + t.tamamlanan, 0);
  const toplamAday = TEST_SONUCLARI.reduce((s, t) => s + t.toplamAday, 0);
  const genelOrtalama = Math.round(
    TEST_SONUCLARI.reduce((s, t) => s + t.ortPuan * t.tamamlanan, 0) / toplamTamamlanan
  );
  const cokYetkinSayisi = ADAY_SONUCLARI.filter((a) => a.seviye === "Çok Yetkin").length;

  const filteredAdaylar = ADAY_SONUCLARI.filter((a) => {
    const matchTest = selectedTest === "Tümü" || a.testId === selectedTest;
    const matchSearch =
      a.ad.toLowerCase().includes(search.toLowerCase()) ||
      a.testTitle.toLowerCase().includes(search.toLowerCase());
    const matchSeviye = seviyeFilter === "Tümü" || a.seviye === seviyeFilter;
    return matchTest && matchSearch && matchSeviye;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Sonuçlar</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {TEST_SONUCLARI.length} test · {toplamAday} katılım · {toplamTamamlanan} tamamlandı
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={<ClipboardList className="w-4 h-4 text-indigo-400" />}
          label="Toplam Test"
          value={String(TEST_SONUCLARI.length)}
          sub="aktif test"
          color="indigo"
        />
        <SummaryCard
          icon={<Users className="w-4 h-4 text-violet-400" />}
          label="Toplam Katılım"
          value={String(toplamAday)}
          sub={`${toplamTamamlanan} tamamlandı`}
          color="violet"
        />
        <SummaryCard
          icon={<BarChart2 className="w-4 h-4 text-amber-400" />}
          label="Genel Ortalama"
          value={`%${genelOrtalama}`}
          sub="tüm testler"
          color="amber"
        />
        <SummaryCard
          icon={<Award className="w-4 h-4 text-emerald-400" />}
          label="Çok Yetkin"
          value={String(cokYetkinSayisi)}
          sub={`toplam ${ADAY_SONUCLARI.length} adaydan`}
          color="emerald"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === t
                ? "text-indigo-400 border-indigo-400"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Genel Bakış ───────────────────────────────────────────────────────── */}
      {activeTab === "Genel Bakış" && (
        <div className="flex flex-col gap-4">
          {TEST_SONUCLARI.map((ts) => (
            <TestResultCard
              key={ts.testId}
              ts={ts}
              expanded={expandedTest === ts.testId}
              onToggle={() => setExpandedTest(expandedTest === ts.testId ? null : ts.testId)}
              onAdayDetay={() => { setSelectedTest(ts.testId); setActiveTab("Aday Detayları"); }}
            />
          ))}
        </div>
      )}

      {/* ── Aday Detayları ────────────────────────────────────────────────────── */}
      {activeTab === "Aday Detayları" && (
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Aday veya test ara…"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Tümü">Tüm Testler</option>
                {TEST_SONUCLARI.map((ts) => (
                  <option key={ts.testId} value={ts.testId}>
                    {ts.meslek}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {(["Tümü", "Çok Yetkin", "Yetkin", "Ortalama", "Yetkin Olmayan"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeviyeFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                    seviyeFilter === s
                      ? s === "Tümü"
                        ? "bg-indigo-500 text-white"
                        : cn(SEVIYE_CONFIG[s as Seviye]?.bg, SEVIYE_CONFIG[s as Seviye]?.color)
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500">Aday</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 hidden md:table-cell">Test</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500">Doğruluk</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 hidden sm:table-cell">Tutarlılık</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500">Toplam</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500">Seviye</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 hidden lg:table-cell">Süre</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 hidden sm:table-cell">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdaylar.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-zinc-600 text-sm">
                      Eşleşen sonuç bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredAdaylar.map((a, i) => (
                    <tr
                      key={a.id}
                      className={cn(
                        "border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors",
                        i % 2 === 0 ? "" : "bg-zinc-900/50"
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/results/${a.id}`} className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-zinc-300">
                              {a.ad.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-sm text-white font-medium group-hover:text-indigo-400 transition-colors">
                            {a.ad}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-zinc-400 line-clamp-1">{a.testTitle.split("—")[0].trim()}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <ScorePill value={a.dogruluk} />
                      </td>
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <ScorePill value={a.tutarlilik} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-bold text-white">%{a.toplamPuan}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <SeviyeBadge seviye={a.seviye} />
                      </td>
                      <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                        <span className="text-xs text-zinc-500">{a.sure}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-xs text-zinc-600">{a.tarih}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredAdaylar.length > 0 && (
            <p className="text-xs text-zinc-600 text-center">
              {filteredAdaylar.length} sonuç gösteriliyor
            </p>
          )}
        </div>
      )}

      {/* ── AI Analizi ────────────────────────────────────────────────────────── */}
      {activeTab === "AI Analizi" && <AIAnaliziTab adaylar={ADAY_SONUCLARI} testler={TEST_SONUCLARI} />}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "indigo" | "violet" | "amber" | "emerald";
}) {
  const ring: Record<string, string> = {
    indigo: "border-indigo-500/20",
    violet: "border-violet-500/20",
    amber: "border-amber-500/20",
    emerald: "border-emerald-500/20",
  };
  return (
    <div className={cn("bg-zinc-900 border rounded-2xl px-5 py-4", ring[color])}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Seviye Badge ─────────────────────────────────────────────────────────────

function SeviyeBadge({ seviye }: { seviye: Seviye }) {
  const cfg = SEVIYE_CONFIG[seviye];
  return (
    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", cfg.bg, cfg.color, cfg.border)}>
      {seviye}
    </span>
  );
}

// ─── Score Pill ───────────────────────────────────────────────────────────────

function ScorePill({ value }: { value: number }) {
  const color =
    value >= 85 ? "text-emerald-400" :
    value >= 70 ? "text-indigo-400" :
    value >= 50 ? "text-amber-400" :
    "text-red-400";
  return <span className={cn("text-sm font-medium", color)}>%{value}</span>;
}

// ─── Test Result Card ─────────────────────────────────────────────────────────

function TestResultCard({
  ts, expanded, onToggle, onAdayDetay,
}: {
  ts: TestSonucu;
  expanded: boolean;
  onToggle: () => void;
  onAdayDetay?: () => void;
}) {
  const tamamlanmaOrani = Math.round((ts.tamamlanan / ts.toplamAday) * 100);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{ts.testTitle}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-zinc-500">{ts.sektor}</span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Users className="w-3 h-3" />
              {ts.tamamlanan}/{ts.toplamAday} aday
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500">Ort. %{ts.ortPuan}</span>
          </div>
        </div>
        {/* Seviye chips */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          {(Object.entries(ts.seviyeDagilim) as [Seviye, number][]).map(([sev, count]) => (
            count > 0 && (
              <span
                key={sev}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                  SEVIYE_CONFIG[sev].bg,
                  SEVIYE_CONFIG[sev].color,
                  SEVIYE_CONFIG[sev].border
                )}
              >
                {count} {sev}
              </span>
            )
          ))}
        </div>
        <div className="shrink-0 text-zinc-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-800 px-5 py-5 flex flex-col gap-6">
          {/* Top stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Ortalama Puan" value={`%${ts.ortPuan}`} />
            <MiniStat label="Ortalama Doğruluk" value={`%${ts.ortDogruluk}`} />
            <MiniStat label="Ortalama Tutarlılık" value={`%${ts.ortTutarlilik}`} />
            <MiniStat label="Tamamlanma Oranı" value={`%${tamamlanmaOrani}`} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Seviye dağılımı */}
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-3">Seviye Dağılımı</p>
              <SeviyeBarChart dagilim={ts.seviyeDagilim} toplam={ts.tamamlanan} />
            </div>

            {/* Soru bazlı analiz */}
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-3">Konu Başarı Oranları</p>
              <div className="flex flex-col gap-2">
                {ts.sorular.map((s) => (
                  <div key={s.soru} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-36 shrink-0 truncate">{s.soru}</span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          s.dogruOrani >= 75 ? "bg-emerald-500" :
                          s.dogruOrani >= 60 ? "bg-indigo-500" :
                          "bg-amber-500"
                        )}
                        style={{ width: `${s.dogruOrani}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-400 w-8 text-right shrink-0">
                      %{s.dogruOrani}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 border-t border-zinc-800 pt-4">
            <button
              onClick={onAdayDetay}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Aday Detayları
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
              <Download className="w-3.5 h-3.5" />
              Rapor İndir
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors ml-auto">
              <Sparkles className="w-3.5 h-3.5" />
              AI Analizi Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mini Stat ────────────────────────────────────────────────────────────────

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

// ─── Seviye Bar Chart ─────────────────────────────────────────────────────────

function SeviyeBarChart({
  dagilim, toplam,
}: {
  dagilim: Record<Seviye, number>;
  toplam: number;
}) {
  const seviyeler: Seviye[] = ["Çok Yetkin", "Yetkin", "Ortalama", "Yetkin Olmayan"];
  return (
    <div className="flex flex-col gap-2.5">
      {seviyeler.map((sev) => {
        const count = dagilim[sev];
        const pct = toplam > 0 ? Math.round((count / toplam) * 100) : 0;
        const cfg = SEVIYE_CONFIG[sev];
        return (
          <div key={sev} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-28 shrink-0">{sev}</span>
            <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", cfg.dot)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 w-12 text-right shrink-0">
              {count} (%{pct})
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── AI Analizi Tab ───────────────────────────────────────────────────────────

function AIAnaliziTab({
  adaylar, testler,
}: {
  adaylar: AdaySonucu[];
  testler: TestSonucu[];
}) {
  const topPerformers = [...adaylar]
    .sort((a, b) => b.toplamPuan - a.toplamPuan)
    .slice(0, 5);

  const dusukPerformers = [...adaylar]
    .filter((a) => a.toplamPuan < 50)
    .sort((a, b) => a.toplamPuan - b.toplamPuan);

  const genelOrtalama = Math.round(
    adaylar.reduce((s, a) => s + a.toplamPuan, 0) / adaylar.length
  );

  const seviyeDagilim = adaylar.reduce<Record<Seviye, number>>(
    (acc, a) => { acc[a.seviye]++; return acc; },
    { "Çok Yetkin": 0, "Yetkin": 0, "Ortalama": 0, "Yetkin Olmayan": 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      {/* AI banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 p-5">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-indigo-500/8 blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Test Sonuç Analizi</h3>
            <p className="text-xs text-zinc-400 mt-1">
              {adaylar.length} adayın {testler.length} farklı testteki performansına dayalı otomatik analiz
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Genel seviye dağılımı */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Genel Seviye Dağılımı</p>
          <SeviyeBarChart dagilim={seviyeDagilim} toplam={adaylar.length} />
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              Genel ortalama <span className="text-white font-semibold">%{genelOrtalama}</span> —
              {genelOrtalama >= 70
                ? " Havuz kalitesi yüksek, değerlendirme kriteri güvenilir."
                : " Havuzda gelişim alanı geniş; test kalibrasyonu önerilir."}
            </p>
          </div>
        </div>

        {/* Test başarı karşılaştırması */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Test Bazlı Karşılaştırma</p>
          <div className="flex flex-col gap-3">
            {testler.map((ts) => (
              <div key={ts.testId} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-32 shrink-0 truncate">{ts.meslek}</span>
                <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      ts.ortPuan >= 75 ? "bg-emerald-500" :
                      ts.ortPuan >= 60 ? "bg-indigo-500" :
                      "bg-amber-500"
                    )}
                    style={{ width: `${ts.ortPuan}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white w-10 text-right shrink-0">
                  %{ts.ortPuan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İçgörüler */}
      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          title="Güçlü Yönler"
          color="emerald"
          items={[
            "İletişim & Takım Çalışması ortalama %83 ile en yüksek puan",
            "Çok Yetkin aday oranı testlerde %27",
            "Tamamlanma oranı ortalama %94",
          ]}
        />
        <InsightCard
          icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          title="Gelişim Alanları"
          color="amber"
          items={[
            "İş Hukuku bilgisi %62 ile en düşük konu başarısı",
            "Veritabanı & SQL sorularında yüksek hata oranı",
            "Risk Analizi konusunda hafıza boşlukları tespit edildi",
          ]}
        />
        <InsightCard
          icon={<TrendingDown className="w-4 h-4 text-red-400" />}
          title="Dikkat Gerektiren"
          color="red"
          items={[
            `${dusukPerformers.length} aday %50 altında kaldı`,
            "Tutarlılık düşüklüğü tesadüfi yanıt riski işareti",
            "Süre aşımı olmaksızın düşük doğruluk: ezber eksikliği",
          ]}
        />
      </div>

      {/* Top 5 aday */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white">En Başarılı 5 Aday</p>
          <span className="text-xs text-zinc-500">tüm testler</span>
        </div>
        <div className="flex flex-col gap-2">
          {topPerformers.map((a, i) => (
            <div key={a.id} className="flex items-center gap-4 px-4 py-3 bg-zinc-800/40 rounded-xl hover:bg-zinc-800/70 transition-colors">
              <span className={cn(
                "text-sm font-bold w-6 text-center shrink-0",
                i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-amber-700" : "text-zinc-600"
              )}>
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-zinc-300">
                  {a.ad.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{a.ad}</p>
                <p className="text-xs text-zinc-500 truncate">{a.testTitle.split("—")[0].trim()}</p>
              </div>
              <SeviyeBadge seviye={a.seviye} />
              <span className="text-base font-bold text-white shrink-0">%{a.toplamPuan}</span>
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <span className="text-xs text-zinc-600">D:%{a.dogruluk}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-600">T:%{a.tutarlilik}</span>
                <Clock className="w-3 h-3 text-zinc-700 ml-1" />
                <span className="text-xs text-zinc-600">{a.sure}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Öneri */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-semibold text-white">AI Önerileri</p>
        </div>
        <ul className="flex flex-col gap-2">
          {[
            "Yazılım Geliştirici testindeki 4 Çok Yetkin adayı teknik mülakate davet edilmeye hazır.",
            "Finans Uzmanı pozisyonunda havuz kalitesi yüksek — 2 Çok Yetkin, 3 Yetkin aday shortlist oluşturabilir.",
            "İK testinde tamamlanmayan 4 adayın takibi önerilir; tamamlanma oranını artırmak için hatırlatma gönderilmeli.",
            "İş Hukuku ve Veritabanı & SQL konularında test kalibrasyon çalışması değerlendirilebilir.",
            "Tutarlılık skoru %45 altındaki adaylara ek doğrulama sorusu gönderilmesi önerilir.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  icon, title, color, items,
}: {
  icon: React.ReactNode;
  title: string;
  color: "emerald" | "amber" | "red";
  items: string[];
}) {
  const border: Record<string, string> = {
    emerald: "border-emerald-500/20",
    amber: "border-amber-500/20",
    red: "border-red-500/20",
  };
  return (
    <div className={cn("bg-zinc-900 border rounded-2xl p-5", border[color])}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
