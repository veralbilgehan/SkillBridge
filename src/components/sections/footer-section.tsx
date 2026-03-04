import Link from "next/link";

const FooterSection = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white text-lg">
              Skill<span className="text-indigo-400">Bridge</span>
            </span>
            <p className="text-zinc-500 text-sm max-w-xs">
              AI destekli test ve değerlendirme platformu. Dokümanlarınızdan saniyeler içinde test üretin.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-zinc-300 font-medium mb-1">Platform</p>
              <Link href="#features" className="text-zinc-500 hover:text-white transition-colors">Özellikler</Link>
              <Link href="#pricing" className="text-zinc-500 hover:text-white transition-colors">Fiyatlar</Link>
              <Link href="#how-it-works" className="text-zinc-500 hover:text-white transition-colors">Nasıl Çalışır</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-300 font-medium mb-1">Hesap</p>
              <Link href="/login" className="text-zinc-500 hover:text-white transition-colors">Giriş Yap</Link>
              <Link href="/register/corporate" className="text-zinc-500 hover:text-white transition-colors">Kurumsal Kayıt</Link>
              <Link href="/register/individual" className="text-zinc-500 hover:text-white transition-colors">Bireysel Kayıt</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-zinc-600">
          <p>© 2026 SkillBridge. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-zinc-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { FooterSection };
