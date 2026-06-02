"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  User,
  Users,
  Briefcase,
  Building2,
  BarChart3,
  ArrowRight,
  FileScan,
  Loader2,
  Trophy,
  Star,
  ArrowUpDown,
  Download,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DegerlenDurum = "Bekliyor" | "Tamamlandı";
type Rol = "Kendisi" | "Yönetici" | "İş Arkadaşı" | "Farklı Departman";

interface Degerlendirici {
  rol: Rol;
  ad: string;
  email: string;
  durum: DegerlenDurum;
}

interface Degerlendirme {
  id: string;
  calisan: string;
  pozisyon: string;
  baslamaTarihi: string;
  degerlendiriciler: Degerlendirici[];
  tamamlandi: boolean;
}

interface YetkinlikPuan {
  ad: string;
  kendisi: number;
  yonetici: number;
  arkadas: number;
  departman: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DEGERLENDIRMELER: Degerlendirme[] = [
  {
    id: "d1",
    calisan: "Ayşe Kaya",
    pozisyon: "Kıdemli Yazılım Geliştirici",
    baslamaTarihi: "2026-02-20",
    tamamlandi: true,
    degerlendiriciler: [
      { rol: "Kendisi",          ad: "Ayşe Kaya",   email: "ayse@example.com",  durum: "Tamamlandı" },
      { rol: "Yönetici",         ad: "Can Öztürk",  email: "can@example.com",   durum: "Tamamlandı" },
      { rol: "İş Arkadaşı",      ad: "Mert Yılmaz", email: "mert@example.com",  durum: "Tamamlandı" },
      { rol: "Farklı Departman", ad: "Selin Demir", email: "selin@example.com", durum: "Tamamlandı" },
    ],
  },
  {
    id: "d2",
    calisan: "Mehmet Demir",
    pozisyon: "Operasyon Uzmanı",
    baslamaTarihi: "2026-03-01",
    tamamlandi: false,
    degerlendiriciler: [
      { rol: "Kendisi",          ad: "Mehmet Demir", email: "mehmet@example.com", durum: "Tamamlandı" },
      { rol: "Yönetici",         ad: "Leyla Arslan", email: "leyla@example.com",  durum: "Tamamlandı" },
      { rol: "İş Arkadaşı",      ad: "Burak Çelik",  email: "burak@example.com",  durum: "Bekliyor" },
      { rol: "Farklı Departman", ad: "Zeynep Kurt",  email: "zeynep@example.com", durum: "Bekliyor" },
    ],
  },
];

const MOCK_PUANLAR: YetkinlikPuan[] = [
  { ad: "İletişim",        kendisi: 85, yonetici: 78, arkadas: 82, departman: 80 },
  { ad: "Problem Çözme",   kendisi: 90, yonetici: 88, arkadas: 85, departman: 87 },
  { ad: "Takım Çalışması", kendisi: 75, yonetici: 82, arkadas: 88, departman: 79 },
  { ad: "Liderlik",        kendisi: 80, yonetici: 72, arkadas: 70, departman: 68 },
  { ad: "Sonuç Odaklılık", kendisi: 88, yonetici: 91, arkadas: 86, departman: 89 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rolIkon: Record<Rol, React.ElementType> = {
  "Kendisi":           User,
  "Yönetici":          Briefcase,
  "İş Arkadaşı":       Users,
  "Farklı Departman":  Building2,
};

function DurumBadge({ durum }: { durum: DegerlenDurum }) {
  return durum === "Tamamlandı" ? (
    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Tamamlandı
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> Bekliyor
    </span>
  );
}

// ─── Radar Grafiği (SVG) ──────────────────────────────────────────────────────

function RadarGrafik({ puanlar }: { puanlar: YetkinlikPuan[] }) {
  const n = puanlar.length;
  const cx = 150; const cy = 150; const r = 110;

  function point(i: number, val: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (val / 100) * r;
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  }

  function labelPoint(i: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = r + 22;
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  }

  const roles: (keyof Omit<YetkinlikPuan, "ad">)[] = ["kendisi", "yonetici", "arkadas", "departman"];
  const colors = ["#818cf8", "#34d399", "#f59e0b", "#a78bfa"];

  function toPath(vals: number[]) {
    return vals.map((v, i) => {
      const p = point(i, v);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(" ") + " Z";
  }

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={Array.from({ length: n }, (_, i) => {
              const p = point(i, lvl);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(" ")}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
          />
        ))}
        {puanlar.map((_, i) => {
          const p = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#3f3f46" strokeWidth="1" />;
        })}
        {roles.map((rol, ri) => (
          <path
            key={rol}
            d={toPath(puanlar.map((p) => p[rol]))}
            fill={colors[ri]}
            fillOpacity="0.12"
            stroke={colors[ri]}
            strokeWidth="1.5"
          />
        ))}
        {puanlar.map((p, i) => {
          const lp = labelPoint(i);
          return (
            <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10">
              {p.ad}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 justify-center">
        {(["Kendisi", "Yönetici", "İş Arkadaşı", "Farklı Dept."] as const).map((label, i) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: colors[i] }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Grafiği ──────────────────────────────────────────────────────────────

function BarGrafik({ puanlar }: { puanlar: YetkinlikPuan[] }) {
  const colors = { kendisi: "bg-indigo-400", yonetici: "bg-emerald-400", arkadas: "bg-yellow-400", departman: "bg-violet-400" };
  const labels = { kendisi: "Kendisi", yonetici: "Yönetici", arkadas: "İş Arkadaşı", departman: "Farklı Dept." };

  return (
    <div className="space-y-4">
      {puanlar.map((p) => (
        <div key={p.ad} className="space-y-1.5">
          <div className="text-xs font-medium text-zinc-300">{p.ad}</div>
          {(["kendisi", "yonetici", "arkadas", "departman"] as const).map((rol) => (
            <div key={rol} className="flex items-center gap-2">
              <span className="w-20 text-xs text-zinc-500 text-right shrink-0">{labels[rol]}</span>
              <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colors[rol]}`} style={{ width: `${p[rol]}%` }} />
              </div>
              <span className="text-xs text-zinc-400 w-8 shrink-0">%{p[rol]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── AI Raporu ────────────────────────────────────────────────────────────────

function AIRaporu() {
  const ort = (vals: number[]) => Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  const genel = ort(MOCK_PUANLAR.map((p) => ort([p.kendisi, p.yonetici, p.arkadas, p.departman])));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-white">%{genel}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Genel Performans Skoru</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Yetkin</span>
            <span className="text-xs text-zinc-500">Şirket içi benzer rol sıralaması: İlk %23</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <TrendingUp className="w-4 h-4" /> Güçlü Yönler
          </div>
          <ul className="space-y-1">
            {["Sonuç odaklılık tüm değerlendiricilerde yüksek (%88 ort.)", "Problem çözme becerisinde istikrarlı performans", "İş arkadaşları takım çalışmasını güçlü buluyor"].map((m) => (
              <li key={m} className="flex items-start gap-1.5 text-xs text-zinc-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-400">
            <Lightbulb className="w-4 h-4" /> Gelişim Alanları
          </div>
          <ul className="space-y-1">
            {["Liderlik boyutunda yönetici ve departman puanları düşük", "İletişim becerisi ortalama, koçluk önerilir"].map((m) => (
              <li key={m} className="flex items-start gap-1.5 text-xs text-zinc-400">
                <ArrowRight className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" /> {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-400">
            <AlertTriangle className="w-4 h-4" /> Kör Noktalar
          </div>
          <ul className="space-y-1">
            {["Liderlik: Kendisi %80 değerlendirirken yönetici %72, farklı dept. %68 — aradaki fark belirgin", "Takım çalışması: Kişi %75, iş arkadaşları %88 görüyor"].map((m) => (
              <li key={m} className="flex items-start gap-1.5 text-xs text-zinc-400">
                <EyeOff className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /> {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-400">
            <Sparkles className="w-4 h-4" /> Önerilen Adımlar
          </div>
          <ul className="space-y-1">
            {["Liderlik gelişimi için mentorluk programına dahil edilmesi", "Çapraz ekip projelerinde sorumluluk artırımı", "İletişim için 1:1 koçluk seansları"].map((m) => (
              <li key={m} className="flex items-start gap-1.5 text-xs text-zinc-400">
                <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" /> {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Değerlendirme Kartı ──────────────────────────────────────────────────────

function DegerlendirmeKarti({ d, onRapor }: { d: Degerlendirme; onRapor: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const tamamlandi = d.degerlendiriciler.filter((x) => x.durum === "Tamamlandı").length;

  return (
    <div className={`bg-zinc-800/40 border rounded-xl overflow-hidden ${d.tamamlandi ? "border-emerald-500/20" : "border-zinc-700/50"}`}>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-700/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${d.tamamlandi ? "bg-emerald-400" : "bg-yellow-400"}`} />
          <div>
            <div className="text-sm font-semibold text-white">{d.calisan}</div>
            <div className="text-xs text-zinc-500">{d.pozisyon} · {d.baslamaTarihi}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{tamamlandi}/4 tamamlandı</span>
          {d.tamamlandi && (
            <button
              onClick={(e) => { e.stopPropagation(); onRapor(); }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Raporu Gör
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-700/50 px-5 py-4 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {d.degerlendiriciler.map((deg) => {
              const Icon = rolIkon[deg.rol];
              return (
                <div key={deg.rol} className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-zinc-500" />
                    <div>
                      <div className="text-xs font-medium text-zinc-300">{deg.rol}</div>
                      <div className="text-xs text-zinc-600">{deg.ad}</div>
                    </div>
                  </div>
                  <DurumBadge durum={deg.durum} />
                </div>
              );
            })}
          </div>
          {!d.tamamlandi && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400/70 mt-2">
              <Eye className="w-3.5 h-3.5" />
              Değerlendiriciler birbirinin yanıtlarını göremez (kör değerlendirme).
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Yeni Değerlendirme Formu ─────────────────────────────────────────────────

function YeniDegerlendirmeForm({ onClose }: { onClose: () => void }) {
  const [calisan, setCalisan] = useState("");
  const [pozisyon, setPozisyon] = useState("");
  const [emails, setEmails] = useState({ yonetici: "", arkadas: "", departman: "" });

  return (
    <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-5 space-y-4 max-w-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Yeni 360° Değerlendirme Başlat</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-white text-xs">İptal</button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Çalışan Adı</label>
            <input value={calisan} onChange={(e) => setCalisan(e.target.value)} placeholder="Ad Soyad" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Pozisyon</label>
            <input value={pozisyon} onChange={(e) => setPozisyon(e.target.value)} placeholder="Unvan" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        {([
          { key: "yonetici",  label: "Yönetici E-postası",        icon: Briefcase },
          { key: "arkadas",   label: "İş Arkadaşı E-postası",     icon: Users },
          { key: "departman", label: "Farklı Departman E-postası", icon: Building2 },
        ] as { key: keyof typeof emails; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1"><Icon className="w-3 h-3" />{label}</label>
            <input type="email" value={emails[key]} onChange={(e) => setEmails({ ...emails, [key]: e.target.value })} placeholder="degerlendirici@example.com" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500" />
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">Çalışanın kendisi de platforma davet edilir. Her değerlendirici bağımsız olarak e-posta ile bilgilendirilir.</p>
      <button
        disabled={!calisan || !pozisyon}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        <Mail className="w-4 h-4" /> Değerlendirmeyi Başlat
      </button>
    </div>
  );
}

// ─── CV Analizi Types & Data ──────────────────────────────────────────────────

interface AdayCV {
  id: string; ad: string; dosya: string;
  cvSkor: number; testSkor: number | null; nihai: number;
  gucluYonler: string[]; eksikYetkinlikler: string[]; ozet: string;
}

const MOCK_CV_ADAYLAR: AdayCV[] = [
  { id: "c1", ad: "Ayşe Kaya", dosya: "ayse_kaya_cv.pdf", cvSkor: 88, testSkor: 91, nihai: 90,
    gucluYonler: ["5 yıl React/TypeScript deneyimi", "AWS sertifikası mevcut", "Agile/Scrum liderliği"],
    eksikYetkinlikler: ["Go dili deneyimi yok", "Mobil geliştirme eksik"],
    ozet: "JD'deki teknik yetkinliklerin %88'i CV'de açıkça yer alıyor. Test sonucuyla birlikte en güçlü aday." },
  { id: "c2", ad: "Mert Yılmaz", dosya: "mert_yilmaz_cv.pdf", cvSkor: 74, testSkor: 82, nihai: 78,
    gucluYonler: ["Güçlü backend deneyimi (Node, Python)", "CI/CD pipeline kurulumu"],
    eksikYetkinlikler: ["Frontend yetkinliği sınırlı", "Cloud deneyimi yok", "Takım liderliği belirtilmemiş"],
    ozet: "Backend odaklı profil. JD'nin frontend beklentileri zayıf karşılanıyor, test puanı olumlu." },
  { id: "c3", ad: "Zeynep Arslan", dosya: "zeynep_arslan_cv.pdf", cvSkor: 92, testSkor: null, nihai: 92,
    gucluYonler: ["Full-stack (React + Django)", "Mikroservis mimarisi", "Teknik yöneticilik geçmişi"],
    eksikYetkinlikler: ["CV'de metrik odaklılık belirtilmemiş"],
    ozet: "En yüksek CV uyumu. Henüz test tamamlanmadı, nihai sıralama güncellenecek." },
  { id: "c4", ad: "Burak Demir", dosya: "burak_demir_cv.pdf", cvSkor: 61, testSkor: 58, nihai: 60,
    gucluYonler: ["Hızlı öğrenen", "Kişisel projeler GitHub'da"],
    eksikYetkinlikler: ["3 yıl bekleniyor, 1 yıl var", "Kurumsal proje deneyimi yok"],
    ozet: "Deneyim ve yetkinlik uyumu JD beklentisinin altında kalıyor." },
];

function cvSkorRenk(s: number) {
  if (s >= 85) return "text-emerald-400";
  if (s >= 70) return "text-indigo-400";
  if (s >= 55) return "text-yellow-400";
  return "text-red-400";
}
function cvSkorBg(s: number) {
  if (s >= 85) return "bg-emerald-400";
  if (s >= 70) return "bg-indigo-400";
  if (s >= 55) return "bg-yellow-400";
  return "bg-red-400";
}

function CVAdayKart({ aday, rank }: { aday: AdayCV; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-zinc-800/40 border rounded-xl overflow-hidden ${rank === 1 ? "border-emerald-500/30" : "border-zinc-700/50"}`}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-zinc-700/20 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${rank === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700/60 text-zinc-400"}`}>
          {rank === 1 ? <Trophy className="w-4 h-4" /> : rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{aday.ad}</span>
            {rank === 1 && <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">En Uyumlu</span>}
            {!aday.testSkor && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">Test Bekleniyor</span>}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">{aday.dosya}</div>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-center hidden sm:block">
            <div className="text-xs text-zinc-500">CV</div>
            <div className={`text-sm font-bold ${cvSkorRenk(aday.cvSkor)}`}>%{aday.cvSkor}</div>
          </div>
          {aday.testSkor && <div className="text-center hidden sm:block">
            <div className="text-xs text-zinc-500">Test</div>
            <div className={`text-sm font-bold ${cvSkorRenk(aday.testSkor)}`}>%{aday.testSkor}</div>
          </div>}
          <div className="text-center">
            <div className="text-xs text-zinc-500">Nihai</div>
            <div className={`text-lg font-bold ${cvSkorRenk(aday.nihai)}`}>%{aday.nihai}</div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
      </div>
      {expanded && (
        <div className="border-t border-zinc-700/50 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([["CV Uyumu", aday.cvSkor], ["Test Skoru", aday.testSkor], ["Nihai", aday.nihai]] as [string, number | null][]).map(([label, val]) => val !== null && (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-zinc-400">{label}</span><span className={cvSkorRenk(val)}>%{val}</span></div>
                <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${cvSkorBg(val)}`} style={{ width: `${val}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-900/50 rounded-lg px-3 py-2.5 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400">{aday.ozet}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium text-emerald-400 mb-1.5">Güçlü Yönler</div>
              <ul className="space-y-1">{aday.gucluYonler.map((g) => <li key={g} className="flex items-start gap-1.5 text-xs text-zinc-400"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{g}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-medium text-red-400 mb-1.5">Eksik Yetkinlikler</div>
              <ul className="space-y-1">{aday.eksikYetkinlikler.map((e) => <li key={e} className="flex items-start gap-1.5 text-xs text-zinc-400"><XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{e}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CVKarsilastirma({ adaylar }: { adaylar: AdayCV[] }) {
  const [sirala, setSirala] = useState<"nihai" | "cv" | "test">("nihai");
  const sorted = [...adaylar].sort((a, b) => {
    if (sirala === "cv") return b.cvSkor - a.cvSkor;
    if (sirala === "test") return (b.testSkor ?? 0) - (a.testSkor ?? 0);
    return b.nihai - a.nihai;
  });
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Karşılaştırma</span>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          {(["nihai", "cv", "test"] as const).map((k) => (
            <button key={k} onClick={() => setSirala(k)} className={`px-2 py-0.5 rounded ${sirala === k ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              {k === "nihai" ? "Nihai" : k === "cv" ? "CV" : "Test"}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-xs text-zinc-500 border-b border-zinc-700/30">
          <th className="text-left px-4 py-2.5 font-medium">Sıra</th>
          <th className="text-left px-4 py-2.5 font-medium">Aday</th>
          <th className="text-center px-4 py-2.5 font-medium">CV</th>
          <th className="text-center px-4 py-2.5 font-medium">Test</th>
          <th className="text-center px-4 py-2.5 font-medium">Nihai</th>
        </tr></thead>
        <tbody>{sorted.map((a, i) => (
          <tr key={a.id} className={`border-b border-zinc-700/20 last:border-b-0 ${i === 0 ? "bg-emerald-500/5" : ""}`}>
            <td className="px-4 py-3">{i === 0 ? <Trophy className="w-4 h-4 text-emerald-400" /> : <span className="text-zinc-500 text-xs">{i + 1}</span>}</td>
            <td className="px-4 py-3 font-medium text-zinc-200 text-sm">{a.ad}</td>
            <td className={`px-4 py-3 text-center text-sm font-semibold ${cvSkorRenk(a.cvSkor)}`}>%{a.cvSkor}</td>
            <td className="px-4 py-3 text-center text-sm">{a.testSkor !== null ? <span className={`font-semibold ${cvSkorRenk(a.testSkor)}`}>%{a.testSkor}</span> : <span className="text-zinc-600">—</span>}</td>
            <td className={`px-4 py-3 text-center text-sm font-bold ${cvSkorRenk(a.nihai)}`}>%{a.nihai}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

type CVMatchResult = {
  matchScore: number;
  matchLevel: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  recommendation: string;
  interviewSuggestions: string[];
};

function CVAnaliziModul() {
  const [jd, setJd] = useState("");
  const [cvText, setCvText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<CVMatchResult | null>(null);
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState<"liste" | "tablo">("liste");

  async function handleAnalyze() {
    if (jd.length < 50 || !cvText.trim()) return;
    setAnalyzing(true);
    setApiError("");
    try {
      const res = await fetch("/api/ai/match-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvContent: cvText, jobDescription: jd, language: "tr" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analiz hatası");
      setResult(data);
      setAnalyzed(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "CV analizi yapılamadı.");
    } finally {
      setAnalyzing(false);
    }
  }

  const sorted = [...MOCK_CV_ADAYLAR].sort((a, b) => b.nihai - a.nihai);

  return (
    <div className="space-y-5">
      {!analyzed ? (
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Görev Tanımı (JD)</label>
            <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={5} placeholder="Pozisyon başlığı, sorumluluklar, aranan yetkinlikler…" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">CV İçeriği</label>
            <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} rows={8} placeholder={"Adayın CV içeriğini buraya yapıştırın…\nİş deneyimi, eğitim, beceriler, sertifikalar vb."} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{apiError}
            </div>
          )}
          <div className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 text-xs text-zinc-400">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            Test sonuçları mevcut adaylar için CV skoru ve test skoru birleştirilerek nihai sıralama üretilir.
          </div>
          <button onClick={handleAnalyze} disabled={jd.length < 50 || !cvText.trim() || analyzing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            {analyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Claude analiz ediyor…</>
            ) : (
              <><Sparkles className="w-4 h-4" />CV Analiz Et — 10 Kontör</>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />Analiz tamamlandı
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setAnalyzed(false); setResult(null); setApiError(""); setJd(""); setCvText(""); }} className="text-xs text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 transition-colors">Yeni Analiz</button>
              <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 transition-colors"><Download className="w-3.5 h-3.5" />CSV İndir</button>
            </div>
          </div>

          {/* Real AI result */}
          {result && (
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shrink-0 ${result.matchScore >= 75 ? "border-emerald-500" : result.matchScore >= 50 ? "border-indigo-500" : "border-amber-500"}`}>
                  <span className={`text-xl font-bold ${result.matchScore >= 75 ? "text-emerald-400" : result.matchScore >= 50 ? "text-indigo-400" : "text-amber-400"}`}>%{result.matchScore}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">JD Uyum Skoru</div>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.matchedSkills?.length > 0 && (
                  <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3">
                    <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Eşleşen Beceriler</div>
                    <ul className="space-y-0.5">{result.matchedSkills.slice(0, 6).map((s) => <li key={s} className="text-xs text-zinc-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />{s}</li>)}</ul>
                  </div>
                )}
                {result.missingSkills?.length > 0 && (
                  <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3">
                    <div className="text-xs font-semibold text-red-400 mb-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />Eksik Yetkinlikler</div>
                    <ul className="space-y-0.5">{result.missingSkills.slice(0, 6).map((s) => <li key={s} className="text-xs text-zinc-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />{s}</li>)}</ul>
                  </div>
                )}
              </div>
              {result.interviewSuggestions?.length > 0 && (
                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3">
                  <div className="text-xs font-semibold text-indigo-400 mb-1.5">Önerilen Mülakat Soruları</div>
                  <ol className="space-y-1">{result.interviewSuggestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="shrink-0 w-4 h-4 rounded bg-zinc-700 text-zinc-300 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>{q}
                    </li>
                  ))}</ol>
                </div>
              )}
            </div>
          )}

          {/* Demo: multi-candidate comparison */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full font-medium">Demo</span>
              <p className="text-xs text-zinc-500">Toplu CV analizi örneği — {MOCK_CV_ADAYLAR.length} aday</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500/10 to-indigo-500/5 border border-emerald-500/25 rounded-xl px-5 py-4 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Önerilen Aday: {sorted[0].ad}</div>
                <p className="text-xs text-zinc-400 mt-0.5">{sorted[0].ozet}</p>
              </div>
              <span className="flex items-center gap-1 text-lg font-bold text-emerald-400 shrink-0"><Star className="w-4 h-4" />%{sorted[0].nihai}</span>
            </div>
            <div className="flex gap-1 border-b border-zinc-800">
              {(["liste", "tablo"] as const).map((id) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === id ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {id === "liste" ? "Aday Detayları" : "Karşılaştırma"}
                </button>
              ))}
            </div>
            {activeTab === "liste" && <div className="space-y-3">{sorted.map((a, i) => <CVAdayKart key={a.id} aday={a} rank={i + 1} />)}</div>}
            {activeTab === "tablo" && <div className="max-w-2xl"><CVKarsilastirma adaylar={MOCK_CV_ADAYLAR} /></div>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

export default function EvaluationPage() {
  const [modul, setModul] = useState<"360" | "cv">("360");
  const [activeTab, setActiveTab] = useState<"liste" | "rapor">("liste");
  const [showForm, setShowForm] = useState(false);
  const [raporAcik, setRaporAcik] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Modül Seçici */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">360° & CV Analizi</h1>
        <div className="flex gap-2 p-1 bg-zinc-800/60 rounded-xl w-fit">
          <button
            onClick={() => setModul("360")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${modul === "360" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <RotateCcw className="w-4 h-4" /> 360° Değerlendirme
          </button>
          <button
            onClick={() => setModul("cv")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${modul === "cv" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <FileScan className="w-4 h-4" /> CV Analizi
          </button>
        </div>
      </div>

      {/* ── 360° Değerlendirme ── */}
      {modul === "360" && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-zinc-400 text-sm">Çalışanları 4 perspektiften değerlendirin — kör değerlendirme ile güvenilir sonuçlar.</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0">
                <Plus className="w-4 h-4" /> Yeni Değerlendirme
              </button>
            )}
          </div>

          {showForm && <YeniDegerlendirmeForm onClose={() => setShowForm(false)} />}

          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-700/50">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Değerlendirici Yapısı</span>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-zinc-500 border-b border-zinc-700/30">
                <th className="text-left px-4 py-2.5 font-medium">Sıra</th>
                <th className="text-left px-4 py-2.5 font-medium">Değerlendirici</th>
                <th className="text-left px-4 py-2.5 font-medium">Soru Sayısı</th>
              </tr></thead>
              <tbody>
                {[
                  { sira: 1, rol: "Kişinin kendisi",    ikon: User,      sayi: "5 soru" },
                  { sira: 2, rol: "Yöneticisi",          ikon: Briefcase, sayi: "5 soru" },
                  { sira: 3, rol: "Bir iş arkadaşı",     ikon: Users,     sayi: "5 soru" },
                  { sira: 4, rol: "Farklı departmandan", ikon: Building2, sayi: "5 soru" },
                ].map(({ sira, rol, ikon: Icon, sayi }) => (
                  <tr key={sira} className="border-b border-zinc-700/20 last:border-b-0">
                    <td className="px-4 py-2.5 text-zinc-500 text-xs">{sira}</td>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2 text-zinc-300 text-sm"><Icon className="w-3.5 h-3.5 text-zinc-500" />{rol}</div></td>
                    <td className="px-4 py-2.5 text-zinc-400 text-xs">{sayi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-1 border-b border-zinc-800">
            {(["liste", "rapor"] as const).map((id) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === id ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500" : "text-zinc-500 hover:text-zinc-300"}`}>
                {id === "liste" ? "Değerlendirmeler" : "Rapor & Görselleştirme"}
              </button>
            ))}
          </div>

          {activeTab === "liste" && (
            <div className="space-y-3">
              {MOCK_DEGERLENDIRMELER.map((d) => (
                <DegerlendirmeKarti key={d.id} d={d} onRapor={() => { setRaporAcik(true); setActiveTab("rapor"); }} />
              ))}
            </div>
          )}

          {activeTab === "rapor" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="font-medium text-white">Ayşe Kaya</span>
                <span>·</span>
                <span>Kıdemli Yazılım Geliştirici</span>
                {!raporAcik && <button onClick={() => setRaporAcik(true)} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300">Raporu Yükle</button>}
              </div>
              {raporAcik && (
                <>
                  <AIRaporu />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Radar Grafiği</h3>
                    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6 flex justify-center">
                      <RadarGrafik puanlar={MOCK_PUANLAR} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Değerlendirici Bazlı Karşılaştırma</h3>
                    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5">
                      <BarGrafik puanlar={MOCK_PUANLAR} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ── CV Analizi ── */}
      {modul === "cv" && (
        <>
          <p className="text-zinc-400 text-sm">Görev tanımı ile CV'leri karşılaştırın — AI uyum skoru ve aday sıralaması üretir.</p>
          <CVAnaliziModul />
        </>
      )}
    </div>
  );
}
