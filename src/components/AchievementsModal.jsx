import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Lock } from "lucide-react";

const ACHIEVEMENTS_DATA = [
  {
    id: "hacker",
    title: "Hacker Man",
    description: "Used the developer terminal",
    hint: "💡 Scroll to the Terminal section and type any command",
    icon: "👨‍💻",
  },
  {
    id: "gamer",
    title: "Retro Gamer",
    description: "Found the Konami Code",
    hint: "💡 Try: ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard anywhere",
    icon: "🎮",
  },
  {
    id: "explorer",
    title: "Deep Explorer",
    description: "Reached the bottom of the page",
    hint: "💡 Scroll all the way to the footer",
    icon: "🗺️",
  },
  {
    id: "socialite",
    title: "Social Butterfly",
    description: "Signed the guestbook",
    hint: "💡 Leave a message in the Guestbook section",
    icon: "🦋",
  },
];

export default function AchievementsModal({ isOpen, onClose }) {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const key = "vldev_achievements";
      setUnlocked(JSON.parse(localStorage.getItem(key) || "[]"));
    }
  }, [isOpen]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const unlockedCount = unlocked.filter(id => ACHIEVEMENTS_DATA.find(a => a.id === id)).length;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "440px",
              maxHeight: "85dvh",
              overflowY: "auto",
            }}
            className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl custom-scrollbar"
          >
            <div className="p-5 md:p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="text-[var(--accent)]" size={24} />
                <h2 className="text-xl font-bold tracking-tight">Achievements</h2>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span className="font-mono font-bold text-[var(--accent)]">
                    {unlockedCount} / {ACHIEVEMENTS_DATA.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / ACHIEVEMENTS_DATA.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Achievement items */}
              <div className="space-y-3">
                {ACHIEVEMENTS_DATA.map((ach) => {
                  const isUnlocked = unlocked.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300
                        ${isUnlocked
                          ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
                          : "border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.03]"
                        }`}
                    >
                      {/* Icon */}
                      <div className={`text-2xl flex-shrink-0 mt-0.5 ${!isUnlocked ? "grayscale opacity-40" : ""}`}>
                        {isUnlocked ? ach.icon : "🔒"}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`font-bold text-sm ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                            {ach.title}
                          </h3>
                          {isUnlocked && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-semibold">
                              ✓ UNLOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {isUnlocked ? ach.description : (
                            <span className="flex items-start gap-1.5">
                              <Lock size={10} className="flex-shrink-0 mt-0.5" />
                              {ach.hint}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All unlocked celebration */}
              {unlockedCount === ACHIEVEMENTS_DATA.length && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[var(--accent)]/10 to-emerald-500/10 border border-[var(--accent)]/30 text-center">
                  <p className="text-sm font-bold text-[var(--accent)]">🎉 All achievements unlocked!</p>
                  <p className="text-xs text-muted-foreground mt-1">You found all the secrets. Impressive!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
