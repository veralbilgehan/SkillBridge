import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-bold text-white text-xl mb-8">
        Skill<span className="text-indigo-400">Bridge</span>
      </Link>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
}
