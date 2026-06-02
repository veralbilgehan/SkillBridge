"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  Building2,
  Cpu,
  FolderOpen,
  Folder,
  FileText,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  ArrowRight,
  GraduationCap,
  Award,
  Database,
  Scale,
  FileCheck2,
  Lock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats } from "./actions";
import type { IsmsDashboardStats } from "@/lib/types/isms";

// ─── Types ───────────────────────────────────────────────────────────────────

type ControlType = "Önleyici" | "Dedektif" | "Düzeltici";

interface SubClause {
  id: string;
  title: string;
  subs?: SubClause[];
}

interface Clause {
  id: string;
  number: number;
  title: string;
  subs: SubClause[];
}

interface Control {
  id: string;
  title: string;
  types?: ControlType[];
}

interface ControlGroup {
  name: string;
  controls: Control[];
}

interface DocItem {
  name: string;
  tag?: string;
}

interface SubFolder {
  name: string;
  docs: DocItem[];
}

interface FolderNode {
  code: string;
  name: string;
  color: string;
  subFolders: SubFolder[];
}

// ─── Data: Maddeler 4–10 ─────────────────────────────────────────────────────

const CLAUSES: Clause[] = [
  {
    id: "4", number: 4, title: "Organizasyonun Bağlamı",
    subs: [
      { id: "4.1", title: "Organizasyonu ve bağlamını anlamak" },
      { id: "4.2", title: "İlgili tarafların ihtiyaç ve beklentilerini anlamak" },
      { id: "4.3", title: "BGYS kapsamını belirlemek" },
      { id: "4.4", title: "Bilgi güvenliği yönetim sistemi" },
    ],
  },
  {
    id: "5", number: 5, title: "Liderlik",
    subs: [
      { id: "5.1", title: "Liderlik ve bağlılık" },
      { id: "5.2", title: "Politika" },
      { id: "5.3", title: "Organizasyonel roller, sorumluluklar ve yetkiler" },
    ],
  },
  {
    id: "6", number: 6, title: "Planlama",
    subs: [
      {
        id: "6.1", title: "Risk ve fırsatları ele alan eylemler",
        subs: [
          { id: "6.1.1", title: "Genel" },
          { id: "6.1.2", title: "Bilgi güvenliği risk değerlendirmesi" },
          { id: "6.1.3", title: "Bilgi güvenliği risk işleme" },
        ],
      },
      { id: "6.2", title: "Bilgi güvenliği hedefleri ve bunlara ulaşmak için planlama" },
      { id: "6.3", title: "Değişikliklerin planlanması" },
    ],
  },
  {
    id: "7", number: 7, title: "Destek",
    subs: [
      { id: "7.1", title: "Kaynaklar" },
      { id: "7.2", title: "Yetkinlik" },
      { id: "7.3", title: "Farkındalık" },
      { id: "7.4", title: "İletişim" },
      {
        id: "7.5", title: "Dokümante edilmiş bilgi",
        subs: [
          { id: "7.5.1", title: "Genel" },
          { id: "7.5.2", title: "Oluşturma ve güncelleme" },
          { id: "7.5.3", title: "Dokümante edilmiş bilginin kontrolü" },
        ],
      },
    ],
  },
  {
    id: "8", number: 8, title: "Operasyon",
    subs: [
      { id: "8.1", title: "Operasyonel planlama ve kontrol" },
      { id: "8.2", title: "Bilgi güvenliği risk değerlendirmesi" },
      { id: "8.3", title: "Bilgi güvenliği risk işleme" },
    ],
  },
  {
    id: "9", number: 9, title: "Performans Değerlendirmesi",
    subs: [
      { id: "9.1", title: "İzleme, ölçme, analiz ve değerlendirme" },
      {
        id: "9.2", title: "İç denetim",
        subs: [
          { id: "9.2.1", title: "Genel" },
          { id: "9.2.2", title: "İç denetim programı" },
        ],
      },
      {
        id: "9.3", title: "Yönetimin gözden geçirilmesi",
        subs: [
          { id: "9.3.1", title: "Genel" },
          { id: "9.3.2", title: "Yönetimin gözden geçirme girdileri" },
          { id: "9.3.3", title: "Yönetimin gözden geçirme sonuçları" },
        ],
      },
    ],
  },
  {
    id: "10", number: 10, title: "İyileştirme",
    subs: [
      { id: "10.1", title: "Sürekli iyileştirme" },
      { id: "10.2", title: "Uygunsuzluk ve düzeltici faaliyet" },
    ],
  },
];

// ─── Data: A.5 Organizasyonel (37 kontrol) ───────────────────────────────────

const A5_GROUPS: ControlGroup[] = [
  {
    name: "Politikalar",
    controls: [
      { id: "A.5.1", title: "Bilgi güvenliği politikaları" },
      { id: "A.5.4", title: "Yönetim sorumlulukları" },
      { id: "A.5.37", title: "Dokümante edilmiş operasyonel prosedürler" },
    ],
  },
  {
    name: "Varlık Yönetimi",
    controls: [
      { id: "A.5.9", title: "Bilgi ve ilgili varlıkların envanteri" },
      { id: "A.5.10", title: "Bilgi ve ilgili varlıkların kabul edilebilir kullanımı" },
      { id: "A.5.11", title: "Varlıkların iadesi" },
      { id: "A.5.12", title: "Bilginin sınıflandırılması" },
      { id: "A.5.13", title: "Bilginin etiketlenmesi" },
      { id: "A.5.14", title: "Bilgi transferi" },
    ],
  },
  {
    name: "Erişim",
    controls: [
      { id: "A.5.2", title: "Bilgi güvenliği rolleri ve sorumlulukları" },
      { id: "A.5.3", title: "Görev ayrılığı" },
      { id: "A.5.5", title: "Yetkililerle iletişim" },
      { id: "A.5.6", title: "Özel ilgi gruplarıyla iletişim" },
      { id: "A.5.7", title: "Tehdit istihbaratı" },
      { id: "A.5.8", title: "Proje yönetiminde bilgi güvenliği" },
      { id: "A.5.15", title: "Erişim kontrolü" },
      { id: "A.5.16", title: "Kimlik yönetimi" },
      { id: "A.5.17", title: "Kimlik doğrulama bilgileri" },
      { id: "A.5.18", title: "Erişim hakları" },
    ],
  },
  {
    name: "Tedarikçi İlişkileri",
    controls: [
      { id: "A.5.19", title: "Tedarikçi ilişkilerinde bilgi güvenliği" },
      { id: "A.5.20", title: "Tedarikçi anlaşmalarında bilgi güvenliğinin ele alınması" },
      { id: "A.5.21", title: "BİT tedarik zincirinde bilgi güvenliğinin yönetimi" },
      { id: "A.5.22", title: "Tedarikçi hizmetlerinin izlenmesi, gözden geçirilmesi ve değişim yönetimi" },
      { id: "A.5.23", title: "Bulut hizmetlerinin kullanımında bilgi güvenliği" },
    ],
  },
  {
    name: "Olay Yönetimi ve Uyum",
    controls: [
      { id: "A.5.24", title: "Bilgi güvenliği olay yönetimi planlaması ve hazırlığı" },
      { id: "A.5.25", title: "Bilgi güvenliği olaylarının değerlendirilmesi ve karar verilmesi" },
      { id: "A.5.26", title: "Bilgi güvenliği olaylarına müdahale" },
      { id: "A.5.27", title: "Bilgi güvenliği olaylarından ders çıkarma" },
      { id: "A.5.28", title: "Kanıt toplama" },
      { id: "A.5.29", title: "Aksama sırasında bilgi güvenliği" },
      { id: "A.5.30", title: "İş sürekliliği için BİT hazırlığı" },
      { id: "A.5.31", title: "Yasal, yasal, düzenleyici ve sözleşmesel gereksinimler" },
      { id: "A.5.32", title: "Fikri mülkiyet hakları" },
      { id: "A.5.33", title: "Kayıtların korunması" },
      { id: "A.5.34", title: "Gizlilik ve kişisel tanımlanabilir bilgilerin korunması" },
      { id: "A.5.35", title: "Bilgi güvenliğinin bağımsız gözden geçirilmesi" },
      { id: "A.5.36", title: "Bilgi güvenliği politikaları ve standartlarıyla uyumluluk" },
    ],
  },
];

