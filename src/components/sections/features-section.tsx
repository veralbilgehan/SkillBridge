"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Zap, Users, FileText, Coins } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";

const features = [
  {
    icon: Zap,
    title: "AI Test Üretimi",
    description:
      "Dokümanlarınızdan veya sıfırdan saniyeler içinde kişiselleştirilmiş testler üretin. Claude ile güçlü.",
  },
  {
    icon: Users,
    title: "360° Değerlendirme",
    description:
      "Çalışanları yönetici, iş arkadaşı ve öz-değerlendirme perspektifinden ölçün. Kör noktaları keşfedin.",
  },
  {
    icon: FileText,
    title: "CV & JD Eşleştirme",
    description:
      "Görev tanımına en uyumlu adayları AI ile otomatik sıralayın. Toplu CV analizi desteği.",
  },
  {
    icon: Coins,
    title: "Kontör Ekonomisi",
    description:
      "Kullandığın kadar öde. Abonelik yok, sürpriz ücret yok. 50 kontör ile başla, ücretsiz.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="Özellikler"
          title="Değerlendirmenin her adımı burada"
          subtitle="Test oluşturmadan adaya davete, CV analizinden 360° rapora — tüm süreç tek platformda."
        />

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
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
