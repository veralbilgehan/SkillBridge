"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Building2, CheckCircle2, XCircle } from "lucide-react";
import { login } from "@/app/(auth)/actions";
import { StackingNavbar } from "@/components/ui/stacking-navbar";

function getPasswordRules(password: string) {
  return [
    { label: "En az 8 karakter", ok: password.length >= 8 },
    { label: "En az 1 büyük harf", ok: /[A-Z]/.test(password) },
    { label: "En az 1 rakam", ok: /[0-9]/.test(password) },
  ];
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const rules = getPasswordRules(password);
  const passwordValid = rules.every((r) => r.ok);

  const handleSubmit = async (formData: FormData) => {
    if (!passwordValid) return;
    setIsLoading(true);
    setErrorMsg("");
    formData.set("remember", remember ? "true" : "false");
    const result = await login(formData);
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
          <h1 className="text-2xl font-bold text-white mb-1">Tekrar Hoş Geldiniz</h1>
          <p className="text-zinc-400 text-sm">Hesabınıza giriş yapmak için bilgilerinizi girin.</p>
        </div>
        <div className="overflow-hidden pl-28">
          <StackingNavbar
            items={[
              { href: "/login", label: "Giriş Yap", active: true },
              { href: "/register", label: "Kayıt Ol" },
            ]}
          />
        </div>
      </div>

      <form action={handleSubmit} className="space-y-5">
        {/* ── Yan yana: E-posta + Şifre ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {/* E-posta */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Kullanıcı Adı / E-posta</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="ornek@sirket.com"
                required
              />
            </div>
          </div>

          {/* Şifre */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-zinc-300">Şifre</label>
              <Link href="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full pl-10 pr-4 py-3 bg-zinc-950/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                  passwordTouched && !passwordValid
                    ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500"
                    : "border-zinc-800 focus:ring-indigo-500/50 focus:border-indigo-500"
                }`}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Kural göstergeleri — sadece dokunulmuşsa ve geçersizse */}
            {passwordTouched && !passwordValid && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 pt-1"
              >
                {rules.map((rule) => (
                  <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.ok ? "text-emerald-400" : "text-red-400"}`}>
                    {rule.ok
                      ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 shrink-0" />
                    }
                    {rule.label}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Hint — dokunulmamışsa statik ipucu */}
            {!passwordTouched && (
              <p className="text-xs text-zinc-600 ml-1">Min. 8 karakter, 1 büyük harf, 1 rakam</p>
            )}
          </div>
        </div>

        {/* ── Bağlı Şirket ─────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 ml-1">
            Bağlı Şirket <span className="text-zinc-600 font-normal">(varsa)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="company"
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="Kurumsal hesaplar için şirket adı"
            />
          </div>
          <p className="text-xs text-zinc-600 ml-1">Bireysel hesaplar için boş bırakın.</p>
        </div>

        {/* ── Beni Hatırla ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRemember((r) => !r)}
            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
              remember
                ? "bg-indigo-500 border-indigo-500"
                : "bg-zinc-950/50 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {remember && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="text-sm text-zinc-400">
            Beni hatırla <span className="text-zinc-600">(30 gün)</span>
          </span>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            {errorMsg}
          </div>
        )}

        {/* ── Giriş Butonu ─────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading || (passwordTouched && !passwordValid)}
          className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>
    </motion.div>
  );
}
