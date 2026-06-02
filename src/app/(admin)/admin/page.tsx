"use client";

import { Users, Building2, Coins, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { name: "Toplam Şirket", value: "124", change: "+12%", trend: "up", icon: Building2 },
  { name: "Aktif Kullanıcı", value: "3,205", change: "+18%", trend: "up", icon: Users },
  { name: "Harcanan Kontör", value: "850K", change: "-4%", trend: "down", icon: Coins },
  { name: "Günlük Test Sayısı", value: "1,240", change: "+24%", trend: "up", icon: Activity },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Genel Bakış</h1>
        <p className="text-zinc-400 mt-1 text-sm">SkillBridge sisteminin anlık durumu ve istatistikleri.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-zinc-400" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                <div>
                  <div className="text-sm text-zinc-300">Yeni şirket kaydı: <span className="text-white font-medium">TechNova Ltd.</span></div>
                  <div className="text-xs text-zinc-500 mt-0.5">{i} saat önce</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Sistem Durumu</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Veritabanı Yükü</span>
                <span className="text-white">42%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">API Yanıt Süresi</span>
                <span className="text-white">124ms</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Sunucu Belleği</span>
                <span className="text-white">78%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
