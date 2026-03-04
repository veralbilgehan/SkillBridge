"use client";

import { LayoutGroup, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { StackingNavbar } from "@/components/ui/stacking-navbar";
import { TypewriterText } from "@/components/ui/typewriter-text";
import type { Tab } from "@/components/ui/animated-tabs";

const showcaseTabs: Tab[] = [
  {
    id: "stacking-navbar",
    label: "Stacking Navbar",
    content: (
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
          <StackingNavbar />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Hover over the navbar to see items expand with staggered spring animations.
          Items stack on top of each other when collapsed.
        </p>
      </div>
    ),
  },
  {
    id: "animated-tabs",
    label: "Animated Tabs",
    content: (
      <div className="flex flex-col gap-4 w-full">
        <LayoutGroup id="demo-tabs">
          <AnimatedTabs className="max-w-full" />
        </LayoutGroup>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Tab indicator slides between buttons with a spring layout animation.
          Content transitions with blur and scale effects.
        </p>
      </div>
    ),
  },
  {
    id: "typewriter-text",
    label: "Typewriter Text",
    content: (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold text-white">
            I build{" "}
            <TypewriterText
              words={["websites", "apps", "components", "interfaces"]}
              className="text-indigo-400"
            />
          </p>
          <p className="text-lg text-white">
            Made with{" "}
            <TypewriterText
              words={["React", "Next.js", "TypeScript", "Tailwind CSS"]}
              typingSpeed={50}
              deletingSpeed={25}
              pauseDuration={900}
              className="text-emerald-400"
            />
          </p>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Configurable typing speed, delete speed, and pause duration. Supports
          any className for custom styling.
        </p>
      </div>
    ),
  },
];

const ShowcaseSection = () => {
  return (
    <section id="showcase" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          badge="Component Library"
          title="Interactive previews, live in the page"
          subtitle="Every component is copy-paste ready with zero configuration."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <LayoutGroup id="showcase-tabs">
            <AnimatedTabs tabs={showcaseTabs} className="max-w-full" />
          </LayoutGroup>
        </motion.div>
      </div>
    </section>
  );
};

export { ShowcaseSection };
