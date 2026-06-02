"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Users, Tags, Coins, LayoutDashboard, LogOut } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Şirketler", icon: Building2 },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/taxonomy", label: "Taksonomi", icon: Tags },
  { href: "/admin/credits", label: "Kontörler", icon: Coins },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col sticky top-0">
        <div className="h-14 flex items-center px-5 border-b border-zinc-800 gap-2">
          <span className="font-bold text-white text-base">
            Skill<span className="text-red-400">Bridge</span>
          </span>
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-zinc-800">
          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
          <span className="text-zinc-400 text-sm">Platform Yönetim Paneli</span>
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
