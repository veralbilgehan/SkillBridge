import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  credits: number;
  price: string;
  recommended?: boolean;
  className?: string;
}

const PricingCard = ({ name, credits, price, recommended, className }: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 rounded-2xl border p-6",
        recommended
          ? "border-indigo-500 bg-indigo-950/40"
          : "border-zinc-700/50 bg-zinc-800/40",
        className
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ÖNERİLEN
        </span>
      )}
      <div>
        <p className="text-zinc-400 text-sm font-medium">{name}</p>
        <p className="text-3xl font-bold text-white mt-1">{price}</p>
        <p className="text-zinc-500 text-sm mt-1">{credits.toLocaleString("tr-TR")} Kontör</p>
      </div>
      <Link
        href="/register"
        className={cn(
          "w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors",
          recommended
            ? "bg-indigo-500 hover:bg-indigo-400 text-white"
            : "bg-zinc-700 hover:bg-zinc-600 text-white"
        )}
      >
        Başla
      </Link>
    </div>
  );
};

export { PricingCard };
