"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building2, ArrowRight, Loader2 } from "lucide-react";
import { register } from "@/app/(auth)/actions";
import { StackingNavbar } from "@/components/ui/stacking-navbar";

type AccountType = "individual" | "corporate";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg("");
    formData.append("accountType", accountType);
    const result = await register(formData);
    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Tab Switcher ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Aramıza Katılın</h1>
          <p className="text-zinc-400 text-sm">Hesap türünüzü seçin ve kaydınızı tamamlayın.</p>
        </div>
        <div className="overflow-hidden pl-28">
          <StackingNavbar
            items={[
              { href: "/login", label: "Giriş Yap" },
              { href: "/register", label: "Kayıt Ol", active: true },
            ]}
          />
        </div>
      </div>

      {/* ── Hesap Türü Toggle ─────────────────────────────────────────── */}
      <div className="flex p-1 bg-zinc-950/50 border border-zinc-800 rounded-xl mb-6 relative">
        <div
          className="absolute inset-y-1 bg-zinc-800 rounded-lg transition-all duration-300 ease-in-out"
          style={{
            width: "calc(50% - 4px)",
            transform: accountType === "individual" ? "translateX(0)" : "translateX(100%)",
          }}
        />
        <button
          onClick={() => setAccountType("individual")}
          type="button"
          className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
            accountType === "individual" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <User className="w-4 h-4" />
          Bireysel
        </button>
        <button
          onClick={() => setAccountType("corporate")}
          type="button"
          className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
            accountType === "corporate" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Kurumsal
        </button>
      </div>

      <form action={handleSubmit} className="space-y-5">

        {/* ── Yan yana: Ad/Şirket + Şifre ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {accountType === "individual" ? (
              <motion.div
                key="ad-soyad"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-zinc-300 ml-1">Ad Soyad</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Ad Soyad"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sirket-adi"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-zinc-300 ml-1">Şirket Adı</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Şirket A.Ş."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Şifre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Şifre</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-zinc-600 ml-1">Min. 8 karakter, 1 büyük harf, 1 rakam</p>
          </div>
        </div>

        {/* ── E-posta — tam genişlik ─────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 ml-1">E-posta Adresi</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="ornek@sirket.com"
            />
          </div>
        </div>

        {/* ── Kurumsal: Bağlı Şirket Notu ──────────────────────────────── */}
        <AnimatePresence>
          {accountType === "corporate" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-3 text-xs text-indigo-300">
                Kurumsal hesap olarak kaydolduğunuzda şirket admini olursunuz. Alt kullanıcı, doküman ve test yönetimi yapabilirsiniz.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMsg && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            {errorMsg}
          </div>
        )}

        {/* ── Kayıt Ol Butonu ───────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Kayıt Ol — 50 Kontör Hediye
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>
    </motion.div>
  );
}
