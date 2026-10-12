import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeRoom } from '@/lib/escape-room-context';

/**
 * FirstVisitHint — shown once on first visit, 5s after page load.
 * Teases the 3 hidden features without giving away too much.
 * Dismissed permanently in localStorage.
 */
function FirstVisitHint({ onOpen }) {
  const [show, setShow] = useState(false);
  const escapeRoom = useEscapeRoom();

  useEffect(() => {
    // Show only once per day (24 hours) or once per session
    try {
      if (sessionStorage.getItem('vl_hint_seen_session')) return;
      const lastSeen = localStorage.getItem('vl_hint_seen_timestamp');
      if (lastSeen && Date.now() - Number(lastSeen) < 24 * 60 * 60 * 1000) return;
    } catch {
      // ignore
    }

    const t = setTimeout(() => setShow(true), 4500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem('vl_hint_seen_session', '1');
      localStorage.setItem('vl_hint_seen_timestamp', String(Date.now()));
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.95, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-24 left-1/2 z-[9998] w-[340px] max-w-[92vw] rounded-2xl border border-[var(--accent)]/30 bg-zinc-950/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Auto-progress countdown bar */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-[var(--accent)] to-emerald-400"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 10, ease: 'linear' }}
            style={{ originX: 0 }}
            onAnimationComplete={dismiss}
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1.5">
                <span>⚡</span> Interactive Secrets Inside
              </span>
              <button
                onClick={dismiss}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-3.5">
              {[
                { icon: '🗝️', label: 'Escape Room', hint: '5 hidden clues across the site. Find them all!' },
                { icon: '⌨️', label: 'Terminal Mode', hint: 'Press Alt+T or click ⌨ in navbar for full CLI' },
                { icon: '🏙️', label: 'GitHub City', hint: 'Scroll down to see commits as a 3D skyline' },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-2.5">
                  <span className="text-base leading-none mt-0.5">{f.icon}</span>
                  <div>
                    <span className="text-white text-xs font-semibold">{f.label}</span>
                    <p className="text-zinc-400 text-[11px] leading-snug">{f.hint}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  dismiss();
                  escapeRoom?.setSecretsModalOpen(true);
                }}
                className="flex-1 text-[11px] font-mono py-2 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/25 transition-colors font-bold flex items-center justify-center gap-1"
              >
                View Clues (0/5) →
              </button>
              <button
                onClick={() => {
                  dismiss();
                  onOpen();
                }}
                className="text-[11px] font-mono py-2 px-3 rounded-xl border border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
              >
                Terminal
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


const PROMPT = 'visitor@viraj.dev:~$ ';

const FS = {
  '/': ['about/', 'projects/', 'skills/', 'experience/', 'contact.sh', 'resume.pdf'],
  '/about': ['bio.txt', 'philosophy.txt'],
  '/projects': ['arima-pos.md', 'food-ordering.md', 'sc-graphic-store.md', 'ecommerce-api.md'],
  '/skills': ['frontend.txt', 'backend.txt', 'devops.txt'],
  '/experience': ['roles.txt'],
};

const FILES = {
  '/contact.sh': `#!/bin/bash
# Contact Viraj Lakshitha
echo "📧 viraj.lakshitha.22222@gmail.com"
echo "📱 +94 769 291 462"
echo "🔗 linkedin.com/in/viraj-lakshitha"
echo "💻 github.com/Viraj-Lakshitha12"
echo ""
echo "Open to: Full-time roles, Freelance projects"`,

  '/about/bio.txt': `Name:        Viraj Lakshitha
Role:        Full Stack Software Engineer
Location:    Sri Lanka 🇱🇰
Available:   Open to selected projects

Specialises in scalable web applications with React, 
Spring Boot, Node.js, and modern DevOps practices.
High-performance systems with a focus on clean architecture.`,

  '/about/philosophy.txt': `"I architect and build scalable, high-performance
web applications with a focus on seamless user
experiences and robust backend systems."

I believe great software is invisible — it just works,
fast, and feels right. Every line of code is a
commitment to the user who will run it.`,

  '/skills/frontend.txt': `React ████████████ 95%
TypeScript ████████████ 90%
Next.js ██████████░░ 85%
Tailwind CSS ████████████ 95%
Framer Motion ████████████ 90%
Three.js / WebGL ███████░░░░░ 70%`,

  '/skills/backend.txt': `Spring Boot ████████████ 92%
Node.js / Express ████████████ 90%
PostgreSQL ███████████░ 88%
MongoDB ██████████░░ 85%
Redis █████████░░░ 80%
Docker ██████████░░ 85%`,

  '/skills/devops.txt': `Docker / Compose ██████████░░ 85%
Git / GitHub ████████████ 95%
CI/CD Pipelines █████████░░░ 80%
AWS (EC2, S3) ███████░░░░░ 70%
Vercel / Netlify ████████████ 95%`,

  '/experience/roles.txt': `[2023 - Present]  Associate Software Engineer
                  Arimax Solution
                  React, TypeScript, Spring Boot

[2022 - 2023]     Intern Software Engineer
                  Arimax Solution  
                  React, TypeScript, Jest`,

  '/projects/arima-pos.md': `# Arimax POS System
Tags: React · TypeScript · Spring Boot · PostgreSQL

Challenge: Legacy POS causing 2-hour daily downtime.
Solution:  Full rewrite with real-time inventory sync.
Result:    99.9% uptime · 40% faster transactions

Metrics:
  ⚡ Response  < 200ms
  🛡️ Auth      JWT + Role-based
  📊 Reports   Real-time dashboard`,

  '/projects/food-ordering.md': `# Food Ordering System
Tags: React · Node.js · Express.js · MongoDB

Challenge: Real-time sync between restaurant, driver, customer.
Solution:  Socket.io + Redis pub/sub event-driven architecture.
Result:    < 50ms latency across all clients`,
};

const HELP_TEXT = `
Available commands:
  ls              List directory contents
  cd <dir>        Change directory  
  cat <file>      View file contents
  pwd             Print working directory
  whoami          Display current user
  clear           Clear terminal
  ./contact.sh    Open contact info
  history         Show command history
  hint            Get escape room hint
  exit            Close terminal mode

Keyboard: Ctrl+Shift+T to toggle terminal
`;

export default function TerminalMode() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([
    { type: 'system', text: '╔══════════════════════════════════════════════════╗' },
    { type: 'system', text: '║  Viraj Lakshitha · Portfolio Terminal  v2.0.26   ║' },
    { type: 'system', text: '║  Type "help" for available commands               ║' },
    { type: 'system', text: '╚══════════════════════════════════════════════════╝' },
    { type: 'output', text: '' },
    { type: 'output', text: '🔐 Tip: explore carefully — there are secrets here.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const escapeRoom = useEscapeRoom();

  // Toggle on Alt+T, Ctrl+Shift+T, Ctrl+`, or custom event
  useEffect(() => {
    const handleToggleEvent = () => setOpen((o) => !o);
    const handleOpenEvent = () => setOpen(true);
    const handleCloseEvent = () => setOpen(false);

    window.addEventListener('toggle-terminal-mode', handleToggleEvent);
    window.addEventListener('open-terminal-mode', handleOpenEvent);
    window.addEventListener('close-terminal-mode', handleCloseEvent);

    const onKey = (e) => {
      // Alt + T
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // Ctrl + Shift + T
      if (e.ctrlKey && e.shiftKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // Ctrl + ` (backtick)
      if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // Escape
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('toggle-terminal-mode', handleToggleEvent);
      window.removeEventListener('open-terminal-mode', handleOpenEvent);
      window.removeEventListener('close-terminal-mode', handleCloseEvent);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const resolvePath = useCallback((path) => {
    if (path.startsWith('/')) return path;
    return (cwd === '/' ? '' : cwd) + '/' + path;
  }, [cwd]);

  const print = useCallback((text, type = 'output') => {
    const arr = typeof text === 'string' ? text.split('\n') : text;
    setLines(prev => [...prev, ...arr.map(t => ({ type, text: t }))]);
  }, []);

  const runCommand = useCallback((cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setHistory(h => [trimmed, ...h].slice(0, 50));
    setHistIdx(-1);

    // Echo input
    setLines(prev => [...prev, { type: 'input', text: `${PROMPT}${trimmed}` }]);

    const [command, ...args] = trimmed.split(' ');
    const arg = args.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        print(HELP_TEXT);
        break;

      case 'ls': {
        const target = arg ? resolvePath(arg) : cwd;
        const contents = FS[target] || FS[target + '/'];
        if (contents) {
          print(contents.map(f => f.endsWith('/') ? `\x1b[34m${f}\x1b[0m` : f).join('  '));
        } else {
          print(`ls: ${arg}: No such directory`);
        }
        break;
      }

      case 'cd': {
        if (!arg || arg === '~') { setCwd('/'); print(''); break; }
        if (arg === '..') {
          const parts = cwd.split('/').filter(Boolean);
          parts.pop();
          setCwd('/' + parts.join('/'));
          break;
        }
        const target = resolvePath(arg).replace(/\/+/g, '/');
        if (FS[target]) {
          setCwd(target);
        } else {
          print(`cd: ${arg}: No such directory`);
        }
        break;
      }

      case 'cat': {
        if (!arg) { print('Usage: cat <filename>'); break; }
        const path = resolvePath(arg);
        const content = FILES[path];
        if (content) {
          print(content);
          // Easter egg clue in contact.sh
          if (path === '/contact.sh' && escapeRoom) {
            escapeRoom.unlock('clue_3');
            print('\n🗝️  You found a clue! (3/5)', 'success');
          }
        } else {
          print(`cat: ${arg}: No such file`);
        }
        break;
      }

      case 'pwd':
        print(cwd);
        break;

      case 'whoami':
        print('visitor · unauthorized · (but curious — we like that)');
        break;

      case 'history':
        print(history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') || 'No history yet.');
        break;

      case 'clear':
        setLines([]);
        break;

      case './contact.sh':
      case 'sh':
        print(FILES['/contact.sh']);
        break;

      case 'hint':
        if (escapeRoom) {
          const notFound = Object.keys(escapeRoom.CLUE_HINTS).find(k => !escapeRoom.found[k]);
          if (notFound) {
            print(`💡 Hint: ${escapeRoom.CLUE_HINTS[notFound]}`);
          } else {
            print('🏆 You found all clues!');
          }
        }
        break;

      case 'exit':
        setOpen(false);
        break;

      default:
        print(`command not found: ${command}. Type "help" for commands.`);
    }
    print('');
  }, [cwd, history, print, resolvePath, escapeRoom]);

  const onSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  const lineColor = (type) => {
    if (type === 'input') return 'text-[var(--accent)]';
    if (type === 'system') return 'text-emerald-400';
    if (type === 'success') return 'text-yellow-400';
    return 'text-zinc-300';
  };

  return (
    <>
      {/* First-visit hint toast — auto-dismisses after 8s, never shown again */}
      <FirstVisitHint onOpen={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-mode"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[99997] bg-[#0a0a0a] flex flex-col font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 select-none">
              <div className="flex gap-1.5">
                <button onClick={() => setOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-zinc-500 text-xs">visitor@viraj.dev — terminal — {cwd}</span>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors"
              >
                ESC to close
              </button>
            </div>

            {/* Terminal output */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5 custom-scrollbar">
              {lines.map((line, i) => (
                <div key={i} className={`leading-relaxed whitespace-pre-wrap ${lineColor(line.type)}`}>
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950/50">
              <span className="text-emerald-400 shrink-0 select-none">{PROMPT}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent text-zinc-100 outline-none caret-[var(--accent)] placeholder-zinc-600"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
