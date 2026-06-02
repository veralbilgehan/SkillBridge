"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

const TABS = ["Sektörler", "Meslekler", "Yetkinlikler", "Ünvanlar"] as const;
type Tab = typeof TABS[number];

export default function TaxonomyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sektörler");

  const data = {
    Sektörler: ["Teknoloji / Yazılım", "Finans / Bankacılık", "Üretim / İmalat", "Sağlık", "E-Ticaret"],
    Meslekler: ["Yazılım Geliştirici", "Veri Analisti", "Proje Yöneticisi", "İnsan Kaynakları Uzmanı", "Satış Temsilcisi"],
    Yetkinlikler: ["Problem Çözme", "İletişim", "Analitik Düşünme", "Liderlik", "Takım Çalışması", "Müşteri Odaklılık"],
    Ünvanlar: ["Junior", "Mid-Level", "Senior", "Lead", "Manager", "Director"],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Taksonomi Yönetimi</h1>
          <p className="text-zinc-400 mt-1 text-sm">Sistem genelinde kullanılacak etiketleri ve kategorileri yönetin.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Yeni Ekle
        </button>
      </div>

      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === t
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <ul className="divide-y divide-zinc-800">
          {data[activeTab].map((item) => (
            <li key={item} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors">
              <span className="text-sm text-zinc-300">{item}</span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* always show icons for mock */}
                <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
