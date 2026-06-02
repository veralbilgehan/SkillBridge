"use client";

import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle2, Circle, MinusCircle, Ban,
  ChevronDown, ChevronRight, Shield, Users, Building2, Cpu, Search, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getControlStatuses, upsertControlStatus } from "../actions";
import type { ControlStatusValue, IsmsControlStatus } from "@/lib/types/isms";

// ─── All 93 controls flat list ───────────────────────────────────────────────

const ALL_CONTROLS = [
  // A.5
  { id: "A.5.1",  annex: "A5", title: "Bilgi güvenliği politikaları" },
  { id: "A.5.2",  annex: "A5", title: "Bilgi güvenliği rolleri ve sorumlulukları" },
  { id: "A.5.3",  annex: "A5", title: "Görev ayrılığı" },
  { id: "A.5.4",  annex: "A5", title: "Yönetim sorumlulukları" },
  { id: "A.5.5",  annex: "A5", title: "Yetkililerle iletişim" },
  { id: "A.5.6",  annex: "A5", title: "Özel ilgi gruplarıyla iletişim" },
  { id: "A.5.7",  annex: "A5", title: "Tehdit istihbaratı" },
  { id: "A.5.8",  annex: "A5", title: "Proje yönetiminde bilgi güvenliği" },
  { id: "A.5.9",  annex: "A5", title: "Bilgi ve varlıkların envanteri" },
  { id: "A.5.10", annex: "A5", title: "Bilgi ve varlıkların kabul edilebilir kullanımı" },
  { id: "A.5.11", annex: "A5", title: "Varlıkların iadesi" },
  { id: "A.5.12", annex: "A5", title: "Bilginin sınıflandırılması" },
  { id: "A.5.13", annex: "A5", title: "Bilginin etiketlenmesi" },
  { id: "A.5.14", annex: "A5", title: "Bilgi transferi" },
  { id: "A.5.15", annex: "A5", title: "Erişim kontrolü" },
  { id: "A.5.16", annex: "A5", title: "Kimlik yönetimi" },
  { id: "A.5.17", annex: "A5", title: "Kimlik doğrulama bilgileri" },
  { id: "A.5.18", annex: "A5", title: "Erişim hakları" },
  { id: "A.5.19", annex: "A5", title: "Tedarikçi ilişkilerinde bilgi güvenliği" },
  { id: "A.5.20", annex: "A5", title: "Tedarikçi anlaşmalarında bilgi güvenliği" },
  { id: "A.5.21", annex: "A5", title: "BİT tedarik zincirinde bilgi güvenliği" },
  { id: "A.5.22", annex: "A5", title: "Tedarikçi hizmetlerinin izlenmesi ve yönetimi" },
  { id: "A.5.23", annex: "A5", title: "Bulut hizmetlerinde bilgi güvenliği" },
  { id: "A.5.24", annex: "A5", title: "Olay yönetimi planlaması ve hazırlığı" },
  { id: "A.5.25", annex: "A5", title: "Olayların değerlendirilmesi ve karar verilmesi" },
  { id: "A.5.26", annex: "A5", title: "Olaylara müdahale" },
  { id: "A.5.27", annex: "A5", title: "Olaylardan ders çıkarma" },
  { id: "A.5.28", annex: "A5", title: "Kanıt toplama" },
  { id: "A.5.29", annex: "A5", title: "Aksama sırasında bilgi güvenliği" },
  { id: "A.5.30", annex: "A5", title: "İş sürekliliği için BİT hazırlığı" },
  { id: "A.5.31", annex: "A5", title: "Yasal, düzenleyici ve sözleşmesel gereksinimler" },
  { id: "A.5.32", annex: "A5", title: "Fikri mülkiyet hakları" },
  { id: "A.5.33", annex: "A5", title: "Kayıtların korunması" },
  { id: "A.5.34", annex: "A5", title: "Gizlilik ve kişisel verilerin korunması" },
  { id: "A.5.35", annex: "A5", title: "Bağımsız bilgi güvenliği gözden geçirmesi" },
  { id: "A.5.36", annex: "A5", title: "Politika ve standartlarla uyumluluk" },
  { id: "A.5.37", annex: "A5", title: "Dokümante edilmiş operasyonel prosedürler" },
  // A.6
  { id: "A.6.1", annex: "A6", title: "Tarama (işe alım öncesi kontrol)" },
  { id: "A.6.2", annex: "A6", title: "İstihdam hüküm ve koşulları" },
  { id: "A.6.3", annex: "A6", title: "Bilgi güvenliği farkındalığı, eğitim ve öğretim" },
  { id: "A.6.4", annex: "A6", title: "Disiplin süreci" },
  { id: "A.6.5", annex: "A6", title: "İstihdam sonrası sorumluluklar" },
  { id: "A.6.6", annex: "A6", title: "Gizlilik / ifşa etmeme anlaşmaları" },
  { id: "A.6.7", annex: "A6", title: "Uzaktan çalışma" },
  { id: "A.6.8", annex: "A6", title: "Bilgi güvenliği olayı bildirimi" },
  // A.7
  { id: "A.7.1",  annex: "A7", title: "Fiziksel güvenlik çevreleri" },
  { id: "A.7.2",  annex: "A7", title: "Fiziksel giriş" },
  { id: "A.7.3",  annex: "A7", title: "Ofislerin, odaların ve tesislerin güvenliği" },
  { id: "A.7.4",  annex: "A7", title: "Fiziksel güvenlik izleme" },
  { id: "A.7.5",  annex: "A7", title: "Fiziksel ve çevresel tehditlere karşı koruma" },
  { id: "A.7.6",  annex: "A7", title: "Güvenli alanlarda çalışma" },
  { id: "A.7.7",  annex: "A7", title: "Temiz masa ve temiz ekran" },
  { id: "A.7.8",  annex: "A7", title: "Ekipman yerleşimi ve korunması" },
  { id: "A.7.9",  annex: "A7", title: "Tesis dışındaki varlıkların güvenliği" },
  { id: "A.7.10", annex: "A7", title: "Depolama ortamı" },
  { id: "A.7.11", annex: "A7", title: "Destek hizmetleri" },
  { id: "A.7.12", annex: "A7", title: "Kablo güvenliği" },
  { id: "A.7.13", annex: "A7", title: "Ekipman bakımı" },
  { id: "A.7.14", annex: "A7", title: "Ekipmanın güvenli imhası veya yeniden kullanımı" },
  // A.8
  { id: "A.8.1",  annex: "A8", title: "Kullanıcı uç nokta cihazları" },
  { id: "A.8.2",  annex: "A8", title: "Ayrıcalıklı erişim hakları" },
  { id: "A.8.3",  annex: "A8", title: "Bilgiye erişim kısıtlaması" },
  { id: "A.8.4",  annex: "A8", title: "Kaynak koduna erişim" },
  { id: "A.8.5",  annex: "A8", title: "Güvenli kimlik doğrulama" },
  { id: "A.8.6",  annex: "A8", title: "Kapasite yönetimi" },
  { id: "A.8.7",  annex: "A8", title: "Zararlı yazılımlara karşı koruma" },
  { id: "A.8.8",  annex: "A8", title: "Teknik güvenlik açıklarının yönetimi" },
  { id: "A.8.9",  annex: "A8", title: "Yapılandırma yönetimi" },
  { id: "A.8.10", annex: "A8", title: "Bilginin silinmesi" },
  { id: "A.8.11", annex: "A8", title: "Veri maskeleme" },
  { id: "A.8.12", annex: "A8", title: "Veri sızıntısı önleme" },
  { id: "A.8.13", annex: "A8", title: "Bilgi yedekleme" },
  { id: "A.8.14", annex: "A8", title: "Bilgi işleme tesislerinin gereksizliği" },
  { id: "A.8.15", annex: "A8", title: "Kayıt tutma (Loglama)" },
  { id: "A.8.16", annex: "A8", title: "İzleme faaliyetleri" },
  { id: "A.8.17", annex: "A8", title: "Saat senkronizasyonu" },
  { id: "A.8.18", annex: "A8", title: "Ayrıcalıklı yardımcı programların kullanımı" },
  { id: "A.8.19", annex: "A8", title: "Operasyonel sistemlere yazılım kurulumu" },
  { id: "A.8.20", annex: "A8", title: "Ağ güvenliği" },
  { id: "A.8.21", annex: "A8", title: "Ağ hizmetlerinin güvenliği" },
  { id: "A.8.22", annex: "A8", title: "Ağların ayrıştırılması" },
  { id: "A.8.23", annex: "A8", title: "Web filtreleme" },
  { id: "A.8.24", annex: "A8", title: "Kriptografi kullanımı" },
  { id: "A.8.25", annex: "A8", title: "Güvenli geliştirme yaşam döngüsü" },
  { id: "A.8.26", annex: "A8", title: "Uygulama güvenliği gereksinimleri" },
  { id: "A.8.27", annex: "A8", title: "Güvenli sistem mimarisi ve mühendislik ilkeleri" },
  { id: "A.8.28", annex: "A8", title: "Güvenli kodlama" },
  { id: "A.8.29", annex: "A8", title: "Geliştirme ve kabul sürecinde güvenlik testi" },
  { id: "A.8.30", annex: "A8", title: "Dış kaynaklı geliştirme" },
  { id: "A.8.31", annex: "A8", title: "Geliştirme, test ve üretim ortamlarının ayrıştırılması" },
  { id: "A.8.32", annex: "A8", title: "Değişim yönetimi" },
  { id: "A.8.33", annex: "A8", title: "Test bilgisi" },
  { id: "A.8.34", annex: "A8", title: "Denetim testi sırasında bilgi sistemlerinin korunması" },
] as const;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ControlStatusValue, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  implemented:     { label: "Uygulandı",      icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/25" },
  partial:         { label: "Kısmi",          icon: MinusCircle,  color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/25" },
  not_implemented: { label: "Uygulanmadı",    icon: Circle,       color: "text-zinc-500",   bg: "bg-zinc-800",      border: "border-zinc-700" },
  not_applicable:  { label: "Uygulanamaz",    icon: Ban,          color: "text-zinc-600",   bg: "bg-zinc-900",      border: "border-zinc-800" },
};

const ANNEX_CONFIG = {
  A5: { label: "A.5 Organizasyonel", icon: Shield,    color: "text-indigo-400" },
  A6: { label: "A.6 İnsan",          icon: Users,     color: "text-green-400" },
  A7: { label: "A.7 Fiziksel",       icon: Building2, color: "text-orange-400" },
  A8: { label: "A.8 Teknolojik",     icon: Cpu,       color: "text-cyan-400" },
};

type AnnexKey = "A5" | "A6" | "A7" | "A8";

// ─── Component ────────────────────────────────────────────────────────────────

export default function KontrollerPage() {
  const [statuses, setStatuses] = useState<Record<string, IsmsControlStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filterAnnex, setFilterAnnex] = useState<AnnexKey | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ControlStatusValue | "all">("all");
  const [expanded, setExpanded] = useState<Set<AnnexKey>>(new Set(["A5", "A6", "A7", "A8"]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: ControlStatusValue; owner: string; notes: string }>({
    status: "not_implemented", owner: "", notes: "",
  });

  useEffect(() => {
    getControlStatuses().then((res) => {
      if (res.ok) {
        const map: Record<string, IsmsControlStatus> = {};
        res.data.forEach((s) => { map[s.control_id] = s; });
        setStatuses(map);
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
  }, []);

  const getStatus = (id: string): ControlStatusValue =>
    statuses[id]?.status ?? "not_implemented";

  const openEdit = (id: string) => {
    const s = statuses[id];
    setEditForm({
      status: s?.status ?? "not_implemented",
      owner: s?.owner ?? "",
      notes: s?.notes ?? "",
    });
    setEditingId(id);
  };

  const saveEdit = (controlId: string, annex: string) => {
    startTransition(async () => {
      const res = await upsertControlStatus({
        control_id: controlId,
        annex: annex as never,
        status: editForm.status,
        owner: editForm.owner || null,
        notes: editForm.notes || null,
        evidence_note: null,
      });
      if (res.ok) {
        setStatuses((prev) => ({ ...prev, [controlId]: res.data }));
        setEditingId(null);
      }
    });
  };

  // Stats
  const implemented   = ALL_CONTROLS.filter(c => getStatus(c.id) === "implemented").length;
  const partial       = ALL_CONTROLS.filter(c => getStatus(c.id) === "partial").length;
  const notApplicable = ALL_CONTROLS.filter(c => getStatus(c.id) === "not_applicable").length;
  const applicable    = ALL_CONTROLS.length - notApplicable;
  const compliance    = applicable > 0 ? Math.round((implemented / applicable) * 100) : 0;

  // Filter
  const filtered = ALL_CONTROLS.filter((c) => {
    if (filterAnnex !== "all" && c.annex !== filterAnnex) return false;
    if (filterStatus !== "all" && getStatus(c.id) !== filterStatus) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) &&
        !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = (["A5","A6","A7","A8"] as AnnexKey[]).map((annex) => ({
    annex,
    controls: filtered.filter((c) => c.annex === annex),
  })).filter((g) => g.controls.length > 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
      Kontroller yükleniyor…
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Kontrol Uygulama Durumu</h1>
        <p className="text-zinc-500 text-sm mt-1">ISO 27001:2022 — 93 Ek A kontrolü</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Uyumluluk", value: `${compliance}%`, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
          { label: "Uygulandı", value: implemented,      color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
          { label: "Kısmi",     value: partial,          color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Uygulanamaz", value: notApplicable,  color: "text-zinc-500",   bg: "bg-zinc-800 border-zinc-700" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.bg)}>
            <p className="text-zinc-500 text-xs">{s.label}</p>
            <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Genel uyumluluk</span>
          <span>{compliance}% ({implemented}/{applicable} kontrol)</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${compliance}%` }} />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kontrol ara…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all","A5","A6","A7","A8"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setFilterAnnex(a)}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                filterAnnex === a
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600"
              )}
            >
              {a === "all" ? "Tümü" : a.replace("A","A.")}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all","implemented","partial","not_implemented","not_applicable"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                filterStatus === s
                  ? "bg-zinc-700 text-white border-zinc-600"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600"
              )}
            >
              {s === "all" ? "Tüm Durum" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Control groups */}
      <div className="space-y-3">
        {grouped.map(({ annex, controls }) => {
          const cfg = ANNEX_CONFIG[annex];
          const Icon = cfg.icon;
          const isOpen = expanded.has(annex);
          const groupImpl = controls.filter(c => getStatus(c.id) === "implemented").length;

          return (
            <div key={annex} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
                onClick={() => setExpanded(prev => {
                  const n = new Set(prev);
                  n.has(annex) ? n.delete(annex) : n.add(annex);
                  return n;
                })}
              >
                <Icon className={cn("w-4 h-4 shrink-0", cfg.color)} />
                <span className="text-white font-medium text-sm flex-1 text-left">{cfg.label}</span>
                <span className="text-xs text-zinc-500">{groupImpl}/{controls.length} uygulandı</span>
                {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
              </button>

              {isOpen && (
                <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/40">
                  {controls.map((ctrl) => {
                    const statusVal = getStatus(ctrl.id);
                    const sCfg = STATUS_CONFIG[statusVal];
                    const SIcon = sCfg.icon;
                    const saved = statuses[ctrl.id];
                    const isEditing = editingId === ctrl.id;

                    return (
                      <div key={ctrl.id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-indigo-400 font-mono text-xs w-14 shrink-0">{ctrl.id}</span>
                          <span className="text-zinc-300 text-sm flex-1">{ctrl.title}</span>
                          {saved?.owner && (
                            <span className="text-zinc-500 text-xs hidden sm:block">{saved.owner}</span>
                          )}
                          <button
                            onClick={() => isEditing ? setEditingId(null) : openEdit(ctrl.id)}
                            className={cn(
                              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors",
                              sCfg.bg, sCfg.border, sCfg.color
                            )}
                          >
                            <SIcon className="w-3 h-3" />
                            {sCfg.label}
                          </button>
                        </div>

                        {/* Inline edit form */}
                        {isEditing && (
                          <div className="mt-3 ml-14 space-y-3 pb-1">
                            <div className="flex gap-2 flex-wrap">
                              {(Object.entries(STATUS_CONFIG) as [ControlStatusValue, typeof STATUS_CONFIG[ControlStatusValue]][]).map(([val, cfg]) => {
                                const EIcon = cfg.icon;
                                return (
                                  <button
                                    key={val}
                                    onClick={() => setEditForm(f => ({ ...f, status: val }))}
                                    className={cn(
                                      "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors",
                                      editForm.status === val ? cn(cfg.bg, cfg.border, cfg.color) : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600"
                                    )}
                                  >
                                    <EIcon className="w-3 h-3" />
                                    {cfg.label}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2">
                              <input
                                value={editForm.owner}
                                onChange={(e) => setEditForm(f => ({ ...f, owner: e.target.value }))}
                                placeholder="Sorumlu kişi…"
                                className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                              />
                              <input
                                value={editForm.notes}
                                onChange={(e) => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="Not…"
                                className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                              />
                              <button
                                onClick={() => saveEdit(ctrl.id, ctrl.annex)}
                                disabled={isPending}
                                className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium disabled:opacity-50 transition-colors"
                              >
                                {isPending ? "Kaydediliyor…" : "Kaydet"}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:border-zinc-500 transition-colors"
                              >
                                İptal
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
