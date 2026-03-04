"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/ui/typewriter-text";

const container = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.4 0.1 264 / 0.35), transparent)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-6 px-6 max-w-3xl"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.span
          variants={item}
          className="text-xs font-semibold uppercase tracking-widest text-zinc-500"
        >
          Open Source Component Library
        </motion.span>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Build faster with{" "}
          <TypewriterText
            words={["beautiful UI", "smooth motion", "dark themes", "reusable code"]}
            className="text-indigo-400"
          />
        </motion.h1>

        <motion.p
          variants={item}
          className="text-zinc-400 text-lg max-w-xl leading-relaxed"
        >
          Animated, copy-paste React components for Next.js. Ship polished UIs
          in minutes, not hours.
        </motion.p>

        <motion.div variants={item} className="flex gap-4 flex-wrap justify-center">
          <Link
            href="#showcase"
            className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition-colors"
          >
            Browse Components
          </Link>
          <Link
            href="#"
            className="px-6 py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-colors"
          >
            View on GitHub
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export { HeroSection };
