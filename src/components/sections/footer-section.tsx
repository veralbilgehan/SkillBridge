import Link from "next/link";

const FooterSection = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-white text-lg tracking-tight">
            SkillBridge
          </span>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="#showcase" className="hover:text-white transition-colors">
              Components
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Docs
            </Link>
          </nav>
        </div>
        <p className="text-center text-xs text-zinc-600">
          © 2026 SkillBridge. MIT License.
        </p>
      </div>
    </footer>
  );
};

export { FooterSection };
