"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import {
  Plus, Trash2, Pencil, X, Upload, Download, FileText, FolderOpen, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDocuments, createDocument, updateDocument, deleteDocument,
  uploadDocumentFile, getDocumentDownloadUrl,
} from "../actions";
import type { IsmsDocument, DocStatus, CreateDocument } from "@/lib/types/isms";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; text: string; border: string }> = {
  draft:    { label: "Taslak",      bg: "bg-zinc-800",      text: "text-zinc-400",   border: "border-zinc-700" },
  review:   { label: "İncelemede", bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/25" },
  approved: { label: "Onaylı",     bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/25" },
  obsolete: { label: "Geçersiz",   bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/25" },
};

const FOLDERS = [
  { code: "00", name: "Politikalar" },
  { code: "01", name: "Prosedürler" },
  { code: "02", name: "Formlar" },
  { code: "03", name: "Sözleşmeler" },
  { code: "04", name: "Raporlar Listeler Tablolar" },
  { code: "05", name: "Uygulanabilirlik Bildirgesi" },
  { code: "06", name: "Organizasyon" },
  { code: "07", name: "El Kitabı ve Kılavuzlar" },
  { code: "08", name: "Planlar" },
  { code: "09", name: "Talimatlar" },
  { code: "10", name: "Kişisel Bilgilerin Gizliliği ve Korunması" },
  { code: "12", name: "İş Süreçleri" },
  { code: "13", name: "Toplantı Notları" },
  { code: "14", name: "Dinamik Dokümanlar" },
  { code: "19", name: "Eski Revizyonlar" },
  { code: "20", name: "Dış Dokümanlar" },
  { code: "21", name: "Tedarikçi Dokümanları" },
  { code: "98", name: "Uygulamalar" },
];

const emptyForm = (): CreateDocument => ({
  folder_code: "00",
  folder_name: "Politikalar",
  subfolder: null,
  name: "",
  file_path: null,
  file_size: null,
  mime_type: null,
  version: "1.0",
  doc_status: "draft",
  owner: null,
  related_controls: [],
  tags: [],
});

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BelgelerPage() {
  const [docs, setDocs] = useState<IsmsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateDocument>(emptyForm());
  const [search, setSearch] = useState("");
  const [filterFolder, setFilterFolder] = useState<string | "all">("all");
  const [filterStatus, setFilterStatus] = useState<DocStatus | "all">("all");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDocuments().then((res) => {
      if (res.ok) setDocs(res.data);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  const openCreate = () => { setForm(emptyForm()); setEditingId(null); setShowForm(true); };
  const openEdit = (doc: IsmsDocument) => {
    setForm({
      folder_code: doc.folder_code, folder_name: doc.folder_name,
      subfolder: doc.subfolder, name: doc.name, file_path: doc.file_path,
      file_size: doc.file_size, mime_type: doc.mime_type, version: doc.version,
      doc_status: doc.doc_status, owner: doc.owner,
      related_controls: doc.related_controls, tags: doc.tags,
    });
    setEditingId(doc.id);
    setShowForm(true);
  };

  const field = <K extends keyof CreateDocument>(k: K, v: CreateDocument[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleFolderChange = (code: string) => {
    const folder = FOLDERS.find(f => f.code === code)!;
    setForm(f => ({ ...f, folder_code: code, folder_name: folder.name }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    startTransition(async () => {
      if (editingId) {
        const res = await updateDocument(editingId, form);
        if (res.ok) setDocs(prev => prev.map(d => d.id === editingId ? res.data : d));
      } else {
        const res = await createDocument(form);
        if (res.ok) setDocs(prev => [res.data, ...prev]);
      }
      setShowForm(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteDocument(id);
      if (res.ok) setDocs(prev => prev.filter(d => d.id !== id));
    });
  };

  const handleUpload = (docId: string, file: File) => {
    setUploadingId(docId);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadDocumentFile(docId, fd);
      if (res.ok) {
        setDocs(prev => prev.map(d => d.id === docId
          ? { ...d, file_path: res.data.file_path, file_size: res.data.file_size, mime_type: res.data.mime_type }
          : d
        ));
      }
      setUploadingId(null);
    });
  };

  const handleDownload = (filePath: string) => {
    startTransition(async () => {
      const res = await getDocumentDownloadUrl(filePath);
      if (res.ok) window.open(res.data, "_blank");
    });
  };

  const filtered = docs.filter(d => {
    if (filterFolder !== "all" && d.folder_code !== filterFolder) return false;
    if (filterStatus !== "all" && d.doc_status !== filterStatus) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group by folder
  const grouped = FOLDERS
    .map(f => ({ ...f, docs: filtered.filter(d => d.folder_code === f.code) }))
    .filter(g => g.docs.length > 0 || filterFolder === g.code);

  const stats = {
    total:    docs.length,
    approved: docs.filter(d => d.doc_status === "approved").length,
    review:   docs.filter(d => d.doc_status === "review").length,
    draft:    docs.filter(d => d.doc_status === "draft").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">Belgeler yükleniyor…</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Belge Yönetimi</h1>
          <p className="text-zinc-500 text-sm mt-1">ISO 27001:2022 — BGYS doküman kontrolü</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Belge Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Toplam",    value: stats.total,    bg: "bg-zinc-800 border-zinc-700",          text: "text-white" },
          { label: "Onaylı",   value: stats.approved, bg: "bg-green-500/10 border-green-500/20",   text: "text-green-400" },
          { label: "İnceleme", value: stats.review,   bg: "bg-amber-500/10 border-amber-500/20",   text: "text-amber-400" },
          { label: "Taslak",   value: stats.draft,    bg: "bg-zinc-800 border-zinc-700",            text: "text-zinc-400" },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.bg)}>
            <p className="text-zinc-500 text-xs">{s.label}</p>
            <p className={cn("text-2xl font-bold mt-1", s.text)}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Belge ara…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50" />
        </div>
        <select value={filterFolder} onChange={e => setFilterFolder(e.target.value)}
          className="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-sm focus:outline-none focus:border-indigo-500/50">
          <option value="all">Tüm Klasörler</option>
          {FOLDERS.map(f => <option key={f.code} value={f.code}>{f.code} — {f.name}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(["all","approved","review","draft","obsolete"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                filterStatus === s
                  ? s === "all" ? "bg-zinc-700 text-white border-zinc-600" : cn(STATUS_CONFIG[s as DocStatus].bg, STATUS_CONFIG[s as DocStatus].text, STATUS_CONFIG[s as DocStatus].border)
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600"
              )}>
              {s === "all" ? "Tümü" : STATUS_CONFIG[s as DocStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file && uploadingId) handleUpload(uploadingId, file);
          e.target.value = "";
        }} />

      {/* Document list grouped by folder */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {docs.length === 0 ? "Henüz belge eklenmedi." : "Kriterlere uygun belge bulunamadı."}
          </div>
        )}
        {grouped.filter(g => g.docs.length > 0).map(group => (
          <div key={group.code} className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/60 border-b border-zinc-800">
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-mono text-xs">{group.code}</span>
              <span className="text-white text-sm font-medium">{group.name}</span>
              <span className="ml-auto text-xs text-zinc-500">{group.docs.length} belge</span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {group.docs.map(doc => {
                const sc = STATUS_CONFIG[doc.doc_status];
                return (
                  <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/20 transition-colors group">
                    <FileText className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-zinc-200 text-sm">{doc.name}</span>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded border", sc.bg, sc.text, sc.border)}>{sc.label}</span>
                        <span className="text-zinc-600 text-xs">v{doc.version}</span>
                      </div>
                      <div className="flex gap-3 mt-0.5 text-xs text-zinc-600">
                        {doc.subfolder && <span>{doc.subfolder}</span>}
                        {doc.owner && <span>{doc.owner}</span>}
                        {doc.file_size && <span>{formatBytes(doc.file_size)}</span>}
                        {doc.related_controls.length > 0 && (
                          <span>{doc.related_controls.join(", ")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.file_path ? (
                        <button onClick={() => handleDownload(doc.file_path!)} disabled={isPending}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors" title="İndir">
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => { setUploadingId(doc.id); fileRef.current?.click(); }} disabled={isPending || uploadingId === doc.id}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-green-400 hover:bg-green-500/10 transition-colors" title="Dosya Yükle">
                          <Upload className={cn("w-4 h-4", uploadingId === doc.id && "animate-pulse")} />
                        </button>
                      )}
                      <button onClick={() => openEdit(doc)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} disabled={isPending}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white font-semibold">{editingId ? "Belgeyi Düzenle" : "Yeni Belge Ekle"}</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Folder */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Klasör *</label>
                <select value={form.folder_code} onChange={e => handleFolderChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                  {FOLDERS.map(f => <option key={f.code} value={f.code}>{f.code} — {f.name}</option>)}
                </select>
              </div>
              {/* Subfolder */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Alt Klasör</label>
                <input value={form.subfolder ?? ""} onChange={e => field("subfolder", e.target.value || null)}
                  placeholder="Alt klasör adı (isteğe bağlı)…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              {/* Name */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Belge Adı *</label>
                <input value={form.name} onChange={e => field("name", e.target.value)}
                  placeholder="Belge adı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              {/* Version & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Versiyon</label>
                  <input value={form.version} onChange={e => field("version", e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Durum</label>
                  <select value={form.doc_status} onChange={e => field("doc_status", e.target.value as DocStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Owner */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Sorumlu</label>
                <input value={form.owner ?? ""} onChange={e => field("owner", e.target.value || null)}
                  placeholder="Belge sahibi…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              {/* Related controls */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">İlgili Kontroller (virgülle)</label>
                <input value={form.related_controls.join(", ")}
                  onChange={e => field("related_controls", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="A.5.1, A.7.3…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              {/* Tags */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Etiketler (virgülle)</label>
                <input value={form.tags.join(", ")}
                  onChange={e => field("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="politika, onaylı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors">
                İptal
              </button>
              <button onClick={handleSubmit} disabled={isPending || !form.name.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {isPending ? "Kaydediliyor…" : editingId ? "Güncelle" : "Belge Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
