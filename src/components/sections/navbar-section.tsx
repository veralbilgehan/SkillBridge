"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NavbarSection = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-200 ${
        scrolled ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800" : "bg-transparent"
      }`}
    >
      <span className="font-bold text-white text-lg tracking-tight">
        Skill<span className="text-indigo-400">Bridge</span>
      </span>
      <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
        <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
        <Link href="#how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır</Link>
        <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlar</Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
        >
          Giriş Yap
        </Link>
        <Link
          href="/register"
          className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Ücretsiz Başla
        </Link>
      </div>
    </header>
  );
};

export { NavbarSection };
