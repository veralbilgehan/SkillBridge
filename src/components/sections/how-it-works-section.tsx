import { SectionHeader } from "@/components/ui/section-header";
import { StepCard } from "@/components/ui/step-card";

const steps = [
  {
    step: 1,
    title: "Doküman Yükle veya Oluştur",
    description:
      "PDF, DOCX veya TXT yükleyin ya da AI asistanıyla sıfırdan doküman oluşturun.",
  },
  {
    step: 2,
    title: "AI ile Test Üret",
    description:
      "Sektör, meslek ve yetkinlik parametrelerini seçin. Claude saniyeler içinde test oluşturur.",
  },
  {
    step: 3,
    title: "Aday Davet Et ve Analiz Et",
    description:
      "Adaylara e-posta veya link ile davet gönderin. Sonuçları AI raporuyla inceleyin.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-900 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Nasıl Çalışır"
          title="3 adımda değerlendirme"
          subtitle="Teknik bilgi gerekmez. Test oluşturmaktan sonuç almaya kadar her şey otomatik."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-6 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-zinc-700" />
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { HowItWorksSection };
