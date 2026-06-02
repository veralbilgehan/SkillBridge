"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ClipboardList,
  Users,
  Eye,
  Pencil,
  Clock,
  Sparkles,
  Filter,
  Copy,
  ChevronRight,
  Star,
  Coins,
  FileSearch,
  Zap,
  CheckCircle2,
  BarChart,
  Send,
  Download,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestSource = "template" | "custom";
type TestStatus = "aktif" | "taslak" | "arsiv";
type Difficulty = "Kolay" | "Orta" | "İleri";
type TemplateCategory = "Genel Yetkinlik" | "Sektörel" | "Pozisyon Bazlı" | "Mülakat Hazırlık" | "Vaka Analizi";

interface Test {
  id: string;
  title: string;
  sektor: string;
  meslek: string;
  source: TestSource;
  status: TestStatus;
  soruSayisi: number;
  sure: string | null;
  adaySayisi: number;
  date: string;
}

interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  sektor: string;
  soruSayisi: number;
  sure: string;
  difficulty: Difficulty;
  aciklama: string;
  kullananSayisi: number;
  puan: number;
  isVaka?: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TESTS: Test[] = [
  {
    id: "TST-001",
    title: "Yazılım Geliştirici — Teknik Yetkinlik Testi",
    sektor: "Bilişim Teknolojileri",
    meslek: "Yazılım Geliştirici",
    source: "custom",
    status: "aktif",
    soruSayisi: 20,
    sure: "45 dk",
    adaySayisi: 12,
    date: "28 Şub 2026",
  },
  {
    id: "TST-002",
    title: "Finans Uzmanı — Temel Yetkinlik Değerlendirmesi",
    sektor: "Finans ve Bankacılık",
    meslek: "Finans Uzmanı",
    source: "custom",
    status: "aktif",
    soruSayisi: 15,
    sure: "30 dk",
    adaySayisi: 8,
    date: "20 Şub 2026",
  },
  {
    id: "TST-003",
    title: "İnsan Kaynakları — İşe Alım Yetkinlik Testi",
    sektor: "Tüm Sektörler",
    meslek: "İnsan Kaynakları Uzmanı",
    source: "template",
    status: "aktif",
    soruSayisi: 25,
    sure: "60 dk",
    adaySayisi: 34,
    date: "15 Oca 2026",
  },
  {
    id: "TST-004",
    title: "Satış Mühendisi — Müşteri Yönetimi Testi",
    sektor: "Teknoloji",
    meslek: "Satış Mühendisi",
    source: "custom",
    status: "taslak",
    soruSayisi: 10,
    sure: null,
    adaySayisi: 0,
    date: "3 Mar 2026",
  },
  {
    id: "TST-005",
    title: "Lojistik Koordinatör — Operasyon Testi",
    sektor: "Lojistik ve Taşımacılık",
    meslek: "Lojistik Koordinatör",
    source: "template",
    status: "arsiv",
    soruSayisi: 18,
    sure: "40 dk",
    adaySayisi: 22,
    date: "10 Ara 2025",
  },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "Analitik Düşünme & Problem Çözme",
    category: "Genel Yetkinlik",
    sektor: "Tüm Sektörler",
    soruSayisi: 20,
    sure: "30 dk",
    difficulty: "Orta",
    aciklama: "Mantıksal akıl yürütme, sayısal analiz ve problem çözme becerilerini ölçen kapsamlı yetkinlik testi.",
    kullananSayisi: 1240,
    puan: 4.8,
  },
  {
    id: "t2",
    title: "İletişim & Takım Çalışması",
    category: "Genel Yetkinlik",
    sektor: "Tüm Sektörler",
    soruSayisi: 15,
    sure: "20 dk",
    difficulty: "Kolay",
    aciklama: "Sözlü ve yazılı iletişim, aktif dinleme ve ekip içi işbirliği davranışlarını değerlendiren test.",
    kullananSayisi: 980,
    puan: 4.6,
  },
  {
    id: "t3",
    title: "Liderlik & Karar Verme",
    category: "Genel Yetkinlik",
    sektor: "Tüm Sektörler",
    soruSayisi: 25,
    sure: "40 dk",
    difficulty: "İleri",
    aciklama: "Stratejik düşünme, delegasyon, kriz yönetimi ve veriye dayalı karar alma yetkinliklerini ölçer.",
    kullananSayisi: 620,
    puan: 4.9,
  },
  {
    id: "t4",
    title: "Finans Temel Yetkinlik Testi",
    category: "Sektörel",
    sektor: "Finans ve Bankacılık",
    soruSayisi: 20,
    sure: "35 dk",
    difficulty: "Orta",
    aciklama: "Finansal raporlama, muhasebe ilkeleri, bütçe yönetimi ve risk analizi konularını kapsar.",
    kullananSayisi: 450,
    puan: 4.7,
  },
  {
    id: "t5",
    title: "Yazılım Geliştirici Teknik Değerlendirme",
    category: "Sektörel",
    sektor: "Bilişim Teknolojileri",
    soruSayisi: 30,
    sure: "60 dk",
    difficulty: "İleri",
    aciklama: "Algoritma, veri yapıları, yazılım mimarisi ve kod kalitesi konularında derinlemesine teknik test.",
    kullananSayisi: 890,
    puan: 4.9,
  },
  {
    id: "t6",
    title: "Perakende Sektörü Satış Yetkinlikleri",
    category: "Sektörel",
    sektor: "Perakende",
    soruSayisi: 18,
    sure: "25 dk",
    difficulty: "Kolay",
    aciklama: "Müşteri deneyimi, ürün bilgisi, satış teknikleri ve şikayet yönetimi senaryolarını içerir.",
    kullananSayisi: 320,
    puan: 4.4,
  },
  {
    id: "t7",
    title: "Satış Temsilcisi İşe Alım Testi",
    category: "Pozisyon Bazlı",
    sektor: "Tüm Sektörler",
    soruSayisi: 20,
    sure: "30 dk",
    difficulty: "Orta",
    aciklama: "Satış psikolojisi, ikna teknikleri, müzakere becerileri ve CRM süreçlerini değerlendiren işe alım testi.",
    kullananSayisi: 760,
    puan: 4.7,
  },
  {
    id: "t8",
    title: "İK Uzmanı Yetkinlik Değerlendirmesi",
    category: "Pozisyon Bazlı",
    sektor: "Tüm Sektörler",
    soruSayisi: 22,
    sure: "35 dk",
    difficulty: "Orta",
    aciklama: "İşe alım süreçleri, performans yönetimi, iş hukuku ve insan kaynakları uygulamalarını kapsar.",
    kullananSayisi: 540,
    puan: 4.6,
  },
  {
    id: "t9",
    title: "Genel Mülakat Hazırlık Testi",
    category: "Mülakat Hazırlık",
    sektor: "Tüm Sektörler",
    soruSayisi: 15,
    sure: "20 dk",
    difficulty: "Kolay",
    aciklama: "Adayların mülakat öncesi hazırlanması için davranışsal sorular, STAR tekniği ve sık sorulan sorular.",
    kullananSayisi: 2100,
    puan: 4.8,
  },
  {
    id: "t10",
    title: "Yönetici Pozisyonu Mülakat Simülasyonu",
    category: "Mülakat Hazırlık",
    sektor: "Tüm Sektörler",
    soruSayisi: 18,
    sure: "30 dk",
    difficulty: "İleri",
    aciklama: "Üst düzey pozisyonlar için stratejik düşünme, kriz yönetimi ve liderlik senaryoları içerir.",
    kullananSayisi: 380,
    puan: 4.9,
  },
  // ── Vaka Analizi ────────────────────────────────────────────────────────────
  {
    id: "v1",
    title: "Tedarik Zinciri Krizi — Operasyon Vakası",
    category: "Vaka Analizi",
    sektor: "Lojistik ve Taşımacılık",
    soruSayisi: 12,
    sure: "25 dk",
    difficulty: "İleri",
    aciklama: "Küresel tedarik zinciri aksaklığı senaryosunda kriz yönetimi, önceliklendirme ve karar alma yetkinlikleri ölçülür.",
    kullananSayisi: 310,
    puan: 4.8,
    isVaka: true,
  },
  {
    id: "v2",
    title: "Banka Şubesi Müşteri Şikayeti — Finans Vakası",
    category: "Vaka Analizi",
    sektor: "Finans ve Bankacılık",
    soruSayisi: 10,
    sure: "20 dk",
    difficulty: "Orta",
    aciklama: "Müşteri şikayeti yönetimi, etik karar alma ve kurumsal prosedürlere uyum senaryosu.",
    kullananSayisi: 220,
    puan: 4.6,
    isVaka: true,
  },
  {
    id: "v3",
    title: "Yazılım Projesi Gecikmesi — IT Yönetim Vakası",
    category: "Vaka Analizi",
    sektor: "Bilişim Teknolojileri",
    soruSayisi: 14,
    sure: "30 dk",
    difficulty: "İleri",
    aciklama: "Proje yönetimi hatası senaryosunda liderlik, paydaş iletişimi ve kurtarma planı geliştirme yetkinlikleri.",
    kullananSayisi: 185,
    puan: 4.9,
    isVaka: true,
  },
  {
    id: "v4",
    title: "Yeni Çalışan Uyum Sorunu — İK Vakası",
    category: "Vaka Analizi",
    sektor: "Tüm Sektörler",
    soruSayisi: 10,
    sure: "20 dk",
    difficulty: "Kolay",
    aciklama: "Onboarding sürecinde ekip çatışması ve performans sorununun yönetildiği gerçekçi İK senaryosu.",
    kullananSayisi: 290,
    puan: 4.5,
    isVaka: true,
  },
];

