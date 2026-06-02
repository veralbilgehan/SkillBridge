"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  ClipboardList,
  ClipboardPlus,
  Users,
  UserPlus,
  BarChart2,
  RotateCcw,
  FileScan,
  FileSearch,
  Shield,
  Gem,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_CREDITS = 248;

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  sub?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard",         icon: LayoutDashboard },
  { href: "/documents",       label: "Dokümanlar",         icon: FileText },
  { href: "/documents/new",   label: "Doküman Oluştur",    icon: FilePlus,       sub: true },
  { href: "/tests",           label: "Testler",            icon: ClipboardList },
  { href: "/tests/new",       label: "Test Oluştur",        icon: ClipboardPlus,  sub: true },
  { href: "/candidates",      label: "Adaylar",            icon: Users },
  { href: "/candidates/invite", label: "Aday Davet Et",   icon: UserPlus,       sub: true },
  { href: "/vaka-analizi",    label: "Vaka Analizi",       icon: FileSearch },
  { href: "/results",         label: "Sonuçlar",           icon: BarChart2 },
  { href: "/evaluation",      label: "360° Değerlendirme", icon: RotateCcw },
  { href: "/cv-analysis",     label: "CV Analizi",         icon: FileScan },
  { href: "/settings",        label: "Kontörler & Ayarlar", icon: Gem },
  { href: "/admin",           label: "Yönetim Paneli",     icon: Shield },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col sticky top-0">
      <div className="h-14 flex items-center px-5 border-b border-zinc-800">
        <span className="font-bold text-white text-base">
          Skill<span className="text-indigo-400">Bridge</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, sub }) => {
          const active = pathname === href || (!sub && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm transition-colors",
                sub ? "ml-6 px-3 py-2" : "px-3 py-2.5",
                active
                  ? "bg-indigo-500/15 text-indigo-400 font-medium"
                  : sub
                  ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Credits widget */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
        <div className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2.5",
          MOCK_CREDITS < 10
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-zinc-800/60"
        )}>
          <div className="flex items-center gap-2">
            <Gem className={cn(
              "w-3.5 h-3.5 shrink-0",
              MOCK_CREDITS < 10 ? "text-red-400" : "text-indigo-400"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              MOCK_CREDITS < 10 ? "text-red-400" : "text-white"
            )}>
              {MOCK_CREDITS}
            </span>
            <span className="text-xs text-zinc-500">kontör</span>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-0.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <Plus className="w-3 h-3" /> Yükle
          </Link>
        </div>
      </div>
    </aside>
  );
};

export { AppSidebar };
