"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Plus, Trash2, Pencil, X, AlertTriangle, TrendingUp, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRisks, createRisk, updateRisk, deleteRisk } from "../actions";
import type { IsmsRisk, RiskLevel, RiskTreatment, RiskStatus, CreateRisk } from "@/lib/types/isms";

// ─── Config ───────────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<RiskLevel, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: "Kritik", bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/25" },
  high:     { label: "Yüksek", bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/25" },
  medium:   { label: "Orta",   bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/25" },
  low:      { label: "Düşük",  bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/25" },
};

const STATUS_CONFIG: Record<RiskStatus, { label: string; color: string }> = {
  open:         { label: "Açık",         color: "text-red-400" },
  in_treatment: { label: "İşleniyor",    color: "text-amber-400" },
  closed:       { label: "Kapalı",       color: "text-green-400" },
};

const TREATMENT_LABELS: Record<RiskTreatment, string> = {
  mitigate: "Azalt",
  accept:   "Kabul",
  transfer: "Transfer",
  avoid:    "Önle",
};

const SCALE = [1, 2, 3, 4, 5];

const MATRIX_COLOR = (score: number) => {
  if (score >= 15) return "bg-red-500";
  if (score >= 10) return "bg-orange-500";
  if (score >= 5)  return "bg-amber-400";
  return "bg-green-500";
};

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = (): CreateRisk => ({
  title: "", description: null, asset: null, threat: null, vulnerability: null,
  likelihood: 3, impact: 3, treatment: "mitigate", treatment_plan: null,
  owner: null, status: "open", target_date: null, related_controls: [],
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function RisklerPage() {
  const [risks, setRisks] = useState<IsmsRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateRisk>(emptyForm());
  const [filterLevel, setFilterLevel] = useState<RiskLevel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<RiskStatus | "all">("all");
  const [showMatrix, setShowMatrix] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getRisks().then((res) => {
      if (res.ok) setRisks(res.data);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  const openCreate = () => { setForm(emptyForm()); setEditingId(null); setShowForm(true); };
  const openEdit = (risk: IsmsRisk) => {
    setForm({
      title: risk.title, description: risk.description, asset: risk.asset,
      threat: risk.threat, vulnerability: risk.vulnerability,
      likelihood: risk.likelihood, impact: risk.impact,
      treatment: risk.treatment, treatment_plan: risk.treatment_plan,
      owner: risk.owner, status: risk.status, target_date: risk.target_date,
      related_controls: risk.related_controls,
    });
    setEditingId(risk.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    startTransition(async () => {
      if (editingId) {
        const res = await updateRisk(editingId, form);
        if (res.ok) setRisks(prev => prev.map(r => r.id === editingId ? res.data : r));
      } else {
        const res = await createRisk(form);
        if (res.ok) setRisks(prev => [res.data, ...prev]);
      }
      setShowForm(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteRisk(id);
      if (res.ok) setRisks(prev => prev.filter(r => r.id !== id));
    });
  };

  const field = <K extends keyof CreateRisk>(k: K, v: CreateRisk[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const filtered = risks.filter(r => {
    if (filterLevel !== "all" && r.risk_level !== filterLevel) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  // Stats
  const stats = {
    total:    risks.length,
    critical: risks.filter(r => r.risk_level === "critical").length,
    high:     risks.filter(r => r.risk_level === "high").length,
    open:     risks.filter(r => r.status === "open").length,
  };

  // Matrix data: for each (likelihood, impact) cell, collect risks
  const matrixCell = (l: number, imp: number) =>
    risks.filter(r => r.likelihood === l && r.impact === imp);

  if (loading) return <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">Risk kaydı yükleniyor…</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Risk Kaydı</h1>
          <p className="text-zinc-500 text-sm mt-1">ISO 27001:2022 — Bilgi güvenliği riskleri</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Risk Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Toplam Risk",   value: stats.total,    bg: "bg-zinc-800 border-zinc-700",           text: "text-white" },
          { label: "Kritik",        value: stats.critical, bg: "bg-red-500/10 border-red-500/20",        text: "text-red-400" },
          { label: "Yüksek",        value: stats.high,     bg: "bg-orange-500/10 border-orange-500/20",  text: "text-orange-400" },
          { label: "Açık Risk",     value: stats.open,     bg: "bg-amber-500/10 border-amber-500/20",    text: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.bg)}>
            <p className="text-zinc-500 text-xs">{s.label}</p>
            <p className={cn("text-2xl font-bold mt-1", s.text)}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}

      {/* Risk Matrix toggle */}
      <button
        onClick={() => setShowMatrix(v => !v)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <TrendingUp className="w-4 h-4" />
        {showMatrix ? "Matrisi Gizle" : "5×5 Risk Matrisini Göster"}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showMatrix && "rotate-180")} />
      </button>

      {/* 5×5 Risk Matrix */}
      {showMatrix && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <p className="text-sm font-medium text-white">Risk Matrisi (Olasılık × Etki)</p>
          <div className="overflow-x-auto">
            <table className="text-xs border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-zinc-600 w-24 text-right pr-2">Olasılık ↕ Etki →</th>
                  {SCALE.map(imp => <th key={imp} className="text-zinc-500 w-16 text-center">{imp}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...SCALE].reverse().map(l => (
                  <tr key={l}>
                    <td className="text-zinc-500 text-right pr-2">{l}</td>
                    {SCALE.map(imp => {
                      const score = l * imp;
                      const cell = matrixCell(l, imp);
                      return (
                        <td key={imp} className={cn("rounded-lg w-16 h-12 text-center align-middle", MATRIX_COLOR(score), "bg-opacity-25")}>
                          {cell.length > 0 && (
                            <span className="text-white font-bold">{cell.length}</span>
                          )}
                          <span className="block text-white/40 text-[10px]">{score}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 text-xs text-zinc-500">
            {(["critical","high","medium","low"] as RiskLevel[]).map(l => {
              const c = LEVEL_CONFIG[l];
              return <span key={l} className={cn("px-2 py-0.5 rounded border", c.bg, c.text, c.border)}>{c.label}</span>;
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all","critical","high","medium","low"] as const).map(l => (
          <button key={l} onClick={() => setFilterLevel(l)}
            className={cn("text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
              filterLevel === l
                ? l === "all" ? "bg-zinc-700 text-white border-zinc-600" : cn(LEVEL_CONFIG[l as RiskLevel].bg, LEVEL_CONFIG[l as RiskLevel].text, LEVEL_CONFIG[l as RiskLevel].border)
                : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600"
            )}>
            {l === "all" ? "Tümü" : LEVEL_CONFIG[l as RiskLevel].label}
          </button>
        ))}
        <div className="w-px h-6 bg-zinc-800 self-center" />
        {(["all","open","in_treatment","closed"] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn("text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
              filterStatus === s
                ? "bg-zinc-700 text-white border-zinc-600"
                : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600"
            )}>
            {s === "all" ? "Tüm Durum" : STATUS_CONFIG[s as RiskStatus].label}
          </button>
        ))}
      </div>

      {/* Risk cards */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {risks.length === 0 ? "Henüz risk eklenmedi. İlk riski ekleyin." : "Filtre kriterlerine uygun risk bulunamadı."}
          </div>
        )}
        {filtered.map(risk => {
          const lc = LEVEL_CONFIG[risk.risk_level];
          const sc = STATUS_CONFIG[risk.status];
          const isExpanded = expandedId === risk.id;
          return (
            <div key={risk.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Score */}
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm text-white", MATRIX_COLOR(risk.risk_score))}>
                  {risk.risk_score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium">{risk.title}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", lc.bg, lc.text, lc.border)}>{lc.label}</span>
                    <span className={cn("text-xs", sc.color)}>{sc.label}</span>
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-zinc-500">
                    {risk.asset && <span>Varlık: {risk.asset}</span>}
                    {risk.owner && <span>Sorumlu: {risk.owner}</span>}
                    <span>İşlem: {TREATMENT_LABELS[risk.treatment]}</span>
                    <span>O:{risk.likelihood} × E:{risk.impact}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                  <button onClick={() => openEdit(risk)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(risk.id)} disabled={isPending}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-zinc-800/60 px-4 py-3 space-y-2 text-sm">
                  {risk.description && <p className="text-zinc-400">{risk.description}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {risk.threat && <div><span className="text-zinc-500 text-xs block">Tehdit</span><span className="text-zinc-300">{risk.threat}</span></div>}
                    {risk.vulnerability && <div><span className="text-zinc-500 text-xs block">Güvenlik Açığı</span><span className="text-zinc-300">{risk.vulnerability}</span></div>}
                    {risk.target_date && <div><span className="text-zinc-500 text-xs block">Hedef Tarih</span><span className="text-zinc-300">{risk.target_date}</span></div>}
                  </div>
                  {risk.treatment_plan && (
                    <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                      <span className="text-zinc-500 text-xs block mb-1">İşlem Planı</span>
                      <span className="text-zinc-300 text-sm">{risk.treatment_plan}</span>
                    </div>
                  )}
                  {risk.related_controls.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {risk.related_controls.map(c => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white font-semibold">{editingId ? "Riski Düzenle" : "Yeni Risk Ekle"}</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Risk Başlığı *</label>
                <input value={form.title} onChange={e => field("title", e.target.value)}
                  placeholder="Risk başlığı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              {/* Description */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Açıklama</label>
                <textarea value={form.description ?? ""} onChange={e => field("description", e.target.value || null)}
                  rows={2} placeholder="Risk açıklaması…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              {/* Asset / Threat / Vulnerability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([["asset","Varlık"],["threat","Tehdit"],["vulnerability","Güvenlik Açığı"]] as const).map(([k, lbl]) => (
                  <div key={k}>
                    <label className="text-zinc-400 text-xs block mb-1">{lbl}</label>
                    <input value={(form[k] as string) ?? ""} onChange={e => field(k, e.target.value || null)}
                      placeholder={`${lbl}…`}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                  </div>
                ))}
              </div>
              {/* Likelihood & Impact sliders */}
              <div className="grid grid-cols-2 gap-4">
                {([["likelihood","Olasılık"],["impact","Etki"]] as const).map(([k, lbl]) => (
                  <div key={k}>
                    <label className="text-zinc-400 text-xs block mb-1">{lbl}: <span className="text-white">{form[k]}</span></label>
                    <input type="range" min={1} max={5} value={form[k]}
                      onChange={e => field(k, parseInt(e.target.value))}
                      className="w-full accent-indigo-500" />
                    <div className="flex justify-between text-[10px] text-zinc-600 mt-0.5">
                      <span>1 (Çok Düşük)</span><span>5 (Çok Yüksek)</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Score preview */}
              <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-4 py-2">
                <span className="text-zinc-500 text-xs">Risk Skoru:</span>
                <span className={cn("font-bold text-lg", MATRIX_COLOR(form.likelihood * form.impact), "bg-transparent")}
                  style={{ WebkitTextFillColor: "unset" }}>
                  {form.likelihood * form.impact}
                </span>
                {(() => {
                  const score = form.likelihood * form.impact;
                  const level: RiskLevel = score >= 15 ? "critical" : score >= 10 ? "high" : score >= 5 ? "medium" : "low";
                  const c = LEVEL_CONFIG[level];
                  return <span className={cn("text-xs px-2 py-0.5 rounded-full border", c.bg, c.text, c.border)}>{c.label}</span>;
                })()}
              </div>
              {/* Treatment & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">İşlem Yöntemi</label>
                  <select value={form.treatment} onChange={e => field("treatment", e.target.value as RiskTreatment)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(TREATMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Durum</label>
                  <select value={form.status} onChange={e => field("status", e.target.value as RiskStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Treatment plan */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">İşlem Planı</label>
                <textarea value={form.treatment_plan ?? ""} onChange={e => field("treatment_plan", e.target.value || null)}
                  rows={2} placeholder="Riski nasıl ele alacaksınız?…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              {/* Owner & Target date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Sorumlu</label>
                  <input value={form.owner ?? ""} onChange={e => field("owner", e.target.value || null)}
                    placeholder="Ad Soyad…"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Hedef Tarih</label>
                  <input type="date" value={form.target_date ?? ""} onChange={e => field("target_date", e.target.value || null)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
              </div>
              {/* Related controls */}
              <div>
                <label className="text-zinc-400 text-xs block mb-1">İlgili Kontroller (virgülle ayırın)</label>
                <input value={form.related_controls.join(", ")}
                  onChange={e => field("related_controls", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="A.5.1, A.8.15…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors">
                İptal
              </button>
              <button onClick={handleSubmit} disabled={isPending || !form.title.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {isPending ? "Kaydediliyor…" : editingId ? "Güncelle" : "Risk Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
