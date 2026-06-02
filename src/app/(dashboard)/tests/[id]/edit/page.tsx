"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileEdit, Settings, Eye, Trash2 } from "lucide-react";

export default function EditTestPage() {
  const [activeTab, setActiveTab] = useState<"sorular" | "ayarlar">("sorular");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tests/1" className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Testi Düzenle</h1>
            <p className="text-zinc-400 text-sm mt-1">Yazılım Geliştirici - Temel Seviye</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-800 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium">
            <Eye className="w-4 h-4" /> Önizle
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Kaydet
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("sorular")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex gap-2 items-center ${activeTab === "sorular"
              ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500"
              : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          <FileEdit className="w-4 h-4" /> Sorular
        </button>
        <button
          onClick={() => setActiveTab("ayarlar")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex gap-2 items-center ${activeTab === "ayarlar"
              ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500"
              : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          <Settings className="w-4 h-4" /> Ayarlar
        </button>
      </div>

      {activeTab === "sorular" && (
        <div className="space-y-4">
          {[1, 2, 3].map((q) => (
            <div key={q} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded transition-colors"><FileEdit className="w-4 h-4" /></button>
                <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-4">
                <span className="text-zinc-500 font-mono mt-0.5">{q}.</span>
                <div className="flex-1 space-y-4">
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none resize-none"
                    defaultValue="Aşağıdaki JavaScript kod bloğunun çıktısı ne olur?"
                    rows={2}
                  />
                  <div className="space-y-2">
                    {["1, 2", "undefined, 2", "ReferenceError, 2", "undefined, TypeError"].map((opt, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input type="radio" name={`q${q}`} defaultChecked={i === 1} className="w-4 h-4 accent-indigo-500 bg-zinc-800 border-zinc-700" />
                        <input type="text" defaultValue={opt} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 font-medium hover:bg-zinc-900 hover:text-zinc-300 hover:border-zinc-700 transition-colors">
            + Yeni Soru Ekle
          </button>
        </div>
      )}

      {activeTab === "ayarlar" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Test Adı</label>
              <input type="text" defaultValue="Yazılım Geliştirici - Temel Seviye" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Sektör</label>
              <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option>Teknoloji / Yazılım</option>
                <option>Finans / Bankacılık</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Süre Limiti (Dakika)</label>
              <input type="number" defaultValue={30} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500 bg-zinc-800 border-zinc-700 rounded" />
                <span className="text-sm font-medium text-zinc-300">Soruları Karıştır</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
