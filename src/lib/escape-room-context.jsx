import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uiAudio } from '@/lib/audio';
import { unlockAchievement } from '@/lib/achievements';
import { X, CheckCircle2, Lock, Terminal, Sparkles, Trophy, Download, Mail } from 'lucide-react';

/**
 * EscapeRoomContext — 5 hidden clues across the portfolio.
 * All found → Victory modal with direct contact links.
 *
 * CLUE MAP:
 *  clue_1: Type "hire" on keyboard anywhere on page
 *  clue_2: Click the navbar logo 7 times rapidly
 *  clue_3: Browser console -> viraj.unlock('found_you') or cat /contact.sh in Terminal
 *  clue_4: Hover footer copyright text for 3+ seconds
 *  clue_5: Scroll to bottom -> back to top within 5 seconds
 */

const CLUE_COUNT = 5;
const STORAGE_KEY = 'vl_escape_room';

export const CLUES = [
  {
    id: 'clue_1',
    title: 'The Keyword',
    hint: 'Type "hire" anywhere on your keyboard.',
    description: 'A simple call for talent. Type H-I-R-E anywhere on the page.',
    icon: '⌨️',
  },
  {
    id: 'clue_2',
    title: 'Brand Resonance',
    hint: 'Click the VL.dev navbar logo 7 times rapidly.',
    description: 'Good things come to those who knock repeatedly on the logo.',
    icon: '⚡',
  },
  {
    id: 'clue_3',
    title: 'Developer Terminal',
    hint: 'Open terminal mode (Alt+T) and cat /contact.sh, or check DevTools console.',
    description: 'Inspect the terminal filesystem or run viraj.unlock("found_you") in console.',
    icon: '💻',
  },
  {
    id: 'clue_4',
    title: 'Patience in the Deep',
    hint: 'Hover over the footer copyright notice for 3 continuous seconds.',
    description: 'True craftsmanship is buried in the details at the very bottom.',
    icon: '⏳',
  },
  {
    id: 'clue_5',
    title: 'The Speedrunner',
    hint: 'Scroll to the bottom of the page and back to the top within 5 seconds.',
    description: 'From peak to nadir and back in the blink of an eye.',
    icon: '🚀',
  },
];

export const CLUE_HINTS = {
  clue_1: '🔤 The keyword is HIRE — say it with your keyboard.',
  clue_2: '🖱️ The logo hides something. Try clicking it... repeatedly.',
  clue_3: '🖥️ Developers always check the console or terminal first.',
  clue_4: '📝 The footer holds a secret. Be patient with it.',
  clue_5: '📜 Full scroll — down and back up. Speed matters.',
};

const EscapeRoomContext = createContext({
  found: {},
  foundCount: 0,
  allFound: false,
  unlock: (_clueId) => { },
  reset: () => { },
  CLUES,
  CLUE_HINTS,
  secretsModalOpen: false,
  setSecretsModalOpen: (_open) => { },
});