// ─── Data: A.6 İnsan (8 kontrol) ─────────────────────────────────────────────

const A6_CONTROLS: Control[] = [
  { id: "A.6.1", title: "Tarama (İşe Alım Öncesi Kontrol)" },
  { id: "A.6.2", title: "İstihdam hüküm ve koşulları" },
  { id: "A.6.3", title: "Bilgi güvenliği farkındalığı, eğitim ve öğretim" },
  { id: "A.6.4", title: "Disiplin süreci" },
  { id: "A.6.5", title: "İstihdam sonrası veya değişiklik sonrası sorumluluklar" },
  { id: "A.6.6", title: "Gizlilik veya ifşa etmeme anlaşmaları" },
  { id: "A.6.7", title: "Uzaktan çalışma" },
  { id: "A.6.8", title: "Bilgi güvenliği olayı bildirimi" },
];

// ─── Data: A.7 Fiziksel (14 kontrol) ─────────────────────────────────────────

const A7_GROUPS: ControlGroup[] = [
  {
    name: "Güvenli Alanlar",
    controls: [
      { id: "A.7.1", title: "Fiziksel güvenlik çevreleri" },
      { id: "A.7.2", title: "Fiziksel giriş" },
      { id: "A.7.3", title: "Ofislerin, odaların ve tesislerin güvenliği" },
      { id: "A.7.4", title: "Fiziksel güvenlik izleme" },
      { id: "A.7.5", title: "Fiziksel ve çevresel tehditlere karşı koruma" },
      { id: "A.7.6", title: "Güvenli alanlarda çalışma" },
      { id: "A.7.7", title: "Temiz masa ve temiz ekran" },
    ],
  },
  {
    name: "Ekipman Güvenliği",
    controls: [
      { id: "A.7.8", title: "Ekipman yerleşimi ve korunması" },
      { id: "A.7.9", title: "Tesis dışındaki varlıkların güvenliği" },
      { id: "A.7.10", title: "Depolama ortamı" },
      { id: "A.7.11", title: "Destek hizmetleri" },
      { id: "A.7.12", title: "Kablo güvenliği" },
      { id: "A.7.13", title: "Ekipman bakımı" },
      { id: "A.7.14", title: "Ekipmanın güvenli imhası veya yeniden kullanımı" },
    ],
  },
];

// ─── Data: A.8 Teknolojik (34 kontrol) ───────────────────────────────────────

const A8_GROUPS: ControlGroup[] = [
  {
    name: "Uç Nokta",
    controls: [
      { id: "A.8.1", title: "Kullanıcı uç nokta cihazları", types: ["Önleyici"] },
      { id: "A.8.2", title: "Ayrıcalıklı erişim hakları", types: ["Önleyici"] },
      { id: "A.8.3", title: "Bilgiye erişim kısıtlaması", types: ["Önleyici"] },
      { id: "A.8.4", title: "Kaynak koduna erişim", types: ["Önleyici"] },
      { id: "A.8.5", title: "Güvenli kimlik doğrulama", types: ["Önleyici"] },
      { id: "A.8.6", title: "Kapasite yönetimi", types: ["Önleyici"] },
      { id: "A.8.7", title: "Zararlı yazılımlara karşı koruma", types: ["Önleyici", "Dedektif"] },
    ],
  },
  {
    name: "Ağ",
    controls: [
      { id: "A.8.20", title: "Ağ güvenliği", types: ["Önleyici"] },
      { id: "A.8.21", title: "Ağ hizmetlerinin güvenliği", types: ["Önleyici"] },
      { id: "A.8.22", title: "Ağların ayrıştırılması", types: ["Önleyici"] },
    ],
  },
  {
    name: "Yazılım",
    controls: [
      { id: "A.8.8",  title: "Teknik güvenlik açıklarının yönetimi", types: ["Önleyici", "Düzeltici"] },
      { id: "A.8.9",  title: "Yapılandırma yönetimi", types: ["Önleyici"] },
      { id: "A.8.10", title: "Bilginin silinmesi", types: ["Önleyici"] },
      { id: "A.8.11", title: "Veri maskeleme", types: ["Önleyici"] },
      { id: "A.8.12", title: "Veri sızıntısı önleme", types: ["Önleyici", "Dedektif"] },
      { id: "A.8.13", title: "Bilgi yedekleme", types: ["Düzeltici"] },
      { id: "A.8.14", title: "Bilgi işleme tesislerinin gereksizliği", types: ["Önleyici", "Düzeltici"] },
      { id: "A.8.15", title: "Kayıt tutma (Loglama)", types: ["Dedektif"] },
      { id: "A.8.16", title: "İzleme faaliyetleri", types: ["Dedektif"] },
      { id: "A.8.17", title: "Saat senkronizasyonu", types: ["Dedektif"] },
      { id: "A.8.18", title: "Ayrıcalıklı yardımcı programların kullanımı", types: ["Önleyici"] },
      { id: "A.8.19", title: "Operasyonel sistemlere yazılım kurulumu", types: ["Önleyici"] },
      { id: "A.8.23", title: "Web filtreleme", types: ["Önleyici"] },
      { id: "A.8.24", title: "Kriptografi kullanımı", types: ["Önleyici"] },
    ],
  },
  {
    name: "Geliştirme / Test Ortamı",
    controls: [
      { id: "A.8.25", title: "Güvenli geliştirme yaşam döngüsü", types: ["Önleyici"] },
      { id: "A.8.26", title: "Uygulama güvenliği gereksinimleri", types: ["Önleyici"] },
      { id: "A.8.27", title: "Güvenli sistem mimarisi ve mühendislik ilkeleri", types: ["Önleyici"] },
      { id: "A.8.28", title: "Güvenli kodlama", types: ["Önleyici"] },
      { id: "A.8.29", title: "Geliştirme ve kabul sürecinde güvenlik testi", types: ["Dedektif", "Önleyici"] },
      { id: "A.8.30", title: "Dış kaynaklı geliştirme", types: ["Önleyici"] },
      { id: "A.8.31", title: "Geliştirme, test ve üretim ortamlarının ayrıştırılması", types: ["Önleyici"] },
      { id: "A.8.32", title: "Değişim yönetimi", types: ["Önleyici"] },
      { id: "A.8.33", title: "Test bilgisi", types: ["Önleyici"] },
      { id: "A.8.34", title: "Denetim testi sırasında bilgi sistemlerinin korunması", types: ["Önleyici"] },
    ],
  },
];

