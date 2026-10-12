import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Code2, Menu, X, Home, User, Layers3, BriefcaseBusiness, FolderKanban, GraduationCap, Mail, Settings, Globe, TerminalSquare } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import Magnetic from '@/components/ui/Magnetic';
import { useEscapeRoom } from '@/lib/escape-room-context';

const links = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#stack', icon: Layers3 },
  { label: 'Experience', href: '#experience', icon: BriefcaseBusiness },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Contact', href: '#contact', icon: Mail },
];

const ALL_SECTION_IDS = [
  'home', 'about', 'services', 'stack', 'githubstats', 'githubcity',
  'terminal', 'experience', 'projects', 'education', 'guestbook', 'contact',
];

const HIGHLIGHT_MAP = {
  services: 'about',
  githubstats: 'stack',
  githubcity: 'stack',
  terminal: 'stack',
  guestbook: 'contact',
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const escapeRoom = useEscapeRoom();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isClickScrolling = useRef(false);
  const clickTarget = useRef(null);
  const logoClicks = useRef(0);
  const logoTimer = useRef(null);

  const handleLogoClick = (e) => {
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 3500);

    if (logoClicks.current >= 7) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      escapeRoom?.unlock('clue_2');
      logoClicks.current = 0;
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Handle initial scroll based on URL hash
  useEffect(() => {
    const handlePreloaderFinished = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(HIGHLIGHT_MAP[hash] || hash);
          }
        }, 100);
      }
    };

    window.addEventListener('preloader-finished', handlePreloaderFinished);
    if (!document.querySelector('[class*="fixed inset-0 z-[9999]"]')) {
      handlePreloaderFinished();
    }
    return () => window.removeEventListener('preloader-finished', handlePreloaderFinished);
  }, []);

  // ── Escape key closes mobile menu ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const ratioMap = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap[entry.target.id] = entry.intersectionRatio;
        });

        if (isClickScrolling.current && clickTarget.current) {
          if ((ratioMap[clickTarget.current] ?? 0) > 0) {
            isClickScrolling.current = false;
            clickTarget.current = null;
          } else {
            return;
          }
        }
        let maxRatio = -1;
        let mostVisible = null;

        for (const [id, ratio] of Object.entries(ratioMap)) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        }

        if (mostVisible) {
          setActiveSection(HIGHLIGHT_MAP[mostVisible] || mostVisible);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    const attachObservers = () => {
      ALL_SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    attachObservers();

    window.addEventListener('preloader-finished', attachObservers);

    return () => {
      observer.disconnect();
      window.removeEventListener('preloader-finished', attachObservers);
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const sectionId = href.slice(1);
    const mappedId = HIGHLIGHT_MAP[sectionId] || sectionId;
    setActiveSection(mappedId);
    isClickScrolling.current = true;
    clickTarget.current = sectionId;

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[96%] max-w-4xl">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        >
          <div className={`site-navbar glass rounded-2xl px-4 py-3 flex items-center justify-between ${scrolled ? 'site-navbar-scrolled' : ''}`}>
            <Magnetic>
              <a
                href="#home"
                onClick={handleLogoClick}
                className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight cursor-pointer select-none"
                title="VL.dev — click repeatedly to find a secret..."
              >
                <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                VL.dev
              </a>
            </Magnetic>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const isActive = activeSection === l.href.slice(1);
                return (
                  <a
                    key={l.href + l.label}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className={`nav-link px-3 py-2 rounded-xl text-sm transition-colors duration-200 ${isActive ? 'nav-link-active' : 'text-muted-foreground'}`}
                    style={isActive ? { color: 'var(--accent)', background: 'var(--glass-bg)' } : {}}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="navbar-actions flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                className="mobile-menu-toggle glass rounded-xl w-10 h-10 items-center justify-center"
              >
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>

              {/* Theme Mode Toggle (Light/Dark) */}
              <Magnetic>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className="glass rounded-xl w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  ) : (
                    <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  )}
                </button>
              </Magnetic>

              {/* Escape Room / Secrets & Clues Button */}
              <Magnetic>
                <button
                  type="button"
                  onClick={() => escapeRoom?.setSecretsModalOpen(true)}
                  aria-label="Portfolio Secrets and Escape Room Clues"
                  title={`Portfolio Secrets: ${escapeRoom?.foundCount || 0}/5 clues deciphered. Click to view hints.`}
                  className="glass rounded-xl px-2.5 h-10 flex items-center justify-center gap-1.5 hover:scale-105 transition-transform relative group cursor-pointer"
                  style={escapeRoom?.foundCount > 0 ? { borderColor: 'var(--accent)' } : {}}
                >
                  <span className="text-sm group-hover:rotate-12 transition-transform">🗝️</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {escapeRoom?.foundCount || 0}/5
                  </span>
                  {escapeRoom?.foundCount > 0 && !escapeRoom?.allFound && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                  )}
                  {escapeRoom?.allFound && (
                    <span className="absolute -top-1 -right-1 text-[9px]">⭐</span>
                  )}
                </button>
              </Magnetic>

              {/* Settings & Preferences Button — Placed at the very end */}
              <Magnetic>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-theme-customizer'))}
                  aria-label="Open Preferences & Tools"
                  title="Preferences & Tools (Color, Language, Sound, Terminal)"
                  className="glass rounded-xl w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </button>
              </Magnetic>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="mobile-nav-panel glass md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <div className="mobile-nav-panel-head">
                <span className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="mobile-nav-close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mobile-nav-links">
                {links.map((link) => {
                  const LinkIcon = link.icon;
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <a
                      key={link.href + link.label}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        setMobileOpen(false);
                      }}
                      className={`mobile-nav-link transition-colors duration-200 ${isActive ? 'mobile-nav-link-active' : ''}`}
                      style={isActive ? { color: 'var(--accent)', background: 'var(--glass-bg)' } : {}}
                    >
                      <span className="flex items-center gap-3">
                        <LinkIcon size={17} /> {link.label}
                      </span>
                      <span className="font-mono text-[10px] opacity-50">
                        {link.href.slice(1).toUpperCase()}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Mobile Quick Extras */}
              <div className="p-4 border-t border-border/20 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    escapeRoom?.setSecretsModalOpen(true);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-xs font-mono font-bold text-[var(--accent)] flex items-center justify-center gap-2"
                >
                  <span>🗝️</span> Secrets ({escapeRoom?.foundCount || 0}/5)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent('toggle-terminal-mode'));
                  }}
                  className="py-2.5 px-3 rounded-xl border border-border/40 glass text-xs font-mono text-foreground flex items-center justify-center gap-1.5"
                >
                  <TerminalSquare size={14} style={{ color: 'var(--accent)' }} /> Terminal
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}