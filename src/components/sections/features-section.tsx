"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Copy, Code } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";

const features = [
  {
    icon: Zap,
    title: "Motion-First",
    description:
      "Built with Framer Motion 12 for buttery-smooth interactions that feel native and polished.",
  },
  {
    icon: Copy,
    title: "Copy & Paste",
    description:
      "Self-contained components with no hidden peer dependencies. Drop them in and they just work.",
  },
  {
    icon: Code,
    title: "Fully Typed",
    description:
      "TypeScript-first with every prop documented. Autocomplete works out of the box.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-zinc-900 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="Built for Developers"
          title="Everything you need to ship faster"
          subtitle="Three principles behind every component in this library."
        />

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { FeaturesSection };
