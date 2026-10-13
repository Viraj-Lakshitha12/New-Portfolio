import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette, Volume2, VolumeX, Globe, TerminalSquare, Sparkles } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import { useEscapeRoom } from '@/lib/escape-room-context';
import { uiAudio } from '@/lib/audio';

const colors = [
  { name: 'Blue', darkAccent: '#64D2FF', lightAccent: '#0284c7', darkGlow: 'rgba(100, 210, 255, 0.4)', lightGlow: 'rgba(2, 132, 199, 0.4)' },
  { name: 'Emerald', darkAccent: '#34d399', lightAccent: '#059669', darkGlow: 'rgba(52, 211, 153, 0.4)', lightGlow: 'rgba(5, 150, 105, 0.4)' },
  { name: 'Violet', darkAccent: '#a78bfa', lightAccent: '#7c3aed', darkGlow: 'rgba(167, 139, 250, 0.4)', lightGlow: 'rgba(124, 58, 237, 0.4)' },
  { name: 'Rose', darkAccent: '#fb7185', lightAccent: '#e11d48', darkGlow: 'rgba(251, 113, 133, 0.4)', lightGlow: 'rgba(225, 29, 72, 0.4)' },
  { name: 'Amber', darkAccent: '#fbbf24', lightAccent: '#d97706', darkGlow: 'rgba(251, 191, 36, 0.4)', lightGlow: 'rgba(217, 119, 6, 0.4)' },
];

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLanguage } = useI18n();
  const escapeRoom = useEscapeRoom();
  const [activeColor, setActiveColor] = useState(colors[0].name);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Listen for open event from Navbar or elsewhere
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-theme-customizer', handleOpen);
    return () => window.removeEventListener('open-theme-customizer', handleOpen);
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem('portfolio-color');
    const savedSound = localStorage.getItem('portfolio-sound');

    if (savedColor) {
      const colorObj = colors.find((c) => c.name === savedColor);
      if (colorObj) {
        applyColor(colorObj);
      }
    } else {
      applyColor(colors[0]);
    }

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  const applyColor = (colorObj) => {
    setActiveColor(colorObj.name);

    document.documentElement.style.setProperty('--accent-dark', colorObj.darkAccent);
    document.documentElement.style.setProperty('--glow-dark', colorObj.darkGlow);
    document.documentElement.style.setProperty('--accent-light', colorObj.lightAccent);
    document.documentElement.style.setProperty('--glow-light', colorObj.lightGlow);

    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    document.documentElement.style.setProperty(
      '--accent',
      currentTheme === 'dark' ? colorObj.darkAccent : colorObj.lightAccent
    );
    document.documentElement.style.setProperty(
      '--glow',
      currentTheme === 'dark' ? colorObj.darkGlow : colorObj.lightGlow
    );

    localStorage.setItem('portfolio-color', colorObj.name);
  };

  useEffect(() => {
    const colorObj = colors.find((c) => c.name === activeColor) || colors[0];
    document.documentElement.style.setProperty(
      '--accent',
      theme === 'dark' ? colorObj.darkAccent : colorObj.lightAccent
    );
    document.documentElement.style.setProperty(
      '--glow',
      theme === 'dark' ? colorObj.darkGlow : colorObj.lightGlow
    );
  }, [theme, activeColor]);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('portfolio-sound', String(newState));
    window.dispatchEvent(
      new CustomEvent('sound-preference-changed', { detail: { enabled: newState } })
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[101] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -20, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed top-20 right-4 md:right-8 z-[102] w-80 max-w-[94vw] p-5 md:p-6 glass rounded-3xl shadow-2xl border border-[var(--accent)]/30 bg-white/90 dark:bg-zinc-950/95 backdrop-blur-2xl max-h-[85vh] overflow-y-auto custom-scrollbar overscroll-contain"
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/20">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Palette size={18} className="text-[var(--accent)]" /> Preferences & Tools
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close preferences"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Appearance Mode */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Appearance
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      uiAudio.playClick();
                      if (theme !== 'light') toggleTheme();
                    }}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                      theme === 'light'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] shadow-sm'
                        : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-[var(--accent)]/50'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => {
                      uiAudio.playClick();
                      if (theme !== 'dark') toggleTheme();
                    }}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] shadow-sm'
                        : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-[var(--accent)]/50'
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Accent Color
                </label>
                <div className="flex gap-2.5 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        uiAudio.playClick();
                        applyColor(c);
                      }}
                      className={`w-8 h-8 rounded-full transition-all duration-300 relative ${
                        activeColor === c.name
                          ? 'scale-110 shadow-[0_0_12px_var(--glow)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-background'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: theme === 'dark' ? c.darkAccent : c.lightAccent }}
                      title={c.name}
                    >
                      {activeColor === c.name && (
                        <span className="absolute inset-0 rounded-full border-2 border-white dark:border-black opacity-60" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switcher (Moved from Navbar) */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1.5">
                  <Globe size={13} className="text-[var(--accent)]" /> Language / භාෂාව
                </label>
                <div className="flex gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <button
                    onClick={() => {
                      uiAudio.playClick();
                      setLanguage('en');
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all ${
                      lang === 'en'
                        ? 'bg-[var(--accent)] text-black font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      uiAudio.playClick();
                      setLanguage('si');
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all ${
                      lang === 'si'
                        ? 'bg-[var(--accent)] text-black font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    සිංහල (SI)
                  </button>
                </div>
              </div>

              {/* Micro Audio Effects */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Audio Feedback
                </label>
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-[var(--accent)]/50 transition-colors"
                >
                  <span className="text-xs font-medium">UI Micro-Sounds</span>
                  {soundEnabled ? (
                    <Volume2 size={16} className="text-[var(--accent)]" />
                  ) : (
                    <VolumeX size={16} className="text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Developer & Extra Tools (Terminal Mode trigger) */}
              <div className="pt-2 border-t border-border/20">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Interactive Features
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('toggle-terminal-mode'));
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] transition-colors text-xs font-mono font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <TerminalSquare size={15} /> Terminal Mode
                    </span>
                    <span className="text-[10px] opacity-75">Alt+T →</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      escapeRoom?.setSecretsModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-[var(--accent)]/40 transition-colors text-xs font-mono text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span>🗝️</span> Secrets & Clues
                    </span>
                    <span className="text-[10px] text-[var(--accent)] font-bold">
                      {escapeRoom?.foundCount || 0}/5 Found
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
