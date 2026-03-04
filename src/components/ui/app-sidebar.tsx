"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  BarChart2,
  RotateCcw,
  FileScan,
  Coins,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Dokümanlar", icon: FileText },
  { href: "/tests", label: "Testler", icon: ClipboardList },
  { href: "/candidates", label: "Adaylar", icon: Users },
  { href: "/results", label: "Sonuçlar", icon: BarChart2 },
  { href: "/evaluation", label: "360° Değerlendirme", icon: RotateCcw },
  { href: "/cv-analysis", label: "CV Analizi", icon: FileScan },
  { href: "/credits", label: "Kontörler", icon: Coins },
  { href: "/settings", label: "Ayarlar", icon: Settings },
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
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-indigo-500/15 text-indigo-400 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export { AppSidebar };
