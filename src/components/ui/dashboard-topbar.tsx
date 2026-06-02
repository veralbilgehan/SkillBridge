"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, AlertCircle, Mail, Gem, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock notifications ────────────────────────────────────────────────────────

type Notification = {
  id: string;
  type: "test_completed" | "credit_warning" | "email_opened" | "invite_sent";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFS: Notification[] = [
  { id: "n1", type: "test_completed", title: "Test Tamamlandı",    body: "Ayşe Kaya 'Yazılım Geliştirici' testini tamamladı.",         time: "5 dk",   read: false },
  { id: "n2", type: "test_completed", title: "Test Tamamlandı",    body: "Selin Çelik 'Yazılım Geliştirici' testini tamamladı.",       time: "2 sa",   read: false },
  { id: "n3", type: "credit_warning", title: "Kontör Uyarısı",     body: "Kontör bakiyeniz 10'un altına düştü. Lütfen yükleyin.",     time: "Dün",    read: true  },
  { id: "n4", type: "email_opened",   title: "Davet Açıldı",       body: "Zeynep Arslan davet e-postanızı açtı.",                     time: "Dün",    read: true  },
  { id: "n5", type: "invite_sent",    title: "Davetler Gönderildi", body: "3 adaya test daveti başarıyla gönderildi.",                time: "2 gün",  read: true  },
];

const ICON_MAP: Record<Notification["type"], React.ElementType> = {
  test_completed: CheckCircle2,
  credit_warning: AlertCircle,
  email_opened:   Mail,
  invite_sent:    Mail,
};

const COLOR_MAP: Record<Notification["type"], string> = {
  test_completed: "text-emerald-400 bg-emerald-400/10",
  credit_warning: "text-amber-400 bg-amber-400/10",
  email_opened:   "text-indigo-400 bg-indigo-400/10",
  invite_sent:    "text-violet-400 bg-violet-400/10",
};

const MOCK_CREDITS = 248;

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardTopbar = () => {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifs([]);
  }

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">
      <div />

      <div className="flex items-center gap-3">
        {/* Credits */}
        <Link
          href="/settings"
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/60 px-3 py-1.5 rounded-lg text-sm transition-colors"
        >
          <Gem className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-white font-semibold">{MOCK_CREDITS}</span>
          <span className="text-zinc-500">kontör</span>
        </Link>

        {/* Bell + dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
              open ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Bildirimler</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-medium">
                      {unreadCount} yeni
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded"
                    >
                      <Check className="w-3 h-3" /> Tümünü oku
                    </button>
                  )}
                  {notifs.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="py-10 text-center text-zinc-600 text-sm">Bildirim yok</div>
                ) : (
                  notifs.map((n) => {
                    const Icon = ICON_MAP[n.type];
                    const colors = COLOR_MAP[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0",
                          !n.read && "bg-indigo-500/4"
                        )}
                      >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colors)}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-300">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.body}</p>
                          <span className="text-[10px] text-zinc-600 mt-1 block">{n.time} önce</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                          className="text-zinc-700 hover:text-zinc-400 transition-colors shrink-0 mt-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-bold">
          BV
        </div>
      </div>
    </header>
  );
};

export { DashboardTopbar };
