import { SectionHeader } from "@/components/ui/section-header";
import { PricingCard } from "@/components/ui/pricing-card";

const plans = [
  { name: "Başlangıç", credits: 100, price: "₺99" },
  { name: "Standart", credits: 300, price: "₺249", recommended: true },
  { name: "Profesyonel", credits: 750, price: "₺499" },
  { name: "Kurumsal", credits: 2000, price: "₺999" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Fiyatlar"
          title="Kullandığın kadar öde"
          subtitle="Abonelik yok. Kontör satın al, istediğin zaman kullan. Yeni üyelere 50 kontör hediye."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm text-zinc-400 border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 pr-4 text-zinc-300 font-medium">İşlem</th>
                <th className="text-right py-3 font-medium">Kontör</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Yeni Üyelik Hediyesi", "+50"],
                ["Hazır Test Çözümü", "Soru başına 1"],
                ["AI Test Yorumlama", "10"],
                ["Doküman / Test Oluşturma", "50"],
                ["Seviye Tespit Sınavı", "100"],
              ].map(([label, cost]) => (
                <tr key={label} className="border-b border-zinc-800/50">
                  <td className="py-2.5 pr-4">{label}</td>
                  <td className="py-2.5 text-right text-white font-medium">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export { PricingSection };
