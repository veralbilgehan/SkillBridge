"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { BookOpen, X, ChevronRight, Search } from "lucide-react";
import { kilavuzAra, type KilavuzMadde } from "@/data/kullanim-kilavuzu";

interface Pos { x: number; y: number }

function extractText(el: EventTarget | null): string {
  if (!el || !(el instanceof Element)) return "";
  const parts: string[] = [];

  // Seçili metin
  const sel = window.getSelection()?.toString().trim();
  if (sel && sel.length >= 2) parts.push(sel);

  // Tıklanan eleman ve yakın çevresi
  const targets = [el, el.parentElement, el.parentElement?.parentElement].filter(Boolean) as Element[];
  for (const t of targets) {
    if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) {
      if ((t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) && t.placeholder) parts.push(t.placeholder);
      if (t.value) parts.push(t.value);
      const label = document.querySelector(`label[for="${t.id}"]`);
      if (label?.textContent) parts.push(label.textContent);
    }
    const labelEl = t.closest("label") ?? t.querySelector("label");
    if (labelEl?.textContent) parts.push(labelEl.textContent);
    const text = t.textContent?.trim();
    if (text && text.length >= 2 && text.length < 200) parts.push(text);
  }

  return [...new Set(parts)].join(" ");
}

export default function ContextHelpMenu() {
  const [pos, setPos] = useState<Pos | null>(null);
  const [sonuclar, setSonuclar] = useState<KilavuzMadde[]>([]);
  const [acik, setAcik] = useState(false);
  const [secili, setSecili] = useState<KilavuzMadde | null>(null);
  const [aramaMetni, setAramaMetni] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const kapat = useCallback(() => {
    setPos(null);
    setAcik(false);
    setSecili(null);
    setAramaMetni("");
  }, []);

  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      const hedef = e.target as Element;
      // Kendi menümüz üzerinde sağ tık — kapatma
      if (menuRef.current?.contains(hedef)) return;

      const metin = extractText(e.target);
      const bulunan = kilavuzAra(metin);

      // Viewport sınırına göre konum ayarla
      const menuW = 380;
      const menuH = 480;
      let x = e.clientX + 12;
      let y = e.clientY + 8;
      if (x + menuW > window.innerWidth - 16) x = e.clientX - menuW - 8;
      if (y + menuH > window.innerHeight - 16) y = e.clientY - menuH - 8;

      e.preventDefault();
      setPos({ x, y });
      setSonuclar(bulunan);
      setSecili(bulunan[0] ?? null);
      setAramaMetni("");
      setAcik(true);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") kapat();
    }

    function onMouseDown(e: MouseEvent) {
      if (acik && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        kapat();
      }
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [acik, kapat]);

  // Arama sonuçlarını güncelle
  useEffect(() => {
    if (!aramaMetni) return;
    const bulunan = kilavuzAra(aramaMetni);
    setSonuclar(bulunan);
    setSecili(bulunan[0] ?? null);
  }, [aramaMetni]);

  if (!acik || !pos) return null;

  return (
    <div
      ref={menuRef}
      style={{ left: pos.x, top: pos.y, position: "fixed", zIndex: 9999 }}
      className="w-[380px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Başlık */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shrink-0">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <span className="text-sm font-semibold text-white flex-1">Kullanım Kılavuzu</span>
        <button onClick={kapat} className="text-zinc-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Arama */}
      <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            placeholder="Kılavuzda ara…"
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sol — Sonuç Listesi */}
        <div className="w-[140px] shrink-0 border-r border-zinc-800 overflow-y-auto py-1">
          {sonuclar.length === 0 ? (
            <p className="text-xs text-zinc-600 px-3 py-4 text-center leading-relaxed">
              {aramaMetni ? "Eşleşme bulunamadı." : "Bu alan için açıklama bulunamadı."}
            </p>
          ) : (
            sonuclar.map((m) => (
              <button
                key={m.baslik}
                onClick={() => setSecili(m)}
                className={`w-full text-left px-3 py-2.5 text-xs leading-snug transition-colors flex items-start gap-1.5 ${
                  secili?.baslik === m.baslik
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <ChevronRight className={`w-3 h-3 mt-0.5 shrink-0 transition-opacity ${secili?.baslik === m.baslik ? "opacity-100 text-indigo-400" : "opacity-0"}`} />
                <span className="truncate">{m.baslik}</span>
              </button>
            ))
          )}
        </div>

        {/* Sağ — İçerik */}
        <div className="flex-1 overflow-y-auto p-4 min-w-0">
          {secili ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <h3 className="text-sm font-semibold text-white leading-snug">{secili.baslik}</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {secili.icerik}
              </p>
              {secili.etiketler.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {secili.etiketler.slice(0, 6).map((e) => (
                    <span
                      key={e}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-pointer hover:text-white hover:border-zinc-600 transition-colors"
                      onClick={() => setAramaMetni(e)}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-zinc-600 text-center">
                Soldaki listeden bir madde seçin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="px-4 py-2 border-t border-zinc-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-zinc-600">Sağ tık → kılavuz açıklaması</span>
        <span className="text-[10px] text-zinc-700">ESC ile kapat</span>
      </div>
    </div>
  );
}
