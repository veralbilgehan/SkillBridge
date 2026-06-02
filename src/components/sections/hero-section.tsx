"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { renderCanvas } from "@/components/ui/canvas";

const container: Variants = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const HeroSection = () => {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden pt-16">
      {/* Canvas animation — mouse-tracked color trails */}
      <canvas
        id="hero-canvas"
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Gradient glow on top of canvas */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -5%, oklch(0.4 0.12 264 / 0.4), transparent)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-6 px-6 max-w-4xl"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.span
          variants={item}
          className="text-xs font-semibold uppercase tracking-widest text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 rounded-full"
        >
          AI Destekli Değerlendirme Platformu
        </motion.span>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Geleceğin değerlendirmesi{" "}
          <br />
          <TypewriterText
            words={[
              "AI destekli test üretimi",
              "360° performans değerlendirme",
              "doküman bazlı testler",
              "anlık aday analizi",
            ]}
            className="text-indigo-400"
          />
        </motion.h1>

        <motion.p
          variants={item}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Kendi dokümanlarınızdan saniyeler içinde AI ile test üretin, adaylarınızı davet edin,
          360° performans raporu alın. Kullandığın kadar öde.
        </motion.p>

        <motion.div variants={item} className="flex gap-4 flex-wrap justify-center mt-2">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-colors"
          >
            Ücretsiz Başla — 50 Kontör Hediye
          </Link>
          <Link
            href="#how-it-works"
            className="px-7 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Nasıl Çalışır?
          </Link>
        </motion.div>

        <motion.p variants={item} className="text-zinc-600 text-sm">
          Kredi kartı gerekmez · Kurulum yok · Anında kullanım
        </motion.p>

        {/* İşbirliği Bandı */}
        <motion.div
          variants={item}
          className="flex items-center gap-5 mt-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm"
        >
          {/* Mendomi Akademi logo */}
          <div className="flex flex-col items-center gap-1">
            <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
              {/* Sol bacak */}
              <polygon points="0,34 9,2 17,22" fill="#1B2E6B" />
              {/* Orta V */}
              <polygon points="9,2 22,26 35,2" fill="#1B2E6B" />
              {/* Sağ bacak */}
              <polygon points="27,22 35,2 44,34" fill="#1B2E6B" />
              {/* İç gölge */}
              <polygon points="9,2 17,22 22,12 27,22 35,2 22,26" fill="#243880" opacity="0.45" />
            </svg>
            <span className="text-[8px] font-medium tracking-widest text-blue-300/60 uppercase whitespace-nowrap">
              Mendomi Akademi
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* BIGsafer logo */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-black text-white tracking-tight leading-none">BIG</span>
              <span className="text-base font-bold text-green-400 tracking-tight leading-none">safer</span>
            </div>
            <div className="w-full h-0.5 rounded-full bg-gradient-to-r from-green-500/60 to-green-400/20" />
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* işbirliğiyle */}
          <span
            className="text-lg text-indigo-300/90 select-none"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic", fontWeight: 600 }}
          >
            işbirliğiyle
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export { HeroSection };
