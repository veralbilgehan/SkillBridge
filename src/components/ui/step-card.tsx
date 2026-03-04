import { cn } from "@/lib/utils";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  className?: string;
}

const StepCard = ({ step, title, description, className }: StepCardProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center gap-4", className)}>
      <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
        {step}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export { StepCard };
