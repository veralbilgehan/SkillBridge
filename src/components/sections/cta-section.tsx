import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="py-24 bg-zinc-900 px-6">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="text-4xl font-bold text-white leading-tight">
          Değerlendirmeye bugün başla
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Kredi kartı gerekmez. 50 kontör hediyeyle hemen test oluşturmaya başlayın.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/register/corporate"
            className="px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-colors"
          >
            Kurumsal Kayıt
          </Link>
          <Link
            href="/register/individual"
            className="px-7 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Bireysel Kayıt
          </Link>
        </div>
      </div>
    </section>
  );
};

export { CtaSection };
