import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-6",
        className
      )}
    >
      <Icon className="w-6 h-6 text-zinc-300" />
      <h3 className="text-white font-semibold text-lg mt-4">{title}</h3>
      <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{description}</p>
    </div>
  );
};

export { FeatureCard };
