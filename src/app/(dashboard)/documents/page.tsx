"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  FileText,
  Sparkles,
  Eye,
  Download,
  Trash2,
  ClipboardList,
  LayoutGrid,
  List,
  Check,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

type DocSource = "upload" | "ai";
type DocStatus = "aktif" | "taslak";

interface Doc {
  id: string;
  title: string;
  topic: string;
  sector: string;
  category: string;
  source: DocSource;
  status: DocStatus;
  format: string;
  size: string;
  date: string;
  href?: string;
}

const INITIAL_DOCS: Doc[] = [
  {
    id: "DOC-001",
    title: "Tedarik Zinciri Müdürü — RACI & Yetkinlik Formu",
    topic: "RACI Matrisi, Yetkinlik Değerlendirme",
    sector: "Lojistik & Tedarik",
    category: "RACI / Süreç",
    source: "upload",
    status: "aktif",
    format: "HTML",
    size: "248 KB",
    date: "12 Şub 2026",
    href: "/tedarik-zinciri-raci.html",
  },
  {
    id: "DOC-002",
    title: "Satış Mühendisleri İçin Müşteri Yönetimi El Kitabı",
    topic: "Müşteri İlişkileri, Satış Süreçleri",
    sector: "Satış & Pazarlama",
    category: "İş Tanımı",
    source: "ai",
    status: "aktif",
    format: "DOCX",
    size: "184 KB",
    date: "28 Oca 2026",
  },
  {
    id: "DOC-003",
    title: "Finans Departmanı Yetkinlik Çerçevesi",
    topic: "Finansal Analiz, Bütçe Yönetimi",
    sector: "Finans & Muhasebe",
    category: "Yetkinlik Çerçevesi",
    source: "upload",
    status: "aktif",
    format: "PDF",
    size: "1.2 MB",
    date: "15 Oca 2026",
  },
  {
    id: "DOC-004",
    title: "Yazılım Geliştirici İş Tanımı Şablonu",
    topic: "Yazılım Mühendisliği, Agile, DevOps",
    sector: "Bilgi Teknolojileri",
    category: "İş Tanımı",
    source: "ai",
    status: "taslak",
    format: "DOCX",
    size: "96 KB",
    date: "3 Mar 2026",
  },
  {
    id: "DOC-005",
    title: "İK Politika ve Prosedürler Rehberi",
    topic: "İşe Alım, Performans Yönetimi",
    sector: "İnsan Kaynakları",
    category: "Politika & Prosedür",
    source: "upload",
    status: "aktif",
    format: "PDF",
    size: "2.4 MB",
    date: "20 Ara 2025",
  },
];

const TABS = ["Tümü", "Yüklenen", "AI ile Oluşturulan"] as const;
type Tab = (typeof TABS)[number];

// ─── Component ────────────────────────────────────────────────────────────────

