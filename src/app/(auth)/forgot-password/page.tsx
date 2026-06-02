"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call for password reset
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h1>
        <p className="text-zinc-400 text-sm">
          {!isSubmitted
            ? "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."
            : "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."}
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="ornek@sirket.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2"
          >
            Sıfırlama Bağlantısı Gönder
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
          <p className="text-emerald-400 text-sm mb-4">
            <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            Farklı bir e-posta adresi dene
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  );
}
