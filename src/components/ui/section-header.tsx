import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader = ({ badge, title, subtitle, className }: SectionHeaderProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center gap-3 mb-12", className)}>
      {badge && (
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export { SectionHeader };