export function EscapeRoomProvider({ children }) {
  const [found, setFound] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showVictory, setShowVictory] = useState(false);
  const [lastFoundId, setLastFoundId] = useState(null);
  const [secretsModalOpen, setSecretsModalOpen] = useState(false);

  const foundCount = Object.keys(found).length;
  const allFound = foundCount >= CLUE_COUNT;

  const unlock = useCallback((clueId) => {
    setFound((prev) => {
      if (prev[clueId]) return prev;
      const next = { ...prev, [clueId]: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage disabled or full
      }
      setLastFoundId(clueId);
      uiAudio.playSuccess();

      if (Object.keys(next).length >= CLUE_COUNT) {
        unlockAchievement('escape_master');
        setTimeout(() => setShowVictory(true), 900);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
    setFound({});
    setLastFoundId(null);
    setShowVictory(false);
  }, []);

  useEffect(() => {
    const onOpenSecrets = () => setSecretsModalOpen(true);
    window.addEventListener('open-secrets-modal', onOpenSecrets);
    return () => window.removeEventListener('open-secrets-modal', onOpenSecrets);
  }, []);

  useEffect(() => {
    if (secretsModalOpen || showVictory) {
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].stop();
      }
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].start();
      }
    };
  }, [secretsModalOpen, showVictory]);

  // ── Global console clue ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window['viraj'] = {
        unlock: (code) => {
          if (code === 'found_you') {
            unlock('clue_3');
            console.log(
              '%c🎉 Clue 3/5 unlocked! Impressive investigative work.',
              'color:#64d2ff;font-size:14px;font-weight:bold;padding:4px;background:#051525;border-radius:4px;'
            );
          } else {
            console.log('%c❌ Code incorrect. Keep looking...', 'color:#ec4899;font-size:12px;');
          }
        },
      };

      const t = setTimeout(() => {
        console.log(
          '%c👁️ You opened DevTools. Brilliant.\n\nRun: %cviraj.unlock(\'found_you\')%c to claim Clue 3/5.',
          'color:#a855f7;font-size:13px;font-weight:bold;',
          'color:#64d2ff;font-size:13px;font-family:monospace;background:#111;padding:2px 6px;border-radius:4px;',
          'color:#a855f7;font-size:13px;'
        );
      }, 3500);

      return () => clearTimeout(t);
    }
  }, [unlock]);

  // ── Clue 1: type "hire" anywhere ──
  useEffect(() => {
    let typed = '';
    const onKey = (e) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
      }

      if (e.key && e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        typed += e.key.toLowerCase();
        if (typed.length > 20) typed = typed.slice(-20);
        if (typed.endsWith('hire')) {
          unlock('clue_1');
          typed = '';
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock]);

  // ── Clue 5: scroll to bottom then back to top within 5s (RAF-throttled for 60fps performance) ──
  useEffect(() => {
    let hitBottom = false;
    let hitBottomAt = 0;
    let ticking = false;

    const checkScroll = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 70;
      if (atBottom && !hitBottom) {
        hitBottom = true;
        hitBottomAt = Date.now();
      }
      if (hitBottom && window.scrollY < 80 && Date.now() - hitBottomAt < 5000) {
        unlock('clue_5');
        hitBottom = false;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [unlock]);

  // Auto-clear the "clue found" toast after 3.5s
  useEffect(() => {
    if (!lastFoundId) return;
    const t = setTimeout(() => setLastFoundId(null), 3500);
    return () => clearTimeout(t);
  }, [lastFoundId]);

  const activeClueObj = CLUES.find((c) => c.id === lastFoundId);

  return (
    <EscapeRoomContext.Provider
      value={{
        found,
        foundCount,
        allFound,
        unlock,
        reset,
        CLUES,
        CLUE_HINTS,
        secretsModalOpen,
        setSecretsModalOpen,
      }}
    >
      {children}

      {/* ── Real-time Clue Unlocked Toast ── */}
      <AnimatePresence>
        {lastFoundId && (
          <motion.div
            key={lastFoundId}
            initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="fixed bottom-24 left-1/2 z-[99998] px-5 py-3.5 rounded-2xl border border-[var(--accent)]/50 bg-black/90 backdrop-blur-2xl shadow-[0_0_40px_var(--glow)] flex items-center gap-3.5 whitespace-nowrap"
            onClick={() => setSecretsModalOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-lg shadow-inner">
              {activeClueObj?.icon || '🗝️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  Clue Unlocked! ({foundCount}/{CLUE_COUNT})
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                  +{activeClueObj?.title || 'Secret'}
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-0.5 font-sans">
                {foundCount < CLUE_COUNT
                  ? 'Click to view the Secrets & Clues map'
                  : 'All secrets found! Victory unlocked!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Secrets & Clues Map Modal ── */}
      <AnimatePresence>
        {secretsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
            onClick={() => setSecretsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/95 shadow-[0_0_80px_rgba(0,0,0,0.8)] p-6 md:p-8 overscroll-contain"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🗝️</span>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Portfolio Secrets & Clues
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Progress: <span className="text-[var(--accent)] font-bold">{foundCount}</span> /{' '}
                    {CLUE_COUNT} clues deciphered
                  </p>
                </div>
                <button
                  onClick={() => setSecretsModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(foundCount / CLUE_COUNT) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* Clues List */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar overscroll-contain"
              >
                {CLUES.map((clue, idx) => {
                  const isUnlocked = Boolean(found[clue.id]);
                  return (
                    <div
                      key={clue.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${isUnlocked
                          ? 'border-[var(--accent)]/30 bg-[var(--accent)]/5'
                          : 'border-zinc-800/80 bg-zinc-900/40 opacity-75 hover:opacity-100'
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-mono shrink-0 ${isUnlocked
                            ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                            : 'bg-zinc-800 text-zinc-500'
                          }`}
                      >
                        {isUnlocked ? <CheckCircle2 size={18} /> : <Lock size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-zinc-300'
                              }`}
                          >
                            #{idx + 1} {clue.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${isUnlocked
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-500'
                              }`}
                          >
                            {isUnlocked ? 'Solved' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                          {isUnlocked ? clue.description : clue.hint}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSecretsModalOpen(false);
                      window.dispatchEvent(new CustomEvent('toggle-terminal-mode'));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-xs font-mono text-[var(--accent)] hover:bg-[var(--accent)]/20 hover:border-[var(--accent)] transition-all font-semibold shadow-sm"
                  >
                    <Terminal size={13} /> Terminal (Alt+T)
                  </button>
                  <button
                    onClick={() => {
                      setSecretsModalOpen(false);
                      window.dispatchEvent(new CustomEvent('open-achievements-modal'));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-xs font-mono text-yellow-400 hover:bg-yellow-500/20 transition-all font-semibold shadow-sm"
                  >
                    <Trophy size={13} /> Achievements 🏆
                  </button>
                </div>

                {foundCount > 0 && (
                  <button
                    onClick={reset}
                    className="text-[11px] font-mono text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Reset Progress
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Victory Modal ── */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[9990] flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl"
            onClick={() => setShowVictory(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-[var(--accent)]/40 bg-zinc-950/98 shadow-[0_0_120px_var(--glow)] text-center p-8 md:p-12 overscroll-contain"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/15 via-purple-500/10 to-pink-500/15 pointer-events-none" />

              <button
                onClick={() => setShowVictory(false)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-[var(--accent)] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Victory Modal"
              >
                <X size={16} />
              </button>

              <motion.div
                animate={{ rotate: [0, 12, -12, 8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-7xl mb-5 flex justify-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
              </motion.div>

              <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase mb-3">
                🏆 Secret Achievement Unlocked
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white">
                Escape Room Solved!
              </h2>
              <p className="text-[var(--accent)] font-mono text-sm mb-5 flex items-center justify-center gap-2">
                <Sparkles size={16} /> All {CLUE_COUNT}/5 Secrets Decoded
              </p>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6">
                You took the time to explore every hidden layer of this portfolio. That exceptional
                curiosity and attention to detail is world-class.
                <br />
                <span className="font-semibold text-white mt-2 block">
                  You unlocked VIP Fast-Track access:
                </span>
              </p>

              {/* VIP Recruiter / Client Rewards */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-6">
                <a
                  href="/Viraj_Lakshitha_CV.pdf"
                  download="Viraj_Lakshitha_CV.pdf"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-xs md:text-sm shadow-md"
                >
                  <Download size={15} /> Download CV / Resume
                </a>
                <a
                  href="mailto:viraj.lakshitha.22222@gmail.com?subject=Escape%20Room%20Solved%20-%20Let's%20Work%20Together"
                  className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs md:text-sm shadow-[0_0_30px_var(--glow)]"
                >
                  <Mail size={15} /> Priority Email
                </a>
                <a
                  href="https://wa.me/94769291462?text=Hi%20Viraj,%20I%20just%20unlocked%20all%205%20Escape%20Room%20secrets%20on%20your%20portfolio!"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  💬 WhatsApp Direct
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span>Secret Passcode: </span>
                <span className="text-[var(--accent)] font-bold">VIP-VIRAJ-2026</span>
                <span className="text-zinc-500"> (Quote this for priority response)</span>
              </div>

              <button
                onClick={() => setShowVictory(false)}
                className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Close Victory Screen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EscapeRoomContext.Provider>
  );
}

export const useEscapeRoom = () => useContext(EscapeRoomContext);
