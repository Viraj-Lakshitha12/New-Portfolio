import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-3xl">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.3 }}
      >
        <div className={`site-navbar glass rounded-2xl px-4 py-3 flex items-center justify-between ${scrolled ? 'site-navbar-scrolled' : ''}`}>
          <a href="#home" className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight">
            <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            VL.dev
          </a>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                className="nav-link px-3 py-2 rounded-xl text-sm text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
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
        </div>
      </motion.nav>
    </div>
  );
}