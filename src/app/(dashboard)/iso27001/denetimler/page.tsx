"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Plus, Trash2, Pencil, X, ChevronDown, ChevronRight,
  ClipboardCheck, AlertCircle, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAudits, createAudit, updateAudit, deleteAudit,
  createFinding, updateFinding, deleteFinding,
  getCars, createCar, updateCar, deleteCar,
} from "../actions";
import type {
  IsmsAudit, IsmsAuditFinding, IsmsCorrectiveAction,
  AuditType, AuditStatus, FindingType, FindingSeverity, FindingStatus,
  CarStatus, CreateAudit, CreateFinding, CreateCar,
} from "@/lib/types/isms";

// ─── Config ───────────────────────────────────────────────────────────────────

const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  internal:        "İç Denetim",
  external:        "Dış Denetim",
  surveillance:    "Gözetim Denetimi",
  recertification: "Yeniden Belgelendirme",
};

const AUDIT_STATUS: Record<AuditStatus, { label: string; color: string; bg: string; border: string }> = {
  planned:     { label: "Planlandı",   color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/25" },
  in_progress: { label: "Devam Ediyor", color: "text-amber-400", bg: "bg-amber-500/15",  border: "border-amber-500/25" },
  completed:   { label: "Tamamlandı",  color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/25" },
  cancelled:   { label: "İptal",       color: "text-zinc-500",   bg: "bg-zinc-800",      border: "border-zinc-700" },
};

const FINDING_TYPE: Record<FindingType, { label: string; color: string }> = {
  nonconformity: { label: "Uygunsuzluk",    color: "text-red-400" },
  observation:   { label: "Gözlem",          color: "text-amber-400" },
  opportunity:   { label: "İyileştirme Fırsatı", color: "text-blue-400" },
};

const FINDING_STATUS: Record<FindingStatus, { label: string; bg: string; text: string; border: string }> = {
  open:        { label: "Açık",      bg: "bg-red-500/15",   text: "text-red-400",   border: "border-red-500/25" },
  in_progress: { label: "Devam",     bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/25" },
  closed:      { label: "Kapalı",    bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/25" },
};

const CAR_STATUS: Record<CarStatus, { label: string; bg: string; text: string; border: string }> = {
  open:        { label: "Açık",      bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/25" },
  in_progress: { label: "Devam",     bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/25" },
  completed:   { label: "Tamamlandı", bg: "bg-blue-500/15",  text: "text-blue-400",   border: "border-blue-500/25" },
  verified:    { label: "Doğrulandı", bg: "bg-green-500/15", text: "text-green-400",  border: "border-green-500/25" },
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "audits" | "findings" | "cars";

// ─── Component ────────────────────────────────────────────────────────────────

export default function DenetimlerPage() {
  const [tab, setTab] = useState<Tab>("audits");
  const [audits, setAudits] = useState<IsmsAudit[]>([]);
  const [cars, setCars]     = useState<IsmsCorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Audit form
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [editingAuditId, setEditingAuditId] = useState<string | null>(null);
  const [auditForm, setAuditForm] = useState<CreateAudit>({
    title: "", audit_type: "internal", scope: null, auditor: null,
    planned_date: null, actual_date: null, status: "planned", summary: null,
  });

  // Expanded audit (shows findings)
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  // Finding form
  const [showFindingForm, setShowFindingForm] = useState<string | null>(null); // audit_id
  const [editingFinding, setEditingFinding] = useState<IsmsAuditFinding | null>(null);
  const [findingForm, setFindingForm] = useState<Omit<CreateFinding, "audit_id">>({
    finding_type: "nonconformity", title: "", description: null,
    related_control: null, severity: null, status: "open",
  });

  // CAR form
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carForm, setCarForm] = useState<CreateCar>({
    finding_id: null, risk_id: null, title: "", description: null,
    root_cause: null, action_taken: null, owner: null,
    target_date: null, completion_date: null, status: "open", effectiveness_review: null,
  });

  useEffect(() => {
    Promise.all([getAudits(), getCars()]).then(([ar, cr]) => {
      if (ar.ok) setAudits(ar.data);
      else setError(ar.error);
      if (cr.ok) setCars(cr.data);
      setLoading(false);
    });
  }, []);

  // ── Audit CRUD ──
  const openCreateAudit = () => {
    setAuditForm({ title:"", audit_type:"internal", scope:null, auditor:null,
      planned_date:null, actual_date:null, status:"planned", summary:null });
    setEditingAuditId(null);
    setShowAuditForm(true);
  };
  const openEditAudit = (a: IsmsAudit) => {
    setAuditForm({ title:a.title, audit_type:a.audit_type, scope:a.scope,
      auditor:a.auditor, planned_date:a.planned_date, actual_date:a.actual_date,
      status:a.status, summary:a.summary });
    setEditingAuditId(a.id);
    setShowAuditForm(true);
  };
  const submitAudit = () => {
    if (!auditForm.title.trim()) return;
    startTransition(async () => {
      if (editingAuditId) {
        const res = await updateAudit(editingAuditId, auditForm);
        if (res.ok) setAudits(prev => prev.map(a => a.id === editingAuditId ? { ...res.data, findings: a.findings } : a));
      } else {
        const res = await createAudit(auditForm);
        if (res.ok) setAudits(prev => [{ ...res.data, findings: [] }, ...prev]);
      }
      setShowAuditForm(false);
    });
  };
  const handleDeleteAudit = (id: string) => {
    startTransition(async () => {
      const res = await deleteAudit(id);
      if (res.ok) setAudits(prev => prev.filter(a => a.id !== id));
    });
  };

  // ── Finding CRUD ──
  const openCreateFinding = (auditId: string) => {
    setFindingForm({ finding_type:"nonconformity", title:"", description:null,
      related_control:null, severity:null, status:"open" });
    setEditingFinding(null);
    setShowFindingForm(auditId);
  };
  const openEditFinding = (f: IsmsAuditFinding) => {
    setFindingForm({ finding_type:f.finding_type, title:f.title, description:f.description,
      related_control:f.related_control, severity:f.severity, status:f.status });
    setEditingFinding(f);
    setShowFindingForm(f.audit_id);
  };
  const submitFinding = () => {
    if (!findingForm.title.trim() || !showFindingForm) return;
    startTransition(async () => {
      if (editingFinding) {
        const res = await updateFinding(editingFinding.id, findingForm);
        if (res.ok) setAudits(prev => prev.map(a =>
          a.id === editingFinding.audit_id
            ? { ...a, findings: (a.findings ?? []).map(f => f.id === editingFinding.id ? res.data : f) }
            : a
        ));
      } else {
        const res = await createFinding({ ...findingForm, audit_id: showFindingForm });
        if (res.ok) setAudits(prev => prev.map(a =>
          a.id === showFindingForm
            ? { ...a, findings: [...(a.findings ?? []), res.data] }
            : a
        ));
      }
      setShowFindingForm(null);
    });
  };
  const handleDeleteFinding = (auditId: string, findingId: string) => {
    startTransition(async () => {
      const res = await deleteFinding(findingId);
      if (res.ok) setAudits(prev => prev.map(a =>
        a.id === auditId ? { ...a, findings: (a.findings ?? []).filter(f => f.id !== findingId) } : a
      ));
    });
  };

  // ── CAR CRUD ──
  const openCreateCar = () => {
    setCarForm({ finding_id:null, risk_id:null, title:"", description:null,
      root_cause:null, action_taken:null, owner:null, target_date:null,
      completion_date:null, status:"open", effectiveness_review:null });
    setEditingCarId(null);
    setShowCarForm(true);
  };
  const openEditCar = (c: IsmsCorrectiveAction) => {
    setCarForm({ finding_id:c.finding_id, risk_id:c.risk_id, title:c.title,
      description:c.description, root_cause:c.root_cause, action_taken:c.action_taken,
      owner:c.owner, target_date:c.target_date, completion_date:c.completion_date,
      status:c.status, effectiveness_review:c.effectiveness_review });
    setEditingCarId(c.id);
    setShowCarForm(true);
  };
  const submitCar = () => {
    if (!carForm.title.trim()) return;
    startTransition(async () => {
      if (editingCarId) {
        const res = await updateCar(editingCarId, carForm);
        if (res.ok) setCars(prev => prev.map(c => c.id === editingCarId ? res.data : c));
      } else {
        const res = await createCar(carForm);
        if (res.ok) setCars(prev => [res.data, ...prev]);
      }
      setShowCarForm(false);
    });
  };
  const handleDeleteCar = (id: string) => {
    startTransition(async () => {
      const res = await deleteCar(id);
      if (res.ok) setCars(prev => prev.filter(c => c.id !== id));
    });
  };

  const allFindings = audits.flatMap(a => (a.findings ?? []).map(f => ({ ...f, auditTitle: a.title })));

  // Stats
  const stats = {
    audits:      audits.length,
    completed:   audits.filter(a => a.status === "completed").length,
    openFindings: allFindings.filter(f => f.status === "open").length,
    openCars:    cars.filter(c => c.status === "open" || c.status === "in_progress").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">Denetimler yükleniyor…</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Denetim Yönetimi</h1>
        <p className="text-zinc-500 text-sm mt-1">Denetim planları · Bulgular · Düzeltici faaliyetler</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Toplam Denetim", value: stats.audits,       bg: "bg-zinc-800 border-zinc-700",          text: "text-white" },
          { label: "Tamamlanan",     value: stats.completed,    bg: "bg-green-500/10 border-green-500/20",   text: "text-green-400" },
          { label: "Açık Bulgu",     value: stats.openFindings, bg: "bg-amber-500/10 border-amber-500/20",   text: "text-amber-400" },
          { label: "Açık DÜF",       value: stats.openCars,     bg: "bg-red-500/10 border-red-500/20",       text: "text-red-400" },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.bg)}>
            <p className="text-zinc-500 text-xs">{s.label}</p>
            <p className={cn("text-2xl font-bold mt-1", s.text)}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 w-fit">
        {([
          ["audits",   "Denetimler",         audits.length],
          ["findings", "Bulgular",           allFindings.length],
          ["cars",     "Düzeltici Faaliyetler", cars.length],
        ] as [Tab, string, number][]).map(([id, label, count]) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
              tab === id ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            )}>
            {label}
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full", tab === id ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800 text-zinc-500")}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── AUDITS TAB ── */}
      {tab === "audits" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={openCreateAudit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Denetim Planla
            </button>
          </div>
          {audits.length === 0 && (
            <div className="text-center py-16 text-zinc-500 text-sm">Henüz denetim eklenmedi.</div>
          )}
          {audits.map(audit => {
            const asc = AUDIT_STATUS[audit.status];
            const isExpanded = expandedAuditId === audit.id;
            const findings = audit.findings ?? [];
            return (
              <div key={audit.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <ClipboardCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium text-sm">{audit.title}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border", asc.bg, asc.color, asc.border)}>{asc.label}</span>
                      <span className="text-zinc-500 text-xs">{AUDIT_TYPE_LABELS[audit.audit_type]}</span>
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-zinc-500">
                      {audit.auditor && <span>Denetçi: {audit.auditor}</span>}
                      {audit.planned_date && <span>Plan: {audit.planned_date}</span>}
                      {findings.length > 0 && <span>{findings.length} bulgu</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setExpandedAuditId(isExpanded ? null : audit.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEditAudit(audit)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAudit(audit.id)} disabled={isPending}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Findings panel */}
                {isExpanded && (
                  <div className="border-t border-zinc-800/60">
                    {audit.scope && (
                      <div className="px-4 py-2 text-sm text-zinc-400 bg-zinc-800/20">Kapsam: {audit.scope}</div>
                    )}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium">BULGULAR</span>
                      <button onClick={() => openCreateFinding(audit.id)}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
                        <Plus className="w-3 h-3" /> Bulgu Ekle
                      </button>
                    </div>
                    {findings.length === 0 && (
                      <div className="px-4 pb-4 text-xs text-zinc-600">Bu denetim için henüz bulgu eklenmedi.</div>
                    )}
                    {findings.map(f => {
                      const ftc = FINDING_TYPE[f.finding_type];
                      const fsc = FINDING_STATUS[f.status];
                      return (
                        <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-zinc-800/40 hover:bg-zinc-800/15 group">
                          <AlertCircle className={cn("w-3.5 h-3.5 shrink-0", ftc.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-300 text-xs">{f.title}</span>
                              <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", fsc.bg, fsc.text, fsc.border)}>{fsc.label}</span>
                              <span className={cn("text-[10px]", ftc.color)}>{ftc.label}</span>
                              {f.severity && <span className="text-[10px] text-zinc-600">{f.severity === "major" ? "Büyük" : "Küçük"}</span>}
                            </div>
                            {f.related_control && <span className="text-[10px] text-indigo-400">{f.related_control}</span>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditFinding(f)}
                              className="p-1 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteFinding(audit.id, f.id)} disabled={isPending}
                              className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── FINDINGS TAB ── */}
      {tab === "findings" && (
        <div className="space-y-2">
          {allFindings.length === 0 && (
            <div className="text-center py-16 text-zinc-500 text-sm">Henüz bulgu eklenmedi. Denetimler sekmesinden bulgu ekleyin.</div>
          )}
          {allFindings.map(f => {
            const ftc = FINDING_TYPE[f.finding_type];
            const fsc = FINDING_STATUS[f.status];
            return (
              <div key={f.id} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <AlertCircle className={cn("w-4 h-4 shrink-0 mt-0.5", ftc.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-zinc-200 text-sm font-medium">{f.title}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", fsc.bg, fsc.text, fsc.border)}>{fsc.label}</span>
                    <span className={cn("text-xs", ftc.color)}>{ftc.label}</span>
                  </div>
                  <div className="flex gap-3 mt-0.5 text-xs text-zinc-500">
                    <span>Denetim: {(f as IsmsAuditFinding & { auditTitle: string }).auditTitle}</span>
                    {f.related_control && <span className="text-indigo-400">{f.related_control}</span>}
                    {f.severity && <span>{f.severity === "major" ? "Büyük Uygunsuzluk" : "Küçük Uygunsuzluk"}</span>}
                  </div>
                  {f.description && <p className="mt-1 text-xs text-zinc-500">{f.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CORRECTIVE ACTIONS TAB ── */}
      {tab === "cars" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={openCreateCar}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> DÜF Ekle
            </button>
          </div>
          {cars.length === 0 && (
            <div className="text-center py-16 text-zinc-500 text-sm">Henüz düzeltici faaliyet eklenmedi.</div>
          )}
          {cars.map(car => {
            const csc = CAR_STATUS[car.status];
            const isOverdue = car.target_date && new Date(car.target_date) < new Date() && car.status !== "completed" && car.status !== "verified";
            return (
              <div key={car.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <CheckCircle2 className={cn("w-5 h-5 shrink-0 mt-0.5", csc.text)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium text-sm">{car.title}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border", csc.bg, csc.text, csc.border)}>{csc.label}</span>
                      {isOverdue && <span className="text-xs text-red-400 font-medium">Süre Geçti</span>}
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-zinc-500">
                      {car.owner && <span>Sorumlu: {car.owner}</span>}
                      {car.target_date && <span className={cn(isOverdue ? "text-red-400" : "")}>Hedef: {car.target_date}</span>}
                      {car.completion_date && <span>Tamamlandı: {car.completion_date}</span>}
                    </div>
                    {car.description && <p className="mt-1 text-xs text-zinc-500">{car.description}</p>}
                    {car.root_cause && (
                      <div className="mt-2 rounded bg-zinc-800/50 px-2.5 py-1.5 text-xs text-zinc-400">
                        <span className="text-zinc-500">Kök Neden: </span>{car.root_cause}
                      </div>
                    )}
                    {car.action_taken && (
                      <div className="mt-1 rounded bg-zinc-800/50 px-2.5 py-1.5 text-xs text-zinc-400">
                        <span className="text-zinc-500">Alınan Önlem: </span>{car.action_taken}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEditCar(car)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCar(car.id)} disabled={isPending}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── AUDIT FORM MODAL ── */}
      {showAuditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white font-semibold">{editingAuditId ? "Denetimi Düzenle" : "Denetim Planla"}</h2>
              <button onClick={() => setShowAuditForm(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Denetim Başlığı *</label>
                <input value={auditForm.title} onChange={e => setAuditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Denetim adı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Denetim Türü</label>
                  <select value={auditForm.audit_type} onChange={e => setAuditForm(f => ({ ...f, audit_type: e.target.value as AuditType }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(AUDIT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Durum</label>
                  <select value={auditForm.status} onChange={e => setAuditForm(f => ({ ...f, status: e.target.value as AuditStatus }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(AUDIT_STATUS).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Denetçi</label>
                <input value={auditForm.auditor ?? ""} onChange={e => setAuditForm(f => ({ ...f, auditor: e.target.value || null }))}
                  placeholder="Denetçi adı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Kapsam</label>
                <textarea value={auditForm.scope ?? ""} onChange={e => setAuditForm(f => ({ ...f, scope: e.target.value || null }))}
                  rows={2} placeholder="Denetim kapsamı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Planlanan Tarih</label>
                  <input type="date" value={auditForm.planned_date ?? ""} onChange={e => setAuditForm(f => ({ ...f, planned_date: e.target.value || null }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Gerçekleşen Tarih</label>
                  <input type="date" value={auditForm.actual_date ?? ""} onChange={e => setAuditForm(f => ({ ...f, actual_date: e.target.value || null }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Özet / Sonuç</label>
                <textarea value={auditForm.summary ?? ""} onChange={e => setAuditForm(f => ({ ...f, summary: e.target.value || null }))}
                  rows={2} placeholder="Denetim özeti…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setShowAuditForm(false)} className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors">İptal</button>
              <button onClick={submitAudit} disabled={isPending || !auditForm.title.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {isPending ? "Kaydediliyor…" : editingAuditId ? "Güncelle" : "Planla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FINDING FORM MODAL ── */}
      {showFindingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white font-semibold">{editingFinding ? "Bulguyu Düzenle" : "Bulgu Ekle"}</h2>
              <button onClick={() => setShowFindingForm(null)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Bulgu Başlığı *</label>
                <input value={findingForm.title} onChange={e => setFindingForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Bulgu başlığı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Bulgu Türü</label>
                  <select value={findingForm.finding_type} onChange={e => setFindingForm(f => ({ ...f, finding_type: e.target.value as FindingType }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(FINDING_TYPE).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Önem</label>
                  <select value={findingForm.severity ?? ""} onChange={e => setFindingForm(f => ({ ...f, severity: (e.target.value || null) as FindingSeverity | null }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    <option value="">—</option>
                    <option value="minor">Küçük</option>
                    <option value="major">Büyük</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">İlgili Kontrol</label>
                <input value={findingForm.related_control ?? ""} onChange={e => setFindingForm(f => ({ ...f, related_control: e.target.value || null }))}
                  placeholder="A.5.1…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Açıklama</label>
                <textarea value={findingForm.description ?? ""} onChange={e => setFindingForm(f => ({ ...f, description: e.target.value || null }))}
                  rows={3} placeholder="Bulgu detayları…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Durum</label>
                <select value={findingForm.status} onChange={e => setFindingForm(f => ({ ...f, status: e.target.value as FindingStatus }))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                  {Object.entries(FINDING_STATUS).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setShowFindingForm(null)} className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors">İptal</button>
              <button onClick={submitFinding} disabled={isPending || !findingForm.title.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {isPending ? "Kaydediliyor…" : editingFinding ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CAR FORM MODAL ── */}
      {showCarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white font-semibold">{editingCarId ? "DÜF Düzenle" : "Düzeltici Faaliyet Ekle"}</h2>
              <button onClick={() => setShowCarForm(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Başlık *</label>
                <input value={carForm.title} onChange={e => setCarForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="DÜF başlığı…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Açıklama</label>
                <textarea value={carForm.description ?? ""} onChange={e => setCarForm(f => ({ ...f, description: e.target.value || null }))}
                  rows={2} placeholder="Açıklama…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Kök Neden Analizi</label>
                <textarea value={carForm.root_cause ?? ""} onChange={e => setCarForm(f => ({ ...f, root_cause: e.target.value || null }))}
                  rows={2} placeholder="Kök neden…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Alınan / Planlanan Önlem</label>
                <textarea value={carForm.action_taken ?? ""} onChange={e => setCarForm(f => ({ ...f, action_taken: e.target.value || null }))}
                  rows={2} placeholder="Faaliyet açıklaması…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Sorumlu</label>
                  <input value={carForm.owner ?? ""} onChange={e => setCarForm(f => ({ ...f, owner: e.target.value || null }))}
                    placeholder="Ad Soyad…"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Durum</label>
                  <select value={carForm.status} onChange={e => setCarForm(f => ({ ...f, status: e.target.value as CarStatus }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60">
                    {Object.entries(CAR_STATUS).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Hedef Tarih</label>
                  <input type="date" value={carForm.target_date ?? ""} onChange={e => setCarForm(f => ({ ...f, target_date: e.target.value || null }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-1">Tamamlanma Tarihi</label>
                  <input type="date" value={carForm.completion_date ?? ""} onChange={e => setCarForm(f => ({ ...f, completion_date: e.target.value || null }))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60" />
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Etkinlik Değerlendirmesi</label>
                <textarea value={carForm.effectiveness_review ?? ""} onChange={e => setCarForm(f => ({ ...f, effectiveness_review: e.target.value || null }))}
                  rows={2} placeholder="Faaliyet etkili miydi?…"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setShowCarForm(false)} className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors">İptal</button>
              <button onClick={submitCar} disabled={isPending || !carForm.title.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                {isPending ? "Kaydediliyor…" : editingCarId ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
