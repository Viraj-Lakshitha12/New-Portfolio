import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Code2, Menu, X, Home, User, Layers3, BriefcaseBusiness, FolderKanban, GraduationCap, Mail } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import Magnetic from '@/components/ui/Magnetic';

const links = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#stack', icon: Layers3 },
  { label: 'Experience', href: '#experience', icon: BriefcaseBusiness },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Contact', href: '#contact', icon: Mail },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const updateActiveSection = () => {
      const marker = window.scrollY + 160;
      const currentSection = sections.reduce((active, section) => {
        if (!(section instanceof HTMLElement)) return active;
        return section.offsetTop <= marker ? section : active;
      }, sections[0]);

      if (currentSection) setActiveSection(currentSection.id);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-3xl">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.3 }}
      >
        <div className={`site-navbar glass rounded-2xl px-4 py-3 flex items-center justify-between ${scrolled ? 'site-navbar-scrolled' : ''}`}>
          <Magnetic>
            <a href="#home" className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight">
              <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              VL.dev
            </a>
          </Magnetic>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(l.href.slice(1));
                  document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, '', l.href);
                }}
                className={`nav-link px-3 py-2 rounded-xl text-sm ${activeSection === l.href.slice(1) ? 'nav-link-active' : 'text-muted-foreground'}`}
              >
                {l.label}
              </a>
            ))}
          </div>
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
            <Magnetic>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="glass rounded-xl w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                ) : (
                  <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.nav>
      </div>
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
                <span className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>Navigation</span>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" className="mobile-nav-close"><X size={18} /></button>
              </div>
              <div className="mobile-nav-links">
                {links.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <a
                      key={link.href + link.label}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(link.href.slice(1));
                        document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, '', link.href);
                        setMobileOpen(false);
                      }}
                      className={`mobile-nav-link ${activeSection === link.href.slice(1) ? 'mobile-nav-link-active' : ''}`}
                    >
                      <span className="flex items-center gap-3"><LinkIcon size={17} /> {link.label}</span>
                      <span className="font-mono text-[10px] opacity-50">{link.href.slice(1).toUpperCase()}</span>
                    </a>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}