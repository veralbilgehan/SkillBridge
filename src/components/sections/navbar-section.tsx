"use client";

import Link from "next/link";
import {
  FileText,
  ClipboardList,
  RotateCcw,
  Users,
  BarChart2,
  Sparkles,
  BookOpen,
  FileSearch,
} from "lucide-react";
import { SkillBridgeHeader, type NavItem } from "@/components/ui/21st-navbar";

// ─── Menü Yapısı ──────────────────────────────────────────────────────────────

const menuItems: NavItem[] = [
  {
    text: "Özellikler",
    items: [
      {
        to: "#features",
        text: "AI Test Üretimi",
        description: "Dokümanlarınızdan saniyeler içinde soru bankası oluşturun.",
        icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      },
      {
        to: "#features",
        text: "360° Değerlendirme",
        description: "Çok kaynaklı performans analizleri ve yetkinlik raporları.",
        icon: <RotateCcw className="w-4 h-4 text-violet-400" />,
      },
      {
        to: "#features",
        text: "Doküman Kütüphanesi",
        description: "PDF, DOCX, PPTX yükleyin; AI ile içerik üretin.",
        icon: <FileText className="w-4 h-4 text-emerald-400" />,
      },
      {
        to: "#features",
        text: "Aday Yönetimi",
        description: "Davet edin, takip edin, raporlayın.",
        icon: <Users className="w-4 h-4 text-amber-400" />,
      },
    ],
  },
  {
    text: "Kullanım Alanları",
    items: [
      {
        to: "#how-it-works",
        text: "İşe Alım Süreçleri",
        description: "Adayları objektif testlerle değerlendirin.",
        icon: <ClipboardList className="w-4 h-4 text-indigo-400" />,
      },
      {
        to: "#how-it-works",
        text: "Çalışan Gelişimi",
        description: "Yetkinlik haritası ve bireysel gelişim planı.",
        icon: <BarChart2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        to: "#how-it-works",
        text: "Kişisel Öğrenme",
        description: "Bireysel kullanıcılar için kişiselleştirilmiş testler.",
        icon: <BookOpen className="w-4 h-4 text-violet-400" />,
      },
      {
        to: "#how-it-works",
        text: "Vaka Analizi",
        description: "Gerçekçi senaryolarla karar alma yetkinliği.",
        icon: <FileSearch className="w-4 h-4 text-amber-400" />,
      },
    ],
  },
  {
    text: "Nasıl Çalışır",
    to: "#how-it-works",
  },
  {
    text: "Fiyatlar",
    to: "#pricing",
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = () => (
  <Link href="/" className="font-bold text-white text-lg tracking-tight">
    Skill<span className="text-indigo-400">Bridge</span>
  </Link>
);

// ─── Sağ Butonlar ─────────────────────────────────────────────────────────────

const RightContent = () => (
  <>
    <Link
      href="/login"
      className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
    >
      Giriş Yap
    </Link>
    <Link
      href="/register"
      className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      Ücretsiz Başla
    </Link>
  </>
);

// ─── Export ───────────────────────────────────────────────────────────────────

const NavbarSection = () => (
  <SkillBridgeHeader
    logo={<Logo />}
    menuItems={menuItems}
    rightContent={<RightContent />}
  />
);

export { NavbarSection };
