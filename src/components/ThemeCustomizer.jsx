import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
// We will create useSoundContext later, for now we will just use a stub

const colors = [
  { name: 'Blue', accent: '#64D2FF', glow: 'rgba(100, 210, 255, 0.4)' },
  { name: 'Emerald', accent: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
  { name: 'Violet', accent: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' },
  { name: 'Rose', accent: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)' },
  { name: 'Amber', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
];

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [activeColor, setActiveColor] = useState(colors[0].name);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Listen for changes from ThemeCustomizer
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-theme-customizer', handleOpen);
    return () => window.removeEventListener('open-theme-customizer', handleOpen);
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem('portfolio-color');
    const savedSound = localStorage.getItem('portfolio-sound');
    
    if (savedColor) {
      const colorObj = colors.find(c => c.name === savedColor);
      if (colorObj) {
        applyColor(colorObj);
      }
    }
    
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  const applyColor = (colorObj) => {
    setActiveColor(colorObj.name);
    document.documentElement.style.setProperty('--accent', colorObj.accent);
    document.documentElement.style.setProperty('--glow', colorObj.glow);
    localStorage.setItem('portfolio-color', colorObj.name);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('portfolio-sound', String(newState));
    window.dispatchEvent(new CustomEvent('sound-preference-changed', { detail: { enabled: newState } }));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[101] bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20, originX: 1, originY: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-24 right-6 z-[102] w-72 p-6 glass rounded-2xl shadow-2xl border border-[var(--accent)]/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Palette size={18} className="text-[var(--accent)]" /> Customizer
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Accent Color */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">
                    Accent Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => applyColor(c)}
                        className={`w-8 h-8 rounded-full transition-all duration-300 relative ${
                          activeColor === c.name 
                            ? 'scale-125 shadow-[0_0_10px_var(--glow)]' 
                            : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.accent }}
                        title={c.name}
                      >
                        {activeColor === c.name && (
                          <span className="absolute inset-0 rounded-full border-2 border-white dark:border-black opacity-50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound Effects */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">
                    Micro-Sounds
                  </label>
                  <button
                    onClick={toggleSound}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <span className="text-sm font-medium">UI Audio Effects</span>
                    {soundEnabled ? (
                      <Volume2 size={18} className="text-[var(--accent)]" />
                    ) : (
                      <VolumeX size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Theme Mode */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">
                    Appearance
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                        theme === 'light' 
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' 
                          : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-[var(--accent)]/50'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                        theme === 'dark' 
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' 
                          : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-[var(--accent)]/50'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
