"use client";

import { Search, MoreVertical, Plus } from "lucide-react";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Şirket Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Platformdaki tüm kurumsal müşterileri yönetin.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Yeni Şirket
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Şirket ara..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-zinc-400">Toplam: 124</span>
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Şirket Adı</th>
              <th className="px-6 py-3 font-medium">Sektör</th>
              <th className="px-6 py-3 font-medium">Kullanıcılar</th>
              <th className="px-6 py-3 font-medium">Kontör</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {[
              { name: "TechNova Ltd.", sector: "Yazılım", users: 12, credits: 450, status: "Aktif" },
              { name: "Global Lojistik", sector: "Lojistik", users: 4, credits: 120, status: "Aktif" },
              { name: "FinansBank", sector: "Finans", users: 45, credits: 2100, status: "Aktif" },
              { name: "Akıllı Ev A.Ş.", sector: "Tüketici Elektroniği", users: 8, credits: 0, status: "Pasif" }
            ].map((company) => (
              <tr key={company.name} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                <td className="px-6 py-4">{company.sector}</td>
                <td className="px-6 py-4">{company.users}</td>
                <td className="px-6 py-4 text-indigo-400 font-medium">{company.credits}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
