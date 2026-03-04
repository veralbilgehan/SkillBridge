"use client";

import { useEffect, useState } from "react";
import { StackingNavbar } from "@/components/ui/stacking-navbar";

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-12 bg-zinc-100/95 backdrop-blur-md transition-all duration-200 ${
        scrolled ? "border-b border-zinc-300" : ""
      }`}
    >
      <span className="font-bold text-zinc-900 text-lg tracking-tight">
        SkillBridge
      </span>
      <StackingNavbar />
    </header>
  );
};

export { SiteHeader };
