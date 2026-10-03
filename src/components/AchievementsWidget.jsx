import React, { useState } from "react";
import { Trophy } from "lucide-react";
import AchievementsModal from "./AchievementsModal";

export default function AchievementsWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[90] p-3 md:p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all group"
        aria-label="View Achievements"
      >
        <Trophy 
          size={24} 
          className="text-muted-foreground group-hover:text-[var(--accent)] transition-colors" 
        />
        <span className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none text-xs font-mono px-3 py-1.5 rounded-lg bg-foreground text-background shadow-xl whitespace-nowrap translate-y-2 group-hover:translate-y-0">
          Achievements
        </span>
      </button>

      <AchievementsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