// ─── Data: Klasör Yapısı ──────────────────────────────────────────────────────

const FOLDER_TREE: FolderNode[] = [
  {
    code: "00", name: "Politikalar", color: "indigo",
    subFolders: [
      {
        name: "BGYS Üst Politikaları",
        docs: [
          { name: "Bilgi Güvenliği Yönetim Sistemi Politikası.docx", tag: "Zorunlu" },
          { name: "Bilgi Güvenliği Yönetim Sistemi Politikası (İngilizce).docx", tag: "Zorunlu" },
        ],
      },
      {
        name: "Gizlilik & Kişisel Veri",
        docs: [
          { name: "01.TR KVKK Aydınlatma Metni.docx" },
          { name: "01.TR Bilgi Güvenliği Saklama ve İmha Politikası.docx" },
        ],
      },
      {
        name: "Operasyonel Politikalar",
        docs: [
          { name: "Temiz Masa Temiz Ekran Politikası.docx" },
          { name: "Taşınabilir Cihaz Politikası.docx" },
          { name: "Uzaktan Erişim Politikası.docx" },
          { name: "Lisanslı Yazılım Kullanım Politikası.docx" },
          { name: "Bilgi Alışverişi Politikası.docx" },
        ],
      },
      {
        name: "Güvenlik & Varlık Yönetimi",
        docs: [
          { name: "Güvenlik Farkındalığı Politikası.docx" },
          { name: "Bilgi Varlıkları İmha Politikası.docx" },
          { name: "Üçüncü Taraf Güvenlik Politikası.docx" },
        ],
      },
    ],
  },
  {
    code: "01", name: "Prosedürler", color: "blue",
    subFolders: [
      {
        name: "Teknik Güvenlik Prosedürleri",
        docs: [
          { name: "Haberleşme Güvenliği Prosedürü.docx" },
          { name: "Parola Prosedürü.docx" },
          { name: "Güvenli Yazılım Geliştirme Prosedürü.docx" },
          { name: "Kriptografi Prosedürü.docx" },
          { name: "Teçhizat ve Medya Güvenliği Prosedürü.docx" },
          { name: "Erişim Kontrol Prosedürü.docx" },
          { name: "İşletim Güvenliği Prosedürü.docx" },
          { name: "Güvenli Sistem Mühendisliği Prosedürü.docx" },
        ],
      },
      {
        name: "Olay & Fiziksel Güvenlik",
        docs: [
          { name: "Bilgi Güvenliği İhlal Olay Prosedürü.docx", tag: "Kritik" },
          { name: "Fiziksel Güvenlik Prosedürü.docx" },
        ],
      },
      {
        name: "Yönetim Sistemi Prosedürleri",
        docs: [
          { name: "Doküman Yönetim Prosedürü.docx", tag: "Zorunlu" },
          { name: "Disiplin Prosedürü.docx" },
          { name: "EYS Varlıkları Belirleme Risk Değerlendirme Prosedürü.docx" },
          { name: "Değişiklik Yönetimi Prosedürü.docx" },
          { name: "İletişim Prosedürü.docx" },
          { name: "Kayıtların Kontrolü Prosedürü.docx", tag: "Zorunlu" },
          { name: "İç Denetim Prosedürü.docx", tag: "Zorunlu" },
          { name: "Düzeltici ve İyileştirici Faaliyetler Prosedürü.docx" },
          { name: "Yönetimin Gözden Geçirmesi Prosedürü.docx", tag: "Zorunlu" },
        ],
      },
      {
        name: "Operasyonel & İnsan Kaynakları",
        docs: [
          { name: "Tasarım ve Geliştirme Prosedürü.docx" },
          { name: "Satınalma Prosedürü.docx" },
          { name: "İzleme, Ölçme, Analiz ve Değerlendirme Prosedürü.docx" },
          { name: "İnsan Kaynakları Güvenliği Prosedürü.docx" },
          { name: "İzin İşlemleri Prosedürü.docx" },
          { name: "Eğitim Yönetimi Prosedürü.docx" },
          { name: "Müşteri İlişkileri Prosedürü.docx" },
        ],
      },
    ],
  },
  {
    code: "02", name: "Formlar", color: "cyan",
    subFolders: [
      {
        name: "Güvenlik & Olay Formları",
        docs: [
          { name: "Bilgi Güvenliği İhlal Olay Formu.docx" },
          { name: "Yedekleme Tutanak Formu.docx" },
          { name: "Veri Sahibi Başvuru Formu.docx" },
        ],
      },
      {
        name: "Yönetim & Süreç Formları",
        docs: [
          { name: "Düzeltici Faaliyet İsteği Formu.docx" },
          { name: "Doküman Şablonu.docx" },
          { name: "Yönetim Gözden Geçirme Raporu Formu.docx" },
          { name: "Değişiklik Kayıt Formu.xlsx" },
          { name: "Yazılım Test Formu.docx" },
        ],
      },
      {
        name: "İnsan Kaynakları & Anketler",
        docs: [
          { name: "Eğitim Katılım Formu.docx" },
          { name: "İşe Giriş Çıkış Kontrol Formu.docx" },
          { name: "Çalışan Memnuniyet Anket ve Öneri Formu.docx" },
          { name: "Müşteri Memnuniyet Anketi.docx" },
          { name: "Tedarikçi Memnuniyet Anketi.docx" },
          { name: "Müşteri Analiz Tutanağı.docx" },
        ],
      },
    ],
  },
  {
    code: "03", name: "Sözleşmeler", color: "purple",
    subFolders: [
      {
        name: "Çalışan Sözleşmeleri",
        docs: [
          { name: "Bilgisayar ve İnternet Zimmet ve Kullanım Sözleşmesi.docx" },
          { name: "Çalışan Gizlilik Taahhütnamesi.docx" },
          { name: "Belirsiz Süreli İş Sözleşmesi.docx" },
        ],
      },
      {
        name: "Üçüncü Taraf Sözleşmeleri",
        docs: [
          { name: "Üçüncü Taraf Sözleşmesi.docx" },
        ],
      },
    ],
  },
  {
    code: "04", name: "Organizasyon", color: "amber",
    subFolders: [
      {
        name: "Atama Yazıları",
        docs: [
          { name: "Yönetim Sistemleri Atama Yazısı - 2024.docx" },
          { name: "Yönetim Sistemleri Atama Yazısı - 2025.docx" },
        ],
      },
      {
        name: "Görev Tanımları & Şema",
        docs: [
          { name: "Bilgi Güvenliği Yönetim Sistemi Görev Tanımı.docx" },
          { name: "Bilgi Teknolojileri Uzmanı Görev Tanımı.docx" },
          { name: "Organizasyon Şeması.pptx" },
        ],
      },
    ],
  },
  {
    code: "05", name: "Uygulanabilirlik Belgesi", color: "green",
    subFolders: [
      {
        name: "SoA Belgeleri",
        docs: [
          { name: "Uygulanabilirlik Bildirgesi (SoA) — Güncel Versiyon", tag: "Zorunlu" },
          { name: "SoA Gerekçe Tablosu (93 Kontrol)" },
          { name: "Kapsam Dışı Kontroller Gerekçe Belgesi" },
        ],
      },
      {
        name: "SoA Revizyonları",
        docs: [
          { name: "SoA Rev.1 — Arşiv" },
          { name: "SoA Rev.2 — Arşiv" },
          { name: "SoA Değişiklik Geçmişi" },
        ],
      },
    ],
  },
  {
    code: "06", name: "El Kitabı ve Kılavuz", color: "teal",
    subFolders: [
      {
        name: "Yapı ve Görev Tanımları",
        docs: [
          { name: "Organizasyon Şeması" },
          { name: "BGYS Rolleri ve Sorumluluklar Matrisi (RACI)", tag: "Zorunlu" },
          { name: "Bilgi Güvenliği Yöneticisi (CISO) Yetki Belgesi" },
          { name: "BGYS Komitesi Yetki ve Görev Tanımı" },
        ],
      },
      {
        name: "İletişim ve Koordinasyon",
        docs: [
          { name: "Yetkili Makamlar İletişim Listesi" },
          { name: "Güvenlik İletişim Planı" },
          { name: "Özel İlgi Grupları Üyelik Listesi" },
        ],
      },
    ],
  },
  {
    code: "07", name: "Planlar", color: "indigo",
    subFolders: [
      {
        name: "Yönetim El Kitapları",
        docs: [
          { name: "BGYS El Kitabı", tag: "Zorunlu" },
          { name: "BGYS Kapsamı ve Sınırları Belgesi" },
          { name: "Bilgi Güvenliği Hedefleri Belgesi" },
        ],
      },
      {
        name: "Kullanıcı Kılavuzları",
        docs: [
          { name: "Kullanıcı Bilgi Güvenliği Kılavuzu" },
          { name: "Güvenli Uzaktan Çalışma Kılavuzu" },
          { name: "Sosyal Mühendislik ve Kimlik Avı Farkındalık Kılavuzu" },
          { name: "Veri Sınıflandırma ve Etiketleme Kılavuzu" },
        ],
      },
      {
        name: "Teknik Kılavuzlar",
        docs: [
          { name: "Sistem Yöneticisi Güvenlik Kılavuzu" },
          { name: "Kriptografi Kullanım Kılavuzu" },
          { name: "Güvenli Geliştirme Kılavuzu (SSDLC)" },
          { name: "Ağ Güvenliği Yapılandırma Kılavuzu" },
          { name: "Antivirüs ve EDR Yönetim Kılavuzu" },
        ],
      },
    ],
  },
  {
    code: "08", name: "Dinamik Dokümanlar", color: "rose",
    subFolders: [
      {
        name: "Yönetim & Planlama",
        docs: [
          { name: "Entegre Yönetim Sistemi El Kitabı.doc", tag: "Canlı" },
          { name: "Risk Analizi ve İşleme Planı.xlsx", tag: "Canlı" },
          { name: "Uygulanabilirlik Bildirgesi.xlsx", tag: "Canlı" },
          { name: "Hedefler ve Performans Ölçümü Tablosu.xlsx", tag: "Canlı" },
        ],
      },
      {
        name: "Envanter & Takip",
        docs: [
          { name: "Bilgi ve Bilgi Varlıkları Envanteri.xlsx", tag: "Canlı" },
          { name: "Doküman ve Kayıt Takip Listesi.xlsx", tag: "Canlı" },
          { name: "Organizasyon Şeması.xlsx", tag: "Canlı" },
          { name: "Tedarikçi Değerlendirme.xlsx", tag: "Canlı" },
        ],
      },
    ],
  },
  {
    code: "09", name: "Talimatlar", color: "orange",
    subFolders: [
      {
        name: "Talimatlar",
        docs: [
          { name: "Varlıkların Kabul Edilebilir Kullanımı Talimatı.docx" },
          { name: "Proje Yönetiminde Bilgi Güvenliği Talimatı.docx" },
          { name: "Konfigrasyon Yönetimi Talimatı.docx" },
          { name: "Tedarikçi Değerlendirme Talimatı.docx" },
        ],
      },
    ],
  },
  {
    code: "10", name: "Kişisel Bilgilerin Gizliliği ve Korunması", color: "purple",
    subFolders: [
      {
        name: "Aydınlatma & Başvuru",
        docs: [
          { name: "Aydınlatma Metni - Çalışan.docx" },
          { name: "Kapalı Devre Kamera Kayıt Sistemi Aydınlatma Metni.docx" },
          { name: "Veri Sahibi Başvuru Formu.docx" },
        ],
      },
    ],
  },
  {
    code: "12", name: "İş Süreçleri", color: "teal",
    subFolders: [
      {
        name: "Süreç Belgeleri",
        docs: [
          { name: "Kritik İş Süreçleri Listesi", tag: "Zorunlu" },
          { name: "Süreç Akış Diyagramları" },
          { name: "İş Süreçleri Bağımlılık Haritası" },
          { name: "Süreç Sahipleri Tablosu" },
        ],
      },
      {
        name: "Süreklililik Analizleri",
        docs: [
          { name: "İş Etki Analizi (BIA)", tag: "Kritik" },
          { name: "Kritik Sistem ve Uygulama Listesi" },
          { name: "Minimum Hizmet Seviyeleri Tablosu" },
        ],
      },
    ],
  },
  {
    code: "13", name: "Toplantı Notları", color: "zinc",
    subFolders: [
      {
        name: "BGYS Komitesi",
        docs: [
          { name: "BGYS Komitesi Toplantı Tutanakları" },
          { name: "Acil Güvenlik Toplantı Notları" },
          { name: "Karar Kayıtları" },
        ],
      },
      {
        name: "Yönetim Gözden Geçirme",
        docs: [
          { name: "Yönetim Gözden Geçirme Toplantı Tutanakları", tag: "Zorunlu" },
          { name: "Yönetim Kararları ve Eylem Maddeleri" },
        ],
      },
      {
        name: "Eğitim ve Farkındalık",
        docs: [
          { name: "Güvenlik Farkındalık Eğitim Toplantı Notları" },
          { name: "Tatbikat ve Simülasyon Sonuç Notları" },
        ],
      },
    ],
  },
  {
    code: "14", name: "Eski Revizyonlar", color: "cyan",
    subFolders: [
      {
        name: "Arşiv",
        docs: [
          { name: "Bilgi Teknolojileri Uzmanı Görev Tanımı.docx" },
        ],
      },
    ],
  },
  {
    code: "19", name: "Eski Revizyonlar", color: "zinc",
    subFolders: [
      {
        name: "Arşivlenmiş Dokümanlar",
        docs: [
          { name: "Arşivlenmiş Politikalar" },
          { name: "Arşivlenmiş Prosedürler" },
          { name: "Arşivlenmiş Risk Raporları" },
          { name: "Önceki SoA Versiyonları" },
          { name: "Eski Denetim Raporları" },
        ],
      },
    ],
  },
  {
    code: "20", name: "Dış Dokümanlar", color: "blue",
    subFolders: [
      {
        name: "Standartlar ve Rehberler",
        docs: [
          { name: "ISO/IEC 27001:2022 Standardı" },
          { name: "ISO/IEC 27002:2022 Uygulama Kılavuzu" },
          { name: "ISO/IEC 27005 Risk Yönetimi Rehberi" },
          { name: "NIST CSF Çerçeve Belgesi" },
        ],
      },
      {
        name: "Yasal ve Düzenleyici",
        docs: [
          { name: "Bilgi Güvenliği Mevzuatı Listesi" },
          { name: "BDDK / EPDK / SPK Düzenlemeleri" },
          { name: "NIS2 Direktifi Uyum Belgesi" },
        ],
      },
      {
        name: "Sertifika ve Lisanslar",
        docs: [
          { name: "ISO 27001 Sertifikası", tag: "Resmi" },
          { name: "Belgelendirme Kuruluşu Akreditasyon Belgesi" },
          { name: "Yazılım Lisans Sözleşmeleri" },
        ],
      },
    ],
  },
  {
    code: "21", name: "Tedarikçi Dokümanları", color: "purple",
    subFolders: [
      {
        name: "Politika & Prosedür",
        docs: [
          { name: "Bilgi Güvenliği Yönetim Sistemi Politikası.docx" },
          { name: "Üçüncü Taraf Güvenlik Politikası.docx" },
          { name: "Satınalma Prosedürü.docx" },
        ],
      },
      {
        name: "Anket & Değerlendirme",
        docs: [
          { name: "Tedarikçi Memnuniyet Anketi.docx" },
          { name: "ST FRM 01 TR Tedarikçi Memnuniyet Anketi.docx" },
        ],
      },
    ],
  },
  {
    code: "98", name: "Uygulamalar", color: "green",
    subFolders: [
      {
        name: "Uygulama Klasörleri",
        docs: [
          { name: "İç Tetkik" },
          { name: "Dış Tetkik" },
          { name: "Eğitim" },
          { name: "Duyurular" },
          { name: "YGG" },
          { name: "DFİ" },
          { name: "Dış Dokümanlar" },
        ],
      },
    ],
  },
];

