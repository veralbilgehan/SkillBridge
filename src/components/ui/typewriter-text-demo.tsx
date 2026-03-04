import { TypewriterText } from "@/components/ui/typewriter-text";

const TypewriterTextDemo = () => {
  return (
    <div className="flex flex-col items-center gap-8 text-white">
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-3">Simple</p>
        <p className="text-4xl font-bold">
          I build{" "}
          <TypewriterText
            words={["websites", "apps", "components", "interfaces"]}
            className="text-indigo-400"
          />
        </p>
      </div>

      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-3">Fast typing</p>
        <p className="text-2xl font-semibold">
          <TypewriterText
            words={["React", "Next.js", "TypeScript", "Tailwind CSS"]}
            typingSpeed={40}
            deletingSpeed={20}
            pauseDuration={800}
            className="text-emerald-400"
          />
        </p>
      </div>

      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-3">Slow & dramatic</p>
        <p className="text-xl">
          <TypewriterText
            words={["Hello, world.", "Welcome to SkillBridge.", "Crafted with care."]}
            typingSpeed={120}
            deletingSpeed={60}
            pauseDuration={2000}
            className="text-rose-400"
          />
        </p>
      </div>
    </div>
  );
};

export { TypewriterTextDemo };