const TABS = ["Tümü", "Oluşturulan", "Hazır Şablonlar", "Arşiv"] as const;
type Tab = (typeof TABS)[number];

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Genel Yetkinlik",
  "Sektörel",
  "Pozisyon Bazlı",
  "Mülakat Hazırlık",
  "Vaka Analizi",
];

const STATUS_COLORS: Record<TestStatus, string> = {
  aktif: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  taslak: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  arsiv: "bg-zinc-700/40 text-zinc-500 border-zinc-700",
};

const STATUS_LABELS: Record<TestStatus, string> = {
  aktif: "Aktif",
  taslak: "Taslak",
  arsiv: "Arşiv",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Kolay: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Orta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  İleri: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ─── Component ────────────────────────────────────────────────────────────────

function loadTests(): Test[] {
  try {
    const saved = JSON.parse(localStorage.getItem("sb_tests") || "[]") as Test[];
    const savedIds = new Set(saved.map((t) => t.id));
    return [...saved, ...MOCK_TESTS.filter((t) => !savedIds.has(t.id))];
  } catch {
    return MOCK_TESTS;
  }
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>(() => {
    if (typeof window === "undefined") return MOCK_TESTS;
    return loadTests();
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Tümü");
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory | "Tümü">("Tümü");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "Tümü">("Tümü");
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<Test | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; status: TestStatus }>({ title: "", status: "aktif" });

  const isLibrary = activeTab === "Hazır Şablonlar";

  function handleDelete(id: string) {
    setTests((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        const saved = JSON.parse(localStorage.getItem("sb_tests") || "[]") as Test[];
        localStorage.setItem("sb_tests", JSON.stringify(saved.filter((t) => t.id !== id)));
      } catch {}
      return next;
    });
  }

  function handleDownload(id: string) {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  }

  function openEdit(test: Test) {
    setEditForm({ title: test.title, status: test.status });
    setEditModal(test);
  }

  function saveEdit() {
    if (!editModal || !editForm.title.trim()) return;
    setTests((prev) => {
      const next = prev.map((t) => t.id === editModal.id ? { ...t, ...editForm } : t);
      try {
        const saved = JSON.parse(localStorage.getItem("sb_tests") || "[]") as Test[];
        const merged = saved.map((t: Test) => t.id === editModal.id ? { ...t, ...editForm } : t);
        if (!merged.find((t: Test) => t.id === editModal.id)) merged.push({ ...editModal, ...editForm });
        localStorage.setItem("sb_tests", JSON.stringify(merged));
      } catch {}
      return next;
    });
    setEditModal(null);
  }

  const filtered = tests.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.meslek.toLowerCase().includes(search.toLowerCase()) ||
      t.sektor.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "Tümü" ||
      (activeTab === "Oluşturulan" && t.source === "custom") ||
      (activeTab === "Arşiv" && t.status === "arsiv");
    return matchSearch && matchTab;
  });

  const filteredTemplates = MOCK_TEMPLATES.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.sektor.toLowerCase().includes(search.toLowerCase());
    const matchCat = templateCategory === "Tümü" || t.category === templateCategory;
    const matchDiff = difficultyFilter === "Tümü" || t.difficulty === difficultyFilter;
    return matchSearch && matchCat && matchDiff;
  });

  const aktifCount = tests.filter((t) => t.status === "aktif").length;
  const totalAdaylar = tests.reduce((s, t) => s + t.adaySayisi, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Testler</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {isLibrary
              ? `${MOCK_TEMPLATES.length} hazır şablon · hızlıca test başlatın`
              : `${tests.length} test · ${aktifCount} aktif · ${totalAdaylar} aday katıldı`}
          </p>
        </div>
        <Link
          href="/tests/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Test Oluştur
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isLibrary ? "Şablon veya sektör ara…" : "Test veya meslek ara…"}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                activeTab === t
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Library view ───────────────────────────────────────────────────── */}
      {isLibrary && (
        <>
          {/* Seviye Tespit Sınavı banner */}
          <SeviyeTespitBanner />

          {/* Category + difficulty filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-xs text-zinc-500 whitespace-nowrap">Kategori:</span>
            </div>
            {(["Tümü", ...TEMPLATE_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateCategory(cat as TemplateCategory | "Tümü")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap",
                  cat === "Vaka Analizi"
                    ? templateCategory === cat
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                      : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-violet-500/30 hover:text-violet-400"
                    : templateCategory === cat
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                    : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                {cat === "Vaka Analizi" ? "🗂 Vaka Analizi" : cat}
              </button>
            ))}
            <div className="w-px h-4 bg-zinc-800 mx-1" />
            {(["Tümü", "Kolay", "Orta", "İleri"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d as Difficulty | "Tümü")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap",
                  difficultyFilter === d
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                    : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Template grid */}
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Sparkles className="w-10 h-10 text-zinc-700" />
              <p className="text-zinc-500 text-sm">Eşleşen şablon bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredTemplates.map((tpl) =>
                tpl.isVaka ? (
                  <VakaCard key={tpl.id} template={tpl} />
                ) : (
                  <TemplateCard key={tpl.id} template={tpl} />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* ── Düzenle Modal ──────────────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Test Düzenle</h2>
              <button onClick={() => setEditModal(null)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Test Başlığı</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Durum</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as TestStatus }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="aktif">Aktif</option>
                  <option value="taslak">Taslak</option>
                  <option value="arsiv">Arşiv</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditModal(null)} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">İptal</button>
              <button onClick={saveEdit} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── My tests view ──────────────────────────────────────────────────── */}
      {!isLibrary && (
        <>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <ClipboardList className="w-10 h-10 text-zinc-700" />
              <p className="text-zinc-500 text-sm">Eşleşen test bulunamadı.</p>
            </div>
          )}
          {filtered.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[90px_1fr_150px_160px_90px_70px_170px] gap-0 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">ID No</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Test</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Konu</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sektör</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Boyut</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Tarih</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">İşlemler</span>
              </div>
              {filtered.map((test, idx) => (
                <TestRow
                  key={test.id}
                  test={test}
                  downloaded={downloadedId === test.id}
                  onDelete={() => handleDelete(test.id)}
                  onDownload={() => handleDownload(test.id)}
                  onEdit={() => openEdit(test)}
                  isLast={idx === filtered.length - 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Seviye Tespit Sınavı Banner ─────────────────────────────────────────────

function SeviyeTespitBanner() {
  const [jd, setJd] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/60 via-zinc-900 to-zinc-900 p-5">
      {/* Background glow */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white">Seviye Tespit Sınavı</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/25 font-semibold">
              AI Destekli
            </span>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium">
              <Coins className="w-3 h-3" /> 100 kontör
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Görev tanımını (JD) yapıştırın — Claude o pozisyona özel vaka ve doğrulama sorularını anında oluşturur. Test anında adaya gönderilebilir veya kütüphaneye kaydedilebilir.
          </p>

          {/* Feature badges */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {["Doğruluk Puanı", "Tutarlılık Analizi", "AI Raporu", "Kariyer Planlaması"].map((f) => (
              <span key={f} className="flex items-center gap-1 text-[10px] text-zinc-500">
                <CheckCircle2 className="w-3 h-3 text-violet-400" />
                {f}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 px-3 py-2 text-xs font-semibold bg-violet-500 hover:bg-violet-400 text-white rounded-xl transition-colors"
        >
          {expanded ? "Kapat" : "Başlat"}
        </button>
      </div>

      {/* Expandable JD input */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="w-full h-px bg-violet-500/15" />
          <label className="text-xs text-zinc-400 font-medium">
            Görev Tanımı (Job Description)
          </label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Pozisyon adı, sorumluluklar, aranan yetkinlikler ve deneyim beklentilerini buraya yapıştırın…"
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-600">
              {jd.length > 0 ? `${jd.length} karakter` : "En az 100 karakter önerilir"}
            </p>
            <button
              disabled={jd.trim().length < 50}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Test Oluştur (100 kontör)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Vaka card ────────────────────────────────────────────────────────────────

function VakaCard({ template: tpl }: { template: Template }) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function kullan() {
    const yeniTest: Test = {
      id: `TPL-${tpl.id}-${Date.now()}`,
      title: tpl.title,
      sektor: tpl.sektor,
      meslek: tpl.category,
      source: "template",
      status: "aktif",
      soruSayisi: tpl.soruSayisi,
      sure: tpl.sure,
      adaySayisi: 0,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    };
    try {
      const saved = JSON.parse(localStorage.getItem("sb_tests") || "[]") as Test[];
      localStorage.setItem("sb_tests", JSON.stringify([yeniTest, ...saved]));
    } catch {}
    setAdded(true);
    setTimeout(() => router.push("/tests"), 800);
  }

  return (
    <div className="group flex flex-col gap-4 p-5 bg-zinc-900 border border-violet-500/20 rounded-2xl hover:border-violet-500/35 transition-colors">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl border border-violet-500/25 bg-violet-500/10 flex items-center justify-center shrink-0">
          <FileSearch className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 font-semibold uppercase tracking-wide">
            Vaka Analizi
          </span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", DIFFICULTY_COLORS[tpl.difficulty])}>
            {tpl.difficulty}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{tpl.title}</p>
        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{tpl.aciklama}</p>
      </div>

      {/* Scoring info */}
      <div className="flex items-center gap-2 bg-zinc-800/60 rounded-lg px-3 py-2">
        <BarChart className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        <span className="text-[11px] text-zinc-400">
          <span className="text-zinc-300 font-medium">Evet / Hayır</span> · Doğruluk + Tutarlılık puanı
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <ClipboardList className="w-3 h-3" />
          {tpl.soruSayisi} soru
        </span>
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {tpl.sure}
        </span>
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <Coins className="w-3 h-3" />
          {tpl.soruSayisi} kontör
        </span>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-zinc-500">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-zinc-300 font-medium">{tpl.puan}</span>
          <span className="text-zinc-600">·</span>
          <Users className="w-3 h-3" />
          {tpl.kullananSayisi}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          <Eye className="w-3.5 h-3.5" />
          Önizle
        </button>
        <button
          onClick={kullan}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
            added
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-violet-500 hover:bg-violet-400 text-white"
          )}
        >
          {added ? (
            <><ChevronRight className="w-3.5 h-3.5" /> Kütüphanede</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Bu Testi Kullan</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({ template: tpl }: { template: Template }) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function kullan() {
    const yeniTest: Test = {
      id: `TPL-${tpl.id}-${Date.now()}`,
      title: tpl.title,
      sektor: tpl.sektor,
      meslek: tpl.category,
      source: "template",
      status: "aktif",
      soruSayisi: tpl.soruSayisi,
      sure: tpl.sure,
      adaySayisi: 0,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
    };
    try {
      const saved = JSON.parse(localStorage.getItem("sb_tests") || "[]") as Test[];
      localStorage.setItem("sb_tests", JSON.stringify([yeniTest, ...saved]));
    } catch {}
    setAdded(true);
    setTimeout(() => router.push("/tests"), 800);
  }

  return (
    <div className="group flex flex-col gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl border border-indigo-500/20 bg-indigo-500/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </div>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", DIFFICULTY_COLORS[tpl.difficulty])}>
          {tpl.difficulty}
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{tpl.title}</p>
        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{tpl.aciklama}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] text-zinc-500 border border-zinc-800 rounded-md px-2 py-0.5">
          {tpl.category}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
          <ClipboardList className="w-3 h-3" />
          {tpl.soruSayisi} soru
        </span>
        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
          <Clock className="w-3 h-3" />
          {tpl.sure}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
          <Coins className="w-3 h-3" />
          {tpl.soruSayisi} kontör
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-zinc-300 font-medium">{tpl.puan}</span>
        <span className="text-zinc-600">·</span>
        <Users className="w-3 h-3" />
        <span>{tpl.kullananSayisi.toLocaleString("tr-TR")} kullanım</span>
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          <Eye className="w-3.5 h-3.5" />
          Önizle
        </button>
        <button
          onClick={kullan}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
            added
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-indigo-500 hover:bg-indigo-400 text-white"
          )}
        >
          {added ? (
            <><ChevronRight className="w-3.5 h-3.5" /> Kütüphanede</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Bu Testi Kullan</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Test row ─────────────────────────────────────────────────────────────────

function TestRow({
  test,
  downloaded,
  onDelete,
  onDownload,
  onEdit,
  isLast,
}: {
  test: Test;
  downloaded: boolean;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  isLast: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "group grid grid-cols-[90px_1fr_150px_160px_90px_70px_170px] gap-0 px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800/60 transition-colors items-center",
        !isLast && "border-b border-zinc-800/60"
      )}
    >
      {/* ID */}
      <span className="text-xs font-mono text-zinc-500">{test.id}</span>

      {/* Title + status */}
      <div className="flex items-center gap-2.5 min-w-0 pr-4">
        <div className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
          {test.source === "template"
            ? <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            : <ClipboardList className="w-3.5 h-3.5 text-zinc-400" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate">{test.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", STATUS_COLORS[test.status])}>
              {STATUS_LABELS[test.status]}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-zinc-600">
              <Users className="w-3 h-3" />
              {test.adaySayisi}
            </span>
          </div>
        </div>
      </div>

      {/* Konu / meslek */}
      <p className="text-xs text-zinc-400 truncate pr-4">{test.meslek}</p>

      {/* Sektör */}
      <p className="text-xs text-zinc-400 truncate pr-4">{test.sektor}</p>

      {/* Boyut */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <ClipboardList className="w-3 h-3" />
          {test.soruSayisi} soru
        </span>
        {test.sure && (
          <span className="text-[10px] text-zinc-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {test.sure}
          </span>
        )}
      </div>

      {/* Tarih */}
      <p className="text-xs text-zinc-500">{test.date}</p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-0.5">
        <button
          className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          title="Görüntüle"
          onClick={() => router.push(`/tests/${test.id}`)}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Düzenle"
          onClick={onEdit}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <Link
          href="/tests/new"
          className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Yeni Test Oluştur"
        >
          <Plus className="w-3.5 h-3.5" />
        </Link>
        <button
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            downloaded
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-zinc-500 hover:text-white hover:bg-zinc-700"
          )}
          title="İndir"
          onClick={onDownload}
        >
          {downloaded
            ? <CheckCircle2 className="w-3.5 h-3.5" />
            : <Download className="w-3.5 h-3.5" />
          }
        </button>
        <button
          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Sil"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
