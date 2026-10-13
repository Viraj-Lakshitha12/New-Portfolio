import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeRoom } from '@/lib/escape-room-context';
import { uiAudio } from '@/lib/audio';

const PROMPT = 'visitor@viraj.dev:~$ ';

const INITIAL_FS = {
  '/': ['about/', 'projects/', 'skills/', 'experience/', 'contact.sh', 'resume.pdf'],
  '/about': ['bio.txt', 'philosophy.txt'],
  '/projects': ['arima-pos.md', 'food-ordering.md', 'sc-graphic-store.md', 'ecommerce-api.md'],
  '/skills': ['frontend.txt', 'backend.txt', 'devops.txt'],
  '/experience': ['roles.txt'],
};

const INITIAL_FILES = {
  '/contact.sh': `#!/bin/bash
# Contact Viraj Lakshitha Adhikari
echo "📧 viraj.lakshitha.22222@gmail.com"
echo "📱 +94 769 291 462"
echo "🔗 linkedin.com/in/viraj-lakshitha01"
echo "💻 github.com/Viraj-Lakshitha12"
echo ""
echo "Status: Open to Full-time & Selected Consulting Projects"`,

  '/about/bio.txt': `Name:        Viraj Lakshitha Adhikari
Role:        Full Stack Software Engineer
Location:    Sri Lanka 🇱🇰
Company:     INTELLEON (2024 - Present)
Available:   Open to opportunities

Specialises in high-performance web systems with React, 
TypeScript, Java Spring Boot, Node.js, and modern DevOps.
Architects clean, scalable, production-grade applications.`,

  '/about/philosophy.txt': `"I architect and build scalable, high-performance
web applications with a focus on seamless user
experiences and robust backend systems."

Great software should feel effortless, fast, and durable.
Every millisecond of latency eliminated is respect paid to the user.`,

  '/skills/frontend.txt': `React / Next.js     ████████████ 95%
TypeScript          ████████████ 92%
Tailwind CSS        ████████████ 95%
Framer Motion       ████████████ 90%
Three.js / WebGL    ███████░░░░░ 72%
Redux / Zustand     ██████████░░ 88%`,

  '/skills/backend.txt': `Java Spring Boot    ████████████ 92%
Node.js / Express   ████████████ 90%
PostgreSQL / SQL    ███████████░ 88%
MongoDB             ██████████░░ 85%
Redis Caching       █████████░░░ 82%
Docker / Microserv. ██████████░░ 86%`,

  '/skills/devops.txt': `Docker / Compose    ██████████░░ 86%
Git / GitHub CI/CD  ████████████ 94%
AWS (EC2, S3)       ███████░░░░░ 72%
Vercel & Netlify    ████████████ 95%
Linux Shell Script  ██████████░░ 85%`,

  '/experience/roles.txt': `[2024 - Present]  Software Engineer @ INTELLEON
                  Java Spring Boot, React, Microservices, Cloud

[2023 - 2024]     Associate Software Engineer @ INTELLEON
                  Full stack web applications, REST APIs

[2023]            Intern Software Engineer @ INTELLEON
                  Component architecture, automated testing`,

  '/projects/arima-pos.md': `# Arimax Cloud POS System
Stack: React · TypeScript · Spring Boot · PostgreSQL
• Full rewrite replacing legacy system with zero data loss
• Real-time multi-branch inventory sync with 99.9% uptime
• 40% reduction in checkout latency (< 180ms avg response)`,

  '/projects/food-ordering.md': `# Real-Time Food Ordering Platform
Stack: React · Node.js · Express.js · MongoDB · Redis
• Multi-role live dispatch for restaurant, courier, customer
• Socket.io event-driven tracking with < 50ms broadcast delay`,

  '/projects/sc-graphic-store.md': `# SC Graphic Asset Store
Stack: React · Node.js · Cloudinary · Stripe
• Digital media e-commerce platform with automated DRM & checkout`,

  '/projects/ecommerce-api.md': `# High-Concurrency E-Commerce API
Stack: Spring Boot · Redis Cache · PostgreSQL · Docker
• Rate-limited REST API handling 1,500+ requests/sec with JWT auth`,
};

