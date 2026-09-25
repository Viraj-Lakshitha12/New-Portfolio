import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { 
  Search, Home, User, Briefcase, Code2, GraduationCap, 
  Mail, Github, Linkedin, Download, Terminal, Layers, 
  ChevronRight, Cpu, Zap
} from 'lucide-react';

const COMMANDS = [
  { id: 'nav-home',      group: 'Navigate', label: 'Go to Home',           icon: Home,          action: () => scrollTo('home') },
  { id: 'nav-about',     group: 'Navigate', label: 'Go to About',          icon: User,          action: () => scrollTo('about') },
  { id: 'nav-services',  group: 'Navigate', label: 'Go to Services',       icon: Cpu,           action: () => scrollTo('services') },
  { id: 'nav-stack',     group: 'Navigate', label: 'Go to Tech Stack',     icon: Layers,        action: () => scrollTo('stack') },
  { id: 'nav-exp',       group: 'Navigate', label: 'Go to Experience',     icon: Briefcase,     action: () => scrollTo('experience') },
  { id: 'nav-projects',  group: 'Navigate', label: 'Go to Projects',       icon: Code2,         action: () => scrollTo('projects') },
  { id: 'nav-education', group: 'Navigate', label: 'Go to Education',      icon: GraduationCap, action: () => scrollTo('education') },
  { id: 'nav-contact',   group: 'Navigate', label: 'Go to Contact',        icon: Mail,          action: () => scrollTo('contact') },
  { id: 'ext-github',    group: 'External', label: 'Open GitHub',          icon: Github,        action: () => window.open('https://github.com/Viraj-Lakshitha12', '_blank'),              shortcut: '↗' },
  { id: 'ext-linkedin',  group: 'External', label: 'Open LinkedIn',        icon: Linkedin,      action: () => window.open('https://www.linkedin.com/in/viraj-lakshitha01/', '_blank'),   shortcut: '↗' },
  { id: 'dl-cv',         group: 'External', label: 'Download CV / Resume', icon: Download,      action: () => { const a = document.createElement('a'); a.href = '/Viraj_Lakshitha_CV.pdf'; a.download = 'Viraj_Lakshitha_CV.pdf'; a.click(); }, shortcut: '⤓' },
  { id: 'terminal',      group: 'Actions',  label: 'Open Terminal',        icon: Terminal,      action: () => scrollTo('terminal') },
  { id: 'hire',          group: 'Actions',  label: 'Hire Viraj 🚀',        icon: Zap,           action: () => scrollTo('contact') },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function filterCommands(query) {
  if (!query.trim()) return COMMANDS;
  const q = query.toLowerCase();
  return COMMANDS.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.group.toLowerCase().includes(q)
  );
}

const GROUP_ORDER = ['Navigate', 'External', 'Actions'];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const dragStartTime = useRef(0);
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const filtered = filterCommands(query);
  const groups = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIdx(0);
  }, []);

  const resetPosition = () => {
    animate(dragX, 0, { type: "spring", stiffness: 300, damping: 25 });
    animate(dragY, 0, { type: "spring", stiffness: 300, damping: 25 });
  };

  const run = useCallback((cmd) => {
    cmd.action();
    close();
    resetPosition();
  }, [close, dragX, dragY]);

  // Handle scroll for dynamic button positioning
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    setActiveIdx(0);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered[activeIdx]) run(filtered[activeIdx]);
  };

  const handlePointerDown = () => { dragStartTime.current = Date.now(); };
  const handleClick = (e) => {
    // If pointer was down for more than 200ms, it was a drag, not a click
    if (Date.now() - dragStartTime.current > 200) {
      e.preventDefault();
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {/* Trigger hint — Draggable floating button inside a scroll-animated wrapper */}
      <motion.div
        className="flex fixed bottom-6 left-6 z-[90]"
        animate={{ y: scrolled ? -65 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.button
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          drag
          dragMomentum={false}
          style={{ x: dragX, y: dragY }}
          className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2.5 rounded-full glass border border-[var(--accent)]/30 shadow-xl text-xs font-medium text-foreground hover:border-[var(--accent)]/60 cursor-grab active:cursor-grabbing transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open Command Palette"
        >
          <Search size={16} className="text-[var(--accent)]" />
          <span className="hidden md:inline">Quick Search</span>
          <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-lg px-4"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              <div className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
                {/* Ambient glow effects behind content */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  {/* Input */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                    <Search size={18} className="text-[var(--accent)] flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search commands, sections, actions..."
                      className="flex-1 bg-transparent outline-none text-base font-medium text-foreground placeholder:text-muted-foreground/60"
                      style={{ fontSize: '16px' }}
                    />
                    <kbd className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5 text-[10px] font-mono text-muted-foreground shadow-sm">ESC</kbd>
                  </div>

                  {/* Results */}
                  <div className="max-h-[380px] overflow-y-auto p-3 custom-scrollbar">
                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-14 opacity-60">
                        <Search size={32} className="mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">No results for "{query}"</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Try searching for something else.</p>
                      </div>
                    ) : (
                      GROUP_ORDER.map(group => {
                        const items = groups[group];
                        if (!items) return null;
                        return (
                          <div key={group} className="mb-3 last:mb-0">
                            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]/70">
                              {group}
                            </p>
                            {items.map(cmd => {
                              const globalIdx = filtered.indexOf(cmd);
                              const isActive = globalIdx === activeIdx;
                              const Icon = cmd.icon;
                              return (
                                <button
                                  key={cmd.id}
                                  onMouseEnter={() => setActiveIdx(globalIdx)}
                                  onClick={() => run(cmd)}
                                  className={`group w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-300 rounded-xl mb-0.5 outline-none ${
                                    isActive
                                      ? 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm translate-x-1'
                                      : 'border border-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:translate-x-1'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                    isActive 
                                      ? 'bg-[var(--accent)] text-white shadow-md' 
                                      : 'bg-black/5 dark:bg-white/5 text-muted-foreground group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:text-foreground'
                                  }`}>
                                    <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                                  </div>
                                  <span className={`flex-1 text-left transition-all duration-300 ${
                                    isActive 
                                      ? 'font-bold text-[var(--accent)]' 
                                      : 'font-medium text-muted-foreground group-hover:text-foreground'
                                  }`}>
                                    {cmd.label}
                                  </span>
                                  {cmd.shortcut && (
                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all duration-300 ${
                                      isActive 
                                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' 
                                        : 'bg-transparent border-transparent text-muted-foreground/50 group-hover:border-black/10 dark:group-hover:border-white/10 group-hover:text-muted-foreground'
                                    }`}>
                                      {cmd.shortcut}
                                    </span>
                                  )}
                                  <ChevronRight size={15} className={`transition-all duration-300 ${
                                    isActive 
                                      ? 'text-[var(--accent)] opacity-100 translate-x-0' 
                                      : 'text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
                                  }`} />
                                </button>
                              );
                            })}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-5 text-[10px] text-muted-foreground font-mono font-medium">
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">↵</kbd> Select</span>
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