// ─── Data: SSS ───────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a?: string;
  steps?: string[];
  sections?: { title: string; items: string[] }[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "ISO 27001 nedir?",
    a: "ISO 27001, bilgi güvenliği yönetimi için uluslararası bir standarttır. Bilgi güvenliği yönetim sisteminin (ISMS) kurulması, uygulanması, sürdürülmesi ve sürekli iyileştirilmesi için gereken şartları belirler. Bu standart, kuruluşların verileri korumasına, riskleri yönetmesine ve müşterilerine ve düzenleyici kurumlara uyumluluğu göstermesine yardımcı olur.",
  },
  {
    q: "ISO 27001 standardını nasıl uyguluyorsunuz?",
    a: "ISO 27001 standardına uygun bir Bilgi Güvenliği Yönetim Sistemi (ISMS) uygulamak aşağıdaki adımları kapsar:",
    steps: [
      "Projenin kapsamını belirleme.",
      "Yönetimin desteğini ve yeterli kaynakları sağlamak.",
      "İlgili tarafların ve geçerli yasal ve sözleşmesel gerekliliklerin belirlenmesi.",
      "Risk değerlendirmesi yapmak.",
      "Gerekli kontrollerin seçilmesi ve uygulanması.",
      "Projenin yönetimi için kurum içi yetkinliklerin geliştirilmesi.",
      "Uygun dokümantasyonun geliştirilmesi.",
      "Personel bilinçlendirme eğitimleri düzenlemek.",
      "Bilgi Güvenliği Yönetim Sisteminizin (ISMS) sürekli olarak ölçülmesi, izlenmesi, gözden geçirilmesi ve denetlenmesi.",
      "Gerekli düzeltici ve önleyici eylemlerin uygulanması.",
    ],
  },
  {
    q: "ISO 27001 sertifikası nedir?",
    a: "ISO 27001 sertifikası, Bilgi Güvenliği Yönetim Sisteminizin (ISMS) standardın gerekliliklerine uygun olduğunu bağımsız denetimden geçirilmiş bir şekilde teyit eder. Sertifika alabilmek için ISMS'nizin aşağıdaki şartları karşıladığını göstermeniz gerekir:",
    sections: [
      {
        title: "Karşılanması gereken şartlar",
        items: [
          "ISO 27001 gereksinimlerini karşılamaktadır.",
          "İlgili tüm yasal, düzenleyici ve sözleşmesel güvenlik yükümlülüklerine uygundur.",
          "Kendi belgelenmiş politika ve prosedürlerine uyar.",
        ],
      },
      {
        title: "Sertifikasyon denetimi aşamaları",
        items: [
          "Aşama 1: Bilgi güvenliği yönetim sisteminizin (ISMS) uygun şekilde tasarlandığından emin olmak için dokümantasyonunuzun incelenmesi.",
          "Aşama 2: Bilgi Güvenliği Yönetim Sisteminizin belgelenmiş süreçlerinize uygun şekilde çalıştığını doğrulamak için bir uygulama denetimi.",
        ],
      },
    ],
  },
  {
    q: "ISO 27001'de kaç kontrol bulunmaktadır?",
    a: "ISO 27001'in en son sürümü, organizasyonel, insan kaynakları, fiziksel ve teknolojik olmak üzere dört tema altında gruplandırılmış 93 kontrole atıfta bulunmaktadır. Bu kontroller, Standardın A Ekinde ayrıntılı olarak açıklanmıştır.",
  },
  {
    q: "ISO 27001 uyumluluğu nedir?",
    a: "ISO 27001 uyumluluğu, kuruluşunuzun standart tarafından gerekli kılınan politika, prosedür ve kontrolleri uyguladığı, ancak henüz harici bir sertifikasyona sahip olmadığı anlamına gelir. Uyumluluk, en iyi uygulamalarla uyumu gösterirken, sertifikasyon bağımsız bir doğrulama sağlar.",
  },
  {
    q: "ISO 27001 sertifikası ne kadar süreyle geçerlidir?",
    a: "ISO 27001 sertifikası, yıllık gözetim denetimlerine tabi olmak kaydıyla üç yıl süreyle geçerlidir. Üç yıl sonra, sertifikayı korumak için yeniden belgelendirme denetimi gereklidir.",
  },
  {
    q: "ISO 27001 GDPR uyumlu mu?",
    a: "ISO 27001 sertifikası GDPR uyumluluğu ile aynı şey değildir, ancak onu destekler. Standart, kişisel verilerin korunması için yapılandırılmış bir çerçeve sunarak kuruluşların GDPR gereksinimlerini karşılamak için uygun güvenlik önlemlerine sahip olduklarını göstermelerine yardımcı olur.",
  },
  {
    q: "ISO 27001 ne anlama gelir?",
    a: "ISO, Uluslararası Standardizasyon Örgütü'nü ifade eder ve 27001, bilgi güvenliği yönetim sistemlerini (ISMS) kapsayan standarda verilen numaradır.",
  },
];