const COLOR_PALETTE = {
  blue: { dark: '#64D2FF', glow: 'rgba(100, 210, 255, 0.4)', name: 'Blue' },
  emerald: { dark: '#34d399', glow: 'rgba(52, 211, 153, 0.4)', name: 'Emerald' },
  violet: { dark: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)', name: 'Violet' },
  rose: { dark: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)', name: 'Rose' },
  amber: { dark: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', name: 'Amber' },
};

const ALL_COMMANDS = [
  'help', 'ls', 'cd', 'cat', 'pwd', 'tree', 'touch', 'mkdir', 'rm',
  'neofetch', 'sysinfo', 'matrix', 'ping', 'curl', 'theme', 'top', 'htop',
  'weather', 'git', 'cv', 'download', 'game', 'history', 'hint', 'whoami',
  'date', 'uptime', 'clear', 'exit'
];

const HELP_TEXT = `╔══════════════════════════════════════════════════════════════════╗
║               VIRAJ.DEV ADVANCED WORKSTATION v3.0                ║
╚══════════════════════════════════════════════════════════════════╝

📁 File System & Navigation:
  ls [-l]          List directory contents
  cd <dir>         Change directory (e.g. cd projects, cd ..)
  cat <file>       Display file contents (e.g. cat /about/bio.txt)
  pwd              Print working directory
  tree             Render complete visual directory tree
  touch <file>     Create a new empty file
  mkdir <dir>      Create a new directory
  rm <file>        Delete a file

⚡ Pro Developer Tools:
  neofetch         System architecture & live telemetry
  matrix           Cinematic digital green rain animation
  ping <host>      Network latency ping test (e.g. ping google.com)
  curl <endpoint>  Fetch simulated API response
  theme <color>    Switch portfolio color (blue, emerald, violet, rose, amber)
  top / htop       Real-time virtual process monitor
  weather          Live ASCII weather for Colombo, Sri Lanka
  git [status|log] Inspect portfolio repository state & commits
  download cv      1-click download Viraj's official CV
  game             Play mini hacker number guessing challenge!

🔧 System & Session:
  history          Display command history
  hint             Inspect escape room secrets hint
  clear            Clear terminal buffer
  exit             Close terminal mode (or press ESC / Alt+T)

💡 Pro tip: Press [TAB] for instant command & file autocompletion!`;

export default function TerminalMode() {
  const [open, setOpen] = useState(false);
  const [fs, setFs] = useState(INITIAL_FS);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [cwd, setCwd] = useState('/');
  const [lines, setLines] = useState([
    { type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║   Viraj Lakshitha · Interactive Workstation v3.0.26       ║' },
    { type: 'system', text: '║   Type "help" for command matrix · Press [TAB] for auto  ║' },
    { type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
    { type: 'output', text: '' },
    { type: 'output', text: '⚡ Tip: Run "neofetch" for system telemetry or "matrix" for rain.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);
  const [gameTarget, setGameTarget] = useState(null);
  const [gameAttempts, setGameAttempts] = useState(0);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const escapeRoom = useEscapeRoom();
  const startTimeRef = useRef(Date.now());

  // Prevent background scrolling and pause Lenis when terminal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].stop();
      }
      setTimeout(() => inputRef.current?.focus(), 80);
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
  }, [open]);

  // Toggle shortcuts: Alt+T, Ctrl+Shift+T, Ctrl+`, or custom event
  useEffect(() => {
    const handleToggleEvent = () => setOpen((o) => !o);
    const handleOpenEvent = () => setOpen(true);
    const handleCloseEvent = () => setOpen(false);

    window.addEventListener('toggle-terminal-mode', handleToggleEvent);
    window.addEventListener('open-terminal-mode', handleOpenEvent);
    window.addEventListener('close-terminal-mode', handleCloseEvent);

    const onKey = (e) => {
      if ((e.altKey && (e.key === 't' || e.key === 'T')) ||
          (e.ctrlKey && e.shiftKey && (e.key === 't' || e.key === 'T')) ||
          (e.ctrlKey && (e.key === '`' || e.key === '~'))) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && open) {
        if (matrixActive) {
          setMatrixActive(false);
        } else {
          setOpen(false);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('toggle-terminal-mode', handleToggleEvent);
      window.removeEventListener('open-terminal-mode', handleOpenEvent);
      window.removeEventListener('close-terminal-mode', handleCloseEvent);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, matrixActive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    if (!matrixActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const timer = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);

    // Auto-dismiss after 8 seconds
    const timeout = setTimeout(() => {
      setMatrixActive(false);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [matrixActive]);

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

    uiAudio.playClick();
    setHistory(h => [trimmed, ...h].slice(0, 50));
    setHistIdx(-1);

    // Echo user input
    setLines(prev => [...prev, { type: 'input', text: `${PROMPT}${trimmed}` }]);

    // Active Number Game Handler
    if (gameTarget !== null) {
      const guess = parseInt(trimmed, 10);
      if (isNaN(guess)) {
        if (trimmed.toLowerCase() === 'quit' || trimmed.toLowerCase() === 'exit') {
          setGameTarget(null);
          print('Game session aborted.');
        } else {
          print('Please enter a valid number (or type "quit"):');
        }
        return;
      }
      const attempts = gameAttempts + 1;
      setGameAttempts(attempts);
      if (guess === gameTarget) {
        uiAudio.playSuccess();
        print(`🎉 BINGO! Target ${gameTarget} hacked in ${attempts} attempts!`, 'success');
        print('Root firewall successfully bypassed. You are a true hacker.', 'system');
        setGameTarget(null);
      } else if (guess < gameTarget) {
        print(`▲ Too LOW! Try a higher number (Attempt ${attempts}):`);
      } else {
        print(`▼ Too HIGH! Try a lower number (Attempt ${attempts}):`);
      }
      return;
    }

    const [command, ...args] = trimmed.split(' ');
    const arg = args.join(' ').trim();
    const baseCmd = command.toLowerCase();

    switch (baseCmd) {
      case 'help':
        print(HELP_TEXT);
        break;

      case 'ls': {
        const target = arg ? resolvePath(arg) : cwd;
        const normalized = target === '/' ? '/' : target.replace(/\/$/, '');
        const contents = fs[normalized] || fs[normalized + '/'];
        if (contents) {
          print(contents.map(f => f.endsWith('/') ? `📁 ${f}` : `📄 ${f}`).join('    '));
        } else {
          print(`ls: ${arg}: No such directory`, 'error');
        }
        break;
      }

      case 'cd': {
        if (!arg || arg === '~') {
          setCwd('/');
          break;
        }
        if (arg === '..') {
          const parts = cwd.split('/').filter(Boolean);
          parts.pop();
          setCwd('/' + parts.join('/'));
          break;
        }
        const target = resolvePath(arg).replace(/\/+/g, '/').replace(/\/$/, '');
        const targetNormalized = target === '' ? '/' : target;
        if (fs[targetNormalized]) {
          setCwd(targetNormalized);
        } else {
          print(`cd: ${arg}: No such directory`, 'error');
        }
        break;
      }

      case 'cat': {
        if (!arg) {
          print('Usage: cat <filename>');
          break;
        }
        const path = resolvePath(arg);
        const content = files[path];
        if (content) {
          print(content);
          if (path === '/contact.sh' && escapeRoom) {
            escapeRoom.unlock('clue_3');
            print('\n🗝️ Clue 3/5 deciphered! Excellent investigative work.', 'success');
          }
        } else {
          print(`cat: ${arg}: No such file`, 'error');
        }
        break;
      }

      case 'pwd':
        print(cwd);
        break;

      case 'tree': {
        let treeOutput = '.\n';
        Object.keys(fs).forEach(dir => {
          treeOutput += `├── ${dir === '/' ? 'root/' : dir}\n`;
          (fs[dir] || []).forEach(item => {
            treeOutput += `│   └── ${item}\n`;
          });
        });
        print(treeOutput);
        break;
      }

      case 'touch': {
        if (!arg) { print('Usage: touch <filename>'); break; }
        const path = resolvePath(arg);
        const filename = arg.split('/').pop();
        setFiles(prev => ({ ...prev, [path]: `# ${filename}\nCreated by visitor at ${new Date().toLocaleTimeString()}` }));
        setFs(prev => {
          const curList = prev[cwd] || [];
          return curList.includes(filename) ? prev : { ...prev, [cwd]: [...curList, filename] };
        });
        print(`Created file ${filename}`);
        break;
      }

      case 'mkdir': {
        if (!arg) { print('Usage: mkdir <dirname>'); break; }
        const dirName = arg.replace(/\/$/, '') + '/';
        const fullDir = (cwd === '/' ? '' : cwd) + '/' + arg.replace(/\/$/, '');
        setFs(prev => ({
          ...prev,
          [cwd]: [...(prev[cwd] || []), dirName],
          [fullDir]: []
        }));
        print(`Created directory ${dirName}`);
        break;
      }

      case 'rm': {
        if (!arg) { print('Usage: rm <filename>'); break; }
        const path = resolvePath(arg);
        const filename = arg.split('/').pop();
        setFiles(prev => {
          const next = { ...prev };
          delete next[path];
          return next;
        });
        setFs(prev => ({
          ...prev,
          [cwd]: (prev[cwd] || []).filter(f => f !== filename && f !== filename + '/')
        }));
        print(`Removed ${filename}`);
        break;
      }

      case 'neofetch':
      case 'sysinfo': {
        const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const mins = Math.floor(elapsedSec / 60);
        const secs = elapsedSec % 60;
        const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
        const res = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080';
        const browser = typeof navigator !== 'undefined' && navigator.userAgent.includes('Chrome') ? 'Google Chrome' : 'Modern Browser';

        const banner = `
          _      __     ___.          visitor@viraj.dev
         / \\    / /__  /   /          -----------------
        /   \\  / /   \\/   /           OS: Viraj-OS v3.0 (Web Architecture)
       /  /\\ \\/ / /\\     /            Host: Intel-Core Architecture · Sri Lanka 🇱🇰
      /__/  \\__/_/  \\___/             Uptime: ${mins}m ${secs}s
                                      Browser: ${browser}
                                      Cores: ${cores} vCPU Threads
                                      Resolution: ${res}
                                      Memory: ~8.0 GB Virtual V8 Heap
                                      Frontend: React 18 · Framer Motion · Three.js
                                      Backend: Java Spring Boot · PostgreSQL · Redis
                                      Status: Open for Full-Time / Consulting Roles ✅
        `;
        print(banner, 'system');
        break;
      }

      case 'matrix':
        setMatrixActive(true);
        print('Entering the Matrix... (Press ESC or wait 8s to return)', 'system');
        break;

      case 'ping': {
        const host = arg || 'google.com';
        print(`PING ${host} (142.250.190.46): 56 data bytes`);
        setTimeout(() => print(`64 bytes from ${host}: icmp_seq=0 ttl=118 time=14.2 ms`), 300);
        setTimeout(() => print(`64 bytes from ${host}: icmp_seq=1 ttl=118 time=13.8 ms`), 600);
        setTimeout(() => print(`64 bytes from ${host}: icmp_seq=2 ttl=118 time=15.1 ms`), 900);
        setTimeout(() => {
          print(`--- ${host} ping statistics ---`);
          print(`3 packets transmitted, 3 packets received, 0.0% packet loss`);
          print(`round-trip min/avg/max = 13.8/14.36/15.1 ms`, 'success');
        }, 1200);
        break;
      }

      case 'curl': {
        const endpoint = arg || 'api.viraj.dev/status';
        print(`Fetching HTTP/2 200 OK from ${endpoint}...`);
        const mockResponse = JSON.stringify({
          status: 'online',
          engineer: 'Viraj Lakshitha Adhikari',
          role: 'Full Stack Software Engineer',
          company: 'INTELLEON',
          location: 'Sri Lanka',
          available_for_hire: true,
          response_latency_ms: 18,
          timestamp: new Date().toISOString(),
        }, null, 2);
        setTimeout(() => print(mockResponse, 'system'), 400);
        break;
      }

      case 'theme': {
        const selected = arg.toLowerCase();
        if (COLOR_PALETTE[selected]) {
          const c = COLOR_PALETTE[selected];
          document.documentElement.style.setProperty('--accent-dark', c.dark);
          document.documentElement.style.setProperty('--glow-dark', c.glow);
          document.documentElement.style.setProperty('--accent', c.dark);
          document.documentElement.style.setProperty('--glow', c.glow);
          try {
            localStorage.setItem('portfolio-color', c.name);
          } catch {
            // ignore
          }
          uiAudio.playSuccess();
          print(`✓ Palette updated to [${c.name.toUpperCase()}]. Interface updated.`, 'success');
        } else {
          print(`Available themes: ${Object.keys(COLOR_PALETTE).join(', ')}`);
          print('Usage: theme <color> (e.g. theme emerald, theme violet)');
        }
        break;
      }

      case 'top':
      case 'htop': {
        const topTable = `
  PID  USER     PR  NI    VIRT    RES  %CPU  %MEM     TIME+ COMMAND
  101  visitor  20   0  520.4M  48.2M   2.4   6.8   0:04.12 react-fiber-dom
  204  root     20   0  380.1M  32.0M   0.8   4.5   0:01.89 vite-hmr-server
  319  viraj    20   0  812.9M  94.1M   3.8  13.2   0:12.44 neural-engine
  404  daemon   20   0  120.0M   8.4M   0.1   1.2   0:00.32 coffee-daemon
  999  security 20   0  240.5M  18.6M   0.2   2.6   0:00.88 escape-monitor
        `;
        print(topTable, 'system');
        break;
      }

      case 'weather': {
        const weatherCard = `
  📍 Colombo, Sri Lanka (GMT+5:30)
  ┌──────────────────────────────┐
  │       \\   /      Clear Sky   │
  │        .-.       29°C / 84°F │
  │     ― (   ) ―    Humidity 72%│
  │        \`-'       Wind: 14km/h│
  │       /   \\      UV Index: 6 │
  └──────────────────────────────┘
  Condition: Optimal coding weather.
        `;
        print(weatherCard, 'system');
        break;
      }

      case 'git': {
        if (arg === 'log') {
          print(`commit a89e1b2 (HEAD -> main, origin/main)
Author: Viraj Lakshitha <viraj.lakshitha.22222@gmail.com>
Date:   ${new Date().toDateString()}

    feat: integrate 3D architecture, responsive city skyline, and secrets system

commit 7f33d41
Author: Viraj Lakshitha <viraj.lakshitha.22222@gmail.com>

    refactor: optimize 60fps physics, custom cursor and theme customization`);
        } else {
          print(`On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean ✨`, 'success');
        }
        break;
      }

      case 'cv':
      case 'download': {
        const a = document.createElement('a');
        a.href = '/Viraj_Lakshitha_CV.pdf';
        a.download = 'Viraj_Lakshitha_CV.pdf';
        a.click();
        uiAudio.playSuccess();
        print('Initiating secure download of Viraj_Lakshitha_CV.pdf...');
        print('[████████████████████████████████] 100% (2.4 MB)', 'system');
        print('✓ CV dispatched to your browser download manager!', 'success');
        break;
      }

      case 'game':
      case 'play': {
        const target = Math.floor(Math.random() * 50) + 1;
        setGameTarget(target);
        setGameAttempts(0);
        print('🎮 HACKER NUMBER GAME INITIATED!');
        print('I have generated a secret number between 1 and 50.');
        print('Type your first guess (or type "quit" to exit):', 'system');
        break;
      }

      case 'sudo': {
        if (arg.includes('rm -rf') || arg.includes('rm')) {
          print('⚠️ ROOT SECURITY BREACH DETECTED!', 'error');
          print('Access denied: "Nice try, Neo. The matrix is bulletproof." 😉');
        } else {
          print('sudo: permission denied. Viraj holds root authority here.');
        }
        break;
      }

      case 'whoami':
        print('visitor · curious investigator · welcomed guest');
        break;

      case 'date':
        print(`📅 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })} (Sri Lanka Time)`);
        break;

      case 'uptime': {
        const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        print(`Terminal session uptime: ${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`);
        break;
      }

      case 'history':
        print(history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') || 'No commands recorded yet.');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'hint':
        if (escapeRoom) {
          const notFound = Object.keys(escapeRoom.CLUE_HINTS).find(k => !escapeRoom.found[k]);
          if (notFound) {
            print(`💡 Secret Clue Hint: ${escapeRoom.CLUE_HINTS[notFound]}`, 'system');
          } else {
            print('🏆 Incredible! All 5 secrets unlocked! Check your Victory Screen.', 'success');
          }
        }
        break;

      case 'exit':
      case 'quit':
        setOpen(false);
        break;

      default:
        print(`command not found: "${command}". Type "help" to view all available commands.`, 'error');
    }

    print('');
  }, [cwd, fs, files, history, resolvePath, escapeRoom, gameTarget, gameAttempts]);

  const onSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const onKeyDown = (e) => {
    // Sound on keystroke
    uiAudio.playTyping();

    // Tab Autocompletion
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.trimStart();
      const parts = current.split(' ');

      if (parts.length === 1) {
        const prefix = parts[0].toLowerCase();
        const match = ALL_COMMANDS.find(c => c.startsWith(prefix) && c !== prefix);
        if (match) {
          setInput(match + ' ');
          uiAudio.playClick();
        }
      } else if (parts.length >= 2) {
        const prefix = parts[parts.length - 1];
        const contents = fs[cwd] || [];
        const match = contents.find(f => f.startsWith(prefix) && f !== prefix);
        if (match) {
          parts[parts.length - 1] = match;
          setInput(parts.join(' ') + (match.endsWith('/') ? '' : ' '));
          uiAudio.playClick();
        }
      }
      return;
    }

    // Command History Navigation
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
    if (type === 'input') return 'text-[var(--accent)] font-semibold';
    if (type === 'system') return 'text-emerald-400 font-mono';
    if (type === 'success') return 'text-yellow-400 font-bold';
    if (type === 'error') return 'text-rose-400 font-mono';
    return 'text-zinc-300';
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-mode"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[99997] bg-[#0a0a0a] flex flex-col font-mono text-xs sm:text-sm select-none overscroll-contain"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Matrix Rain Canvas Overlay */}
            {matrixActive && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-20 pointer-events-auto cursor-pointer"
                onClick={() => setMatrixActive(false)}
              />
            )}

            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 select-none z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer flex items-center justify-center text-[9px] text-red-950 font-bold"
                  title="Close Terminal (ESC)"
                >
                  ✕
                </button>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 opacity-80" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 opacity-80" />
                <span className="text-zinc-400 text-xs ml-2 hidden sm:inline">
                  visitor@viraj.dev · workstation
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="hidden md:inline px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  dir: {cwd}
                </span>
                <span className="text-zinc-400">ESC or Alt+T to close</span>
              </div>
            </div>

            {/* Terminal Output Buffer */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 custom-scrollbar overscroll-contain z-10"
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`leading-relaxed whitespace-pre-wrap select-text ${lineColor(line.type)}`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Interactive Command Input Line */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 px-4 sm:px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 z-10"
            >
              <span className="text-emerald-400 shrink-0 font-bold select-none">
                {gameTarget !== null ? 'guess@game:~$ ' : PROMPT}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent text-zinc-100 outline-none caret-[var(--accent)] placeholder-zinc-700 text-xs sm:text-sm font-mono"
                placeholder={gameTarget !== null ? 'enter your number guess...' : 'type command (try "help", "neofetch", "matrix")...'}
                autoComplete="off"
                spellCheck="false"
              />
              <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
                TAB: auto · ↑↓: history
              </span>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
