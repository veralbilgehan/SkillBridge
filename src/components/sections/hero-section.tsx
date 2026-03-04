"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { TypewriterText } from "@/components/ui/typewriter-text";

const container: Variants = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden pt-16">
      {/* Gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
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
      </motion.div>
    </section>
  );
};

export { HeroSection };
