"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  featured?: boolean;
};

type CategoryListProps = {
  title: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: LucideIcon;
  className?: string;
};

export function CategoryList({
  title,
  subtitle,
  categories,
  headerIcon: HeaderIcon,
  className,
}: CategoryListProps) {
  return (
    <div
      className={cn(
        "group relative flex h-24 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-300 hover:h-32",
        className,
      )}
    >
      {/* Corner bracket decorators */}
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-zinc-700 transition-colors group-hover:border-indigo-500/60" />
      <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-zinc-700 transition-colors group-hover:border-indigo-500/60" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-zinc-700 transition-colors group-hover:border-indigo-500/60" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-zinc-700 transition-colors group-hover:border-indigo-500/60" />

      {/* Header */}
      <div className="flex items-center gap-2">
        {HeaderIcon && (
          <HeaderIcon className="h-4 w-4 shrink-0 text-indigo-400" />
        )}
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={cat.onClick}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                cat.featured
                  ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300",
              )}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {cat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