function loadDocs(): Doc[] {
  try {
    const saved = JSON.parse(localStorage.getItem("sb_docs") || "[]") as Doc[];
    const savedIds = new Set(saved.map((d) => d.id));
    return [...saved, ...INITIAL_DOCS.filter((d) => !savedIds.has(d.id))];
  } catch {
    return INITIAL_DOCS;
  }
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>(() => {
    if (typeof window === "undefined") return INITIAL_DOCS;
    return loadDocs();
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Tümü");
  const [view, setView] = useState<"grid" | "list">("list");
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.topic.toLowerCase().includes(search.toLowerCase()) ||
      d.sector.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "Tümü" ||
      (activeTab === "Yüklenen" && d.source === "upload") ||
      (activeTab === "AI ile Oluşturulan" && d.source === "ai");
    return matchSearch && matchTab;
  });

  function handleDelete(id: string) {
    setDocs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      try {
        const saved = JSON.parse(localStorage.getItem("sb_docs") || "[]") as Doc[];
        localStorage.setItem("sb_docs", JSON.stringify(saved.filter((d) => d.id !== id)));
      } catch {}
      return next;
    });
  }

  function handleDownload(id: string) {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dokümanlar</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {docs.length} doküman · kütüphanenizi yönetin
          </p>
        </div>
        <Link
          href="/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Doküman Ekle
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
            placeholder="Doküman, konu veya sektör ara…"
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
                activeTab === t ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "list" ? "bg-zinc-700 text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "grid" ? "bg-zinc-700 text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <FileText className="w-10 h-10 text-zinc-700" />
          <p className="text-zinc-500 text-sm">Eşleşen doküman bulunamadı.</p>
        </div>
      )}

      {/* List view — table */}
      {view === "list" && filtered.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_160px_160px_80px_80px_160px] gap-0 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">ID No</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Doküman</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Konu</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sektör</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Boyut</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Tarih</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">İşlemler</span>
          </div>

          {/* Rows */}
          {filtered.map((doc, idx) => (
            <DocTableRow
              key={doc.id}
              doc={doc}
              downloaded={downloadedId === doc.id}
              onDelete={() => handleDelete(doc.id)}
              onDownload={() => handleDownload(doc.id)}
              isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((doc) => (
            <DocGridCard
              key={doc.id}
              doc={doc}
              downloaded={downloadedId === doc.id}
              onDelete={() => handleDelete(doc.id)}
              onDownload={() => handleDownload(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

function DocTableRow({
  doc,
  downloaded,
  onDelete,
  onDownload,
  isLast,
}: {
  doc: Doc;
  downloaded: boolean;
  onDelete: () => void;
  onDownload: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[80px_1fr_160px_160px_80px_80px_160px] gap-0 px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800/60 transition-colors items-center",
        !isLast && "border-b border-zinc-800/60"
      )}
    >
      {/* ID */}
      <span className="text-xs font-mono text-zinc-500">{doc.id}</span>

      {/* Title + format badge */}
      <div className="flex items-center gap-2.5 min-w-0 pr-4">
        <div className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
          {doc.source === "ai"
            ? <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            : <FileText className="w-3.5 h-3.5 text-zinc-400" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate">{doc.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-zinc-600">{doc.format}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full border",
                doc.status === "aktif"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-zinc-700/40 text-zinc-500 border-zinc-700"
              )}
            >
              {doc.status === "aktif" ? "Aktif" : "Taslak"}
            </span>
          </div>
        </div>
      </div>

      {/* Topic */}
      <p className="text-xs text-zinc-400 truncate pr-4">{doc.topic}</p>

      {/* Sector */}
      <p className="text-xs text-zinc-400 truncate pr-4">{doc.sector}</p>

      {/* Size */}
      <p className="text-xs text-zinc-500">{doc.size}</p>

      {/* Date */}
      <p className="text-xs text-zinc-500">{doc.date}</p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-0.5">
        {doc.href ? (
          <a
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            title="Görüntüle"
          >
            <Eye className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            title="Görüntüle"
            onClick={() => alert(`"${doc.title}" için önizleme mevcut değil.`)}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Düzenle"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <Link
          href="/tests/new"
          className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Test Oluştur"
        >
          <ClipboardList className="w-3.5 h-3.5" />
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
          {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
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

// ─── Grid card ────────────────────────────────────────────────────────────────

function DocGridCard({
  doc,
  downloaded,
  onDelete,
  onDownload,
}: {
  doc: Doc;
  downloaded: boolean;
  onDelete: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="group flex flex-col gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
          {doc.source === "ai"
            ? <Sparkles className="w-4 h-4 text-indigo-400" />
            : <FileText className="w-4 h-4 text-zinc-400" />
          }
        </div>
        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border",
            doc.status === "aktif"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-zinc-700/40 text-zinc-500 border-zinc-700"
          )}
        >
          {doc.status === "aktif" ? "Aktif" : "Taslak"}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-zinc-600">{doc.id}</p>
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2 mt-0.5">{doc.title}</p>
        <p className="text-xs text-zinc-500 mt-1">{doc.topic}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{doc.sector}</p>
        <p className="text-xs text-zinc-600 mt-1">{doc.format} · {doc.size} · {doc.date}</p>
      </div>

      <div className="flex items-center gap-1 border-t border-zinc-800 pt-3">
        {doc.href ? (
          <a
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Görüntüle
          </a>
        ) : (
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => alert(`"${doc.title}" için önizleme mevcut değil.`)}
          >
            <Eye className="w-3.5 h-3.5" /> Görüntüle
          </button>
        )}
        <button className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors" title="Düzenle">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <Link
          href="/tests/new"
          className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Test Oluştur"
        >
          <ClipboardList className="w-3.5 h-3.5" />
        </Link>
        <button
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            downloaded
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-zinc-600 hover:text-white hover:bg-zinc-800"
          )}
          title="İndir"
          onClick={onDownload}
        >
          {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        </button>
        <button
          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Sil"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