// ─── Color Map ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string; badge: string }> = {
  indigo: { bg: "bg-indigo-500/8",  text: "text-indigo-400", border: "border-indigo-500/20", dot: "bg-indigo-400",  badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" },
  blue:   { bg: "bg-blue-500/8",    text: "text-blue-400",   border: "border-blue-500/20",   dot: "bg-blue-400",    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  cyan:   { bg: "bg-cyan-500/8",    text: "text-cyan-400",   border: "border-cyan-500/20",   dot: "bg-cyan-400",    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25" },
  teal:   { bg: "bg-teal-500/8",    text: "text-teal-400",   border: "border-teal-500/20",   dot: "bg-teal-400",    badge: "bg-teal-500/15 text-teal-400 border-teal-500/25" },
  green:  { bg: "bg-green-500/8",   text: "text-green-400",  border: "border-green-500/20",  dot: "bg-green-400",   badge: "bg-green-500/15 text-green-400 border-green-500/25" },
  amber:  { bg: "bg-amber-500/8",   text: "text-amber-400",  border: "border-amber-500/20",  dot: "bg-amber-400",   badge: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  orange: { bg: "bg-orange-500/8",  text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-400",  badge: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  rose:   { bg: "bg-rose-500/8",    text: "text-rose-400",   border: "border-rose-500/20",   dot: "bg-rose-400",    badge: "bg-rose-500/15 text-rose-400 border-rose-500/25" },
  purple: { bg: "bg-purple-500/8",  text: "text-purple-400", border: "border-purple-500/20", dot: "bg-purple-400",  badge: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
  zinc:   { bg: "bg-zinc-500/8",    text: "text-zinc-400",   border: "border-zinc-700",      dot: "bg-zinc-500",    badge: "bg-zinc-700 text-zinc-400 border-zinc-600" },
};

const TAG_STYLES: Record<string, string> = {
  Zorunlu: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  Kritik:  "bg-red-500/15 text-red-400 border border-red-500/25",
  Canlı:   "bg-green-500/15 text-green-400 border border-green-500/25",
  Resmi:   "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

// ─── Helpers: Control type badges ────────────────────────────────────────────

const TYPE_STYLES: Record<ControlType, string> = {
  Önleyici: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Dedektif: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Düzeltici: "bg-red-500/15 text-red-400 border border-red-500/25",
};

// ─── Sub-components: FAQ ─────────────────────────────────────────────────────

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={cn(
              "rounded-xl border transition-colors overflow-hidden",
              isOpen ? "border-indigo-500/30 bg-indigo-500/5" : "border-zinc-800 bg-zinc-900/40"
            )}
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-3.5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className={cn("text-sm font-medium transition-colors", isOpen ? "text-indigo-300" : "text-zinc-200")}>
                {item.q}
              </span>
              {isOpen
                ? <ChevronDown className="w-4 h-4 text-indigo-400 shrink-0" />
                : <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 border-t border-indigo-500/15 pt-4 space-y-4">
                {/* Main text */}
                {item.a && (
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                )}

                {/* Numbered steps */}
                {item.steps && (
                  <ol className="space-y-2">
                    {item.steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                          {si + 1}
                        </span>
                        <span className="text-zinc-300 text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {/* Sectioned bullet groups */}
                {item.sections && (
                  <div className="space-y-4">
                    {item.sections.map((section, si) => (
                      <div key={si} className="space-y-2">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                          {section.title}
                        </p>
                        <ul className="space-y-2">
                          {section.items.map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                              <span className="text-zinc-300 text-sm leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub-components: Clauses ──────────────────────────────────────────────────

function SubClauseTree({ items, depth = 0 }: { items: SubClause[]; depth?: number }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  return (
    <div className={cn("space-y-0.5", depth > 0 && "ml-5 border-l border-zinc-800 pl-4 mt-1")}>
      {items.map((item) => {
        const hasChildren = !!item.subs?.length;
        const isOpen = open.has(item.id);
        return (
          <div key={item.id}>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
                hasChildren ? "hover:bg-zinc-800/60 text-zinc-300" : "text-zinc-400 cursor-default"
              )}
              onClick={() => {
                if (!hasChildren) return;
                setOpen((p) => { const n = new Set(p); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; });
              }}
            >
              {hasChildren
                ? isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                : <span className="w-3.5 shrink-0" />}
              <span className="text-indigo-400/80 font-mono text-xs shrink-0">{item.id}</span>
              <span>{item.title}</span>
            </button>
            {hasChildren && isOpen && <SubClauseTree items={item.subs!} depth={depth + 1} />}
          </div>
        );
      })}
    </div>
  );
}

function ClauseCard({ clause }: { clause: Clause }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/40 transition-colors text-left" onClick={() => setOpen(v => !v)}>
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 font-bold text-sm shrink-0">{clause.number}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">{clause.title}</p>
          <p className="text-zinc-500 text-xs mt-0.5">{clause.subs.length} gereksinim</p>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-zinc-800/60 pt-2">
          <SubClauseTree items={clause.subs} />
        </div>
      )}
    </div>
  );
}

// ─── Sub-components: Controls ─────────────────────────────────────────────────

function ControlCard({ control, showTypes = false }: { control: Control; showTypes?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/30 transition-colors">
      <span className="text-indigo-400 font-mono text-xs mt-0.5 shrink-0 w-14">{control.id}</span>
      <span className="text-zinc-300 text-sm flex-1">{control.title}</span>
      {showTypes && control.types && (
        <div className="flex gap-1.5 flex-wrap justify-end">
          {control.types.map(t => (
            <span key={t} className={cn("text-xs px-2 py-0.5 rounded-full font-medium", TYPE_STYLES[t])}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupSection({ group, showTypes = false, color = "indigo" }: { group: ControlGroup; showTypes?: boolean; color?: string }) {
  const [open, setOpen] = useState(true);
  const c = COLOR_MAP[color] ?? COLOR_MAP.indigo;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-3">
          <span className={cn("w-2 h-2 rounded-full shrink-0", c.dot)} />
          <span className="text-white font-medium text-sm">{group.name}</span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border", c.badge)}>{group.controls.length} kontrol</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-zinc-800/50 pt-3">
          {group.controls.map(ctrl => <ControlCard key={ctrl.id} control={ctrl} showTypes={showTypes} />)}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components: Folder Tree ──────────────────────────────────────────────

function FolderNodeCard({ node }: { node: FolderNode }) {
  const [open, setOpen] = useState(false);
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set());
  const c = COLOR_MAP[node.color] ?? COLOR_MAP.zinc;
  const totalDocs = node.subFolders.reduce((s, sf) => s + sf.docs.length, 0);

  const toggleSub = (name: string) =>
    setOpenSubs(p => { const n = new Set(p); n.has(name) ? n.delete(name) : n.add(name); return n; });

  return (
    <div className={cn("rounded-xl border overflow-hidden transition-all", c.border, open ? c.bg : "bg-zinc-900/40")}>
      {/* Top-level folder row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-800/30 transition-colors text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", c.bg, c.border)}>
          {open
            ? <FolderOpen className={cn("w-4.5 h-4.5", c.text)} />
            : <Folder className={cn("w-4.5 h-4.5", c.text)} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-mono text-xs font-semibold", c.text)}>{node.code}</span>
            <span className="text-white font-medium text-sm">{node.name}</span>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5">
            {node.subFolders.length} alt klasör · {totalDocs} doküman
          </p>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
          : <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />}
      </button>

      {/* Expanded sub-folders */}
      {open && (
        <div className="border-t border-zinc-800/60">
          {node.subFolders.map((sf) => {
            const sfOpen = openSubs.has(sf.name);
            return (
              <div key={sf.name} className="border-b border-zinc-800/40 last:border-0">
                {/* Sub-folder header */}
                <button
                  className="w-full flex items-center gap-3 px-6 py-2.5 hover:bg-zinc-800/20 transition-colors text-left"
                  onClick={() => toggleSub(sf.name)}
                >
                  <div className="w-px h-4 bg-zinc-700 shrink-0" />
                  {sfOpen
                    ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                    : <Folder className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />}
                  <span className="text-zinc-300 text-sm flex-1">{sf.name}</span>
                  <span className="text-xs text-zinc-600">{sf.docs.length} doküman</span>
                  {sfOpen
                    ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </button>

                {/* Documents list */}
                {sfOpen && (
                  <div className="pb-2">
                    {sf.docs.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center gap-3 px-10 py-1.5 hover:bg-zinc-800/15 transition-colors group"
                      >
                        <div className="w-px h-3 bg-zinc-800 shrink-0" />
                        <FileText className="w-3 h-3 text-zinc-600 group-hover:text-zinc-500 shrink-0" />
                        <span className="text-zinc-400 text-xs group-hover:text-zinc-300 flex-1 transition-colors">
                          {doc.name}
                        </span>
                        {doc.tag && (
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium border shrink-0", TAG_STYLES[doc.tag] ?? TAG_STYLES.Zorunlu)}>
                            {doc.tag}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "clauses",  label: "Maddeler 4–10",       icon: BookOpen,   count: "21 gereksinim" },
  { id: "a5",       label: "A.5 Organizasyonel",   icon: Shield,     count: "37 kontrol" },
  { id: "a6",       label: "A.6 İnsan",            icon: Users,      count: "8 kontrol" },
  { id: "a7",       label: "A.7 Fiziksel",         icon: Building2,  count: "14 kontrol" },
  { id: "a8",       label: "A.8 Teknolojik",       icon: Cpu,        count: "34 kontrol" },
  { id: "folders",  label: "Klasör Yapısı",        icon: FolderOpen, count: "19 klasör" },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV_CARDS = [
  { href: "/iso27001/kontroller", label: "Kontrol Durumu",      desc: "93 Ek A kontrolünü izle",    icon: CheckCircle2, color: "indigo" },
  { href: "/iso27001/riskler",    label: "Risk Kaydı",          desc: "5×5 matris, risk işleme",     icon: AlertTriangle, color: "rose" },
  { href: "/iso27001/belgeler",   label: "Belge Yönetimi",      desc: "Doküman kontrolü & upload",   icon: FileText,    color: "blue" },
  { href: "/iso27001/denetimler", label: "Denetim & DÜF",       desc: "Bulgular, düzeltici faaliyet", icon: ClipboardCheck, color: "green" },
] as const;

const NAV_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  rose:   { bg: "bg-rose-500/10",   text: "text-rose-400",   border: "border-rose-500/20" },
  blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20" },
  green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20" },
};

export default function ISO27001Page() {
  const [activeTab, setActiveTab] = useState<TabId>("clauses");
  const [folderKey] = useState(0);
  const [stats, setStats] = useState<IsmsDashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(res => { if (res.ok) setStats(res.data); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">ISO 27001:2022</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            Sertifikasyon Platformu
          </span>
        </div>
        <p className="text-zinc-500 text-sm ml-12">
          Bilgi Güvenliği Yönetim Sistemi — Sertifikasyon sürecinizi uçtan uca yönetin
        </p>
      </div>

      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Uyumluluk", value: stats.compliance_pct != null ? `${stats.compliance_pct}%` : "—", sub: `${stats.controls_implemented} / ${stats.total_controls_tracked} kontrol`, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { label: "Açık Risk",  value: stats.open_risks,       sub: `${stats.critical_risks} kritik`,        color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
            { label: "Belge",      value: stats.total_documents,  sub: `${stats.approved_docs} onaylı`,          color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Açık DÜF",  value: stats.open_cars,        sub: `${stats.open_findings} açık bulgu`,      color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
          ].map(s => (
            <div key={s.label} className={cn("rounded-xl border p-4", s.bg)}>
              <p className="text-zinc-500 text-xs">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
              <p className="text-zinc-600 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_CARDS.map(card => {
          const c = NAV_COLORS[card.color];
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}
              className={cn("rounded-xl border p-4 flex flex-col gap-2 hover:brightness-110 transition-all group", c.bg, c.border)}>
              <div className="flex items-center justify-between">
                <Icon className={cn("w-5 h-5", c.text)} />
                <ArrowRight className={cn("w-4 h-4 text-zinc-600 group-hover:translate-x-0.5 transition-transform", c.text, "opacity-50")} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{card.label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Platform Önizlemesi */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Platform Önizlemesi</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              KVKK uyumlu yetkinlik ölçümü, elektronik sertifikasyon ve güvenli veri merkezi
            </p>
          </div>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 shrink-0">
            Aktif
          </span>
        </div>

        {/* 5 Ana Modül */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/50">
          {[
            {
              icon: Scale,
              color: "indigo",
              title: "KVKK Yetkinlik Ölçümü",
              desc: "Şirket çalışanlarının bilgi güvenliği ve kişisel veri yetkinliklerini KVKK çerçevesinde ölçer, raporlar ve gelişim alanlarını belirler.",
              tags: ["KVKK", "6698 Sayılı Kanun", "Yetkinlik"],
            },
            {
              icon: Award,
              color: "amber",
              title: "Elektronik Sertifikasyon Testi",
              desc: "ISO 27001 kontrollerine göre hazırlanan online sınavlarla çalışan ve kurum sertifikasyon hazırlığını ölçer; sonuçları otomatik değerlendirir.",
              tags: ["Online Sınav", "Otomatik Değerlendirme", "Sertifika"],
            },
            {
              icon: GraduationCap,
              color: "blue",
              title: "Eğitim Yönetimi",
              desc: "Bilgi güvenliği farkındalık eğitimlerini planlar, içerik sunar, katılımı takip eder ve eğitim tamamlama kayıtlarını arşivler.",
              tags: ["Farkındalık", "E-Öğrenme", "Katılım Takibi"],
            },
            {
              icon: FileCheck2,
              color: "green",
              title: "Dokümantasyon Hazırlama",
              desc: "Politika, prosedür, form ve talimat şablonlarını otomatik oluşturur; sürüm kontrolü ve onay akışlarıyla belgelerinizi yaşayan hâlde tutar.",
              tags: ["Şablon", "Sürüm Kontrolü", "Onay Akışı"],
            },
            {
              icon: Database,
              color: "purple",
              title: "Güvenli Veri Merkezi",
              desc: "Tüm eğitim, test, belge ve denetim verilerini şifreli ve erişim kontrollü olarak depolar. KVKK ve ISO 27001 gerekliliklerine uygun veri saklama.",
              tags: ["Şifreleme", "Erişim Kontrolü", "Yedekleme"],
            },
            {
              icon: Lock,
              color: "rose",
              title: "Uyumluluk & İzleme",
              desc: "Kontrol durumları, risk kayıtları ve denetim bulgularını tek panelden izler; uyumluluk puanını anlık hesaplar ve sertifikasyon boşluklarını gösterir.",
              tags: ["Dashboard", "Anlık İzleme", "Gap Analizi"],
            },
          ].map((mod) => {
            const colMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
              indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" },
              amber:  { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  badge: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
              blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20",   badge: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
              green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20",  badge: "bg-green-500/15 text-green-400 border-green-500/25" },
              purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", badge: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
              rose:   { bg: "bg-rose-500/10",   text: "text-rose-400",   border: "border-rose-500/20",   badge: "bg-rose-500/15 text-rose-400 border-rose-500/25" },
            };
            const c = colMap[mod.color];
            const Icon = mod.icon;
            return (
              <div key={mod.title} className="bg-zinc-900/60 p-5 flex flex-col gap-3 hover:bg-zinc-800/30 transition-colors">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border shrink-0", c.bg, c.border)}>
                  <Icon className={cn("w-4.5 h-4.5", c.text)} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{mod.title}</p>
                  <p className="text-zinc-500 text-xs leading-relaxed mt-1.5">{mod.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {mod.tags.map(tag => (
                    <span key={tag} className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border", c.badge)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Veri Akışı Özeti */}
        <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/20">
          <p className="text-xs text-zinc-500 font-medium mb-3 uppercase tracking-wide">Veri Akışı</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Eğitim & Test", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { label: "→", color: "text-zinc-600", plain: true },
              { label: "KVKK Ölçümü", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
              { label: "→", color: "text-zinc-600", plain: true },
              { label: "Dokümantasyon", color: "text-green-400 bg-green-500/10 border-green-500/20" },
              { label: "→", color: "text-zinc-600", plain: true },
              { label: "Güvenli Depolama", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
              { label: "→", color: "text-zinc-600", plain: true },
              { label: "Sertifikasyon", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            ].map((step, i) =>
              step.plain ? (
                <span key={i} className={cn("text-sm font-bold", step.color)}>{step.label}</span>
              ) : (
                <span key={i} className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", step.color)}>
                  {step.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* SSS / Giriş Bilgilendirmesi */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">Sık Sorulan Sorular & Uygulama Rehberi</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
              {FAQ_ITEMS.length} konu
            </span>
          </div>
        </div>
        <div className="p-4">
          <FaqAccordion />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all",
                active ? "bg-indigo-500/20 text-indigo-300 shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">{tab.label}</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full", active ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800 text-zinc-500")}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">

        {activeTab === "clauses" && (
          <>
            <p className="text-zinc-400 text-sm">7 normatif madde · Tıklayarak alt gereksinimleri genişletin</p>
            <div className="space-y-3">
              {CLAUSES.map(c => <ClauseCard key={c.id} clause={c} />)}
            </div>
          </>
        )}

        {activeTab === "a5" && (
          <>
            <p className="text-zinc-400 text-sm">5 grup · 37 organizasyonel kontrol</p>
            <div className="space-y-3">
              {A5_GROUPS.map((g, i) => (
                <GroupSection key={g.name} group={g} color={["indigo","amber","blue","purple","red"][i]} />
              ))}
            </div>
          </>
        )}

        {activeTab === "a6" && (
          <>
            <p className="text-zinc-400 text-sm">İşe alımdan işten ayrılışa tüm personel güvenliği yaşam döngüsü</p>
            <div className="space-y-2">
              {A6_CONTROLS.map(c => <ControlCard key={c.id} control={c} />)}
            </div>
          </>
        )}

        {activeTab === "a7" && (
          <>
            <p className="text-zinc-400 text-sm">2 grup · 14 fiziksel kontrol</p>
            <div className="space-y-3">
              {A7_GROUPS.map((g, i) => (
                <GroupSection key={g.name} group={g} color={i === 0 ? "orange" : "amber"} />
              ))}
            </div>
          </>
        )}

        {activeTab === "a8" && (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-zinc-400 text-sm">4 grup · 34 teknolojik kontrol</p>
              <div className="flex gap-2">
                {(["Önleyici","Dedektif","Düzeltici"] as ControlType[]).map(t => (
                  <span key={t} className={cn("text-xs px-2.5 py-1 rounded-full font-medium", TYPE_STYLES[t])}>{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {A8_GROUPS.map((g, i) => (
                <GroupSection key={g.name} group={g} showTypes color={["cyan","blue","green","purple"][i]} />
              ))}
            </div>
          </>
        )}

        {activeTab === "folders" && (
          <>
            {/* Folder tab header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <p className="text-zinc-400 text-sm">
                  19 ana klasör · {FOLDER_TREE.reduce((s, f) => s + f.subFolders.length, 0)} alt klasör ·{" "}
                  {FOLDER_TREE.reduce((s, f) => s + f.subFolders.reduce((ss, sf) => ss + sf.docs.length, 0), 0)} doküman
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Legend */}
                {Object.entries(TAG_STYLES).map(([tag, cls]) => (
                  <span key={tag} className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border", cls)}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Folder tree */}
            <div key={folderKey} className="space-y-2">
              {FOLDER_TREE.map(node => <FolderNodeCard key={node.code} node={node} />)}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
