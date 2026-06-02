"use client";

import { Search, MoreVertical, Shield } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Platformdaki bireysel ve kurumsal kullanıcıları yönetin.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Kullanıcı ara (isim, e-posta)..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-zinc-400">Toplam: 3,205</span>
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Kullanıcı Adı</th>
              <th className="px-6 py-3 font-medium">E-posta</th>
              <th className="px-6 py-3 font-medium">Rol</th>
              <th className="px-6 py-3 font-medium">Şirket</th>
              <th className="px-6 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {[
              { name: "Alper Yılmaz", email: "alper@technova.com", role: "Şirket Admini", company: "TechNova Ltd." },
              { name: "Selin Kaya", email: "selin@global.com", role: "Çalışan", company: "Global Lojistik" },
              { name: "Mehmet Demir", email: "m.demir@example.com", role: "Bireysel", company: "-" },
              { name: "Zeynep Çelik", email: "zeynep@finansbank.com", role: "Şirket Admini", company: "FinansBank" }
            ].map((user) => (
              <tr key={user.email} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Şirket Admini' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {user.role === 'Şirket Admini' && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user.company}</td>
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
