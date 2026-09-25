import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { uiAudio } from '@/lib/audio';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to VL.dev terminal. Type "help" to see available commands.' }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const commands = {
    help: '📋 Available commands:\n   whoami     → About Viraj\n   skills     → Tech stack\n   experience → Work history\n   education  → Academic background\n   projects   → Featured projects\n   contact    → Contact details\n   ls         → List sections\n   open       → open [linkedin|github|cv]\n   hire       → Let\'s work together!\n   date       → Current date & time\n   echo [txt] → Repeat your text\n   clear      → Clear terminal\n   neofetch   → System info\n   sudo       → 😏 Try it...',
    whoami: '👋 Viraj Lakshitha Adhikari\n   Role   : Full Stack Software Engineer\n   Company: INTELLEON (2024 - Present)\n   Country: Sri Lanka 🇱🇰\n   Focus  : Scalable web systems, clean code, great UX\n   Fun    : Building things that make people say "wow"',
    skills: '⚡ Core Tech Stack:\n   ┌─ Frontend  : React, TypeScript, Next.js, Tailwind CSS\n   ├─ Backend   : Java Spring Boot, Node.js, Express\n   ├─ Databases : PostgreSQL, MySQL, MongoDB, Redis\n   ├─ DevOps    : Docker, AWS, CI/CD\n   └─ Tools     : Git, Figma, Postman, IntelliJ',
    experience: '💼 Career Timeline:\n   2024 - Now  → Software Engineer @ INTELLEON\n   2023 - 2024 → Associate SE @ INTELLEON\n   2023        → Intern SE @ INTELLEON\n   \n   Building production systems trusted by thousands of users.',
    education: '🎓 Academic Background:\n   BSc (Hons) Computing\n   └─ Wrexham University (UK)\n   \n   Graduate Diploma in Software Engineering\n   └─ IJSE - Institute of Java & Software Engineering',
    contact: '📬 Let\'s Connect:\n   Email    → viraj.lakshitha.22222@gmail.com\n   LinkedIn → linkedin.com/in/viraj-lakshitha01\n   GitHub   → github.com/Viraj-Lakshitha12\n   \n   Or type "hire" to start a conversation! 🚀',
    projects: '🚀 Featured Projects:\n   1. This Portfolio  → React + Framer Motion + AI Chatbot\n   2. Service Mgmt    → Spring Boot + React + PostgreSQL\n   3. Property System → Node.js + MongoDB + JWT Auth\n   \n   → Scroll to #projects for full details',
    ls: '📂 Portfolio Sections:\n   home/        → Hero & Introduction\n   about/       → About Viraj\n   services/    → What I offer\n   stack/       → Tech Stack\n   experience/  → Work History\n   projects/    → Featured Projects\n   education/   → Academic Background\n   contact/     → Get in Touch',
    hire: '🎉 Great choice! Let\'s build something amazing together.\n   \n   📧 viraj.lakshitha.22222@gmail.com\n   💼 linkedin.com/in/viraj-lakshitha01\n   \n   Currently: ✅ Available for opportunities\n   Response time: < 24 hours',
    date: `📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n   🕐 ${new Date().toLocaleTimeString('en-US')} (Sri Lanka / GMT+5:30)`,
    neofetch: '   viraj@vl.dev\n   ──────────────\n   OS     : Human Brain v25.0\n   Host   : Sri Lanka, Earth\n   Shell  : VSCode + IntelliJ\n   CPU    : Java Spring Boot @ 3.2GHz\n   GPU    : React + Framer Motion\n   RAM    : 8+ years of CS knowledge\n   Disk   : GitHub (∞ TB)\n   Status : Available for hire ✅',
    sudo: '⚠️  sudo: permission denied\n   Nice try, but you\'ll have to hire Viraj the normal way 😄\n   Try: hire',
    'sudo hire-me': '🚀 OVERRIDE ACCEPTED. Initiating hire sequence...\n   ████████████████████████████ 100%\n   ✅ Viraj successfully hired!\n   📧 Sending onboarding email to: viraj.lakshitha.22222@gmail.com\n   (just kidding — but seriously, reach out!) 😄',
    clear: 'CLEAR_COMMAND',
    open: 'OPEN_COMMAND',
    matrix: 'Wake up, Neo...\n   The Matrix has you...\n   Follow the white rabbit.\n   Knock, knock, Neo.',
    'rm -rf /': '😱 WARNING: SYSTEM COMPROMISED.\n   Just kidding! You don\'t have root privileges here.\n   Nice try though! 😉',
    hack: 'Initiating hack sequence...\n   Bypassing mainframe... [OK]\n   Cracking encryption... [OK]\n   Accessing secret files... [FAILED]\n   \n   Ah ah ah! You didn\'t say the magic word! 🦖',
  };


  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const raw = input.trim();
      const cmd = raw.toLowerCase();
      const parts = cmd.split(' ');
      const baseCmd = parts[0];

      if (!cmd) return;

      const newHistory = [...history, { type: 'user', content: `$ ${raw}` }];

      if (baseCmd === 'clear') {
        setHistory([]);
      } else if (baseCmd === 'echo') {
        newHistory.push({ type: 'system', content: parts.slice(1).join(' ') || '(empty)' });
        setHistory(newHistory);
      } else if (cmd === 'sudo hire-me') {
        newHistory.push({ type: 'success', content: commands['sudo hire-me'] });
        setHistory(newHistory);
      } else if (baseCmd === 'open') {
        const target = parts[1];
        const urls = {
          linkedin: 'https://www.linkedin.com/in/viraj-lakshitha01/',
          github: 'https://github.com/Viraj-Lakshitha12',
          cv: '/Viraj_Lakshitha_CV.pdf',
        };
        if (urls[target]) {
          window.open(urls[target], '_blank');
          newHistory.push({ type: 'success', content: `🚀 Opening ${target}...` });
        } else {
          newHistory.push({ type: 'error', content: `Usage: open [linkedin|github|cv]` });
        }
        setHistory(newHistory);
      } else if (baseCmd === 'date') {
        newHistory.push({ type: 'system', content: `📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n   🕐 ${new Date().toLocaleTimeString('en-US')} (Sri Lanka / GMT+5:30)` });
        setHistory(newHistory);
      } else if (commands[cmd]) {
        newHistory.push({ type: 'system', content: commands[cmd] });
        setHistory(newHistory);
      } else if (commands[baseCmd]) {
        newHistory.push({ type: 'system', content: commands[baseCmd] });
        setHistory(newHistory);
      } else {
        newHistory.push({ type: 'error', content: `Command not found: ${baseCmd}. Type "help" for available commands.` });
        setHistory(newHistory);
      }

      setInput('');
    }
  };


  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section id="terminal" className="relative py-16 md:py-24 px-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
            Interactive
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Developer Terminal</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Try typing <code className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-xs">help</code> to explore
          </p>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          className="glass rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/30"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Title Bar */}
          <div className="bg-zinc-200/80 dark:bg-zinc-800/80 px-4 py-2.5 flex items-center border-b border-black/5 dark:border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all"></div>
            </div>
            <div className="flex-1 text-center font-mono text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <TerminalIcon size={12} /> vl.dev — bash
            </div>
            <div className="w-[52px]"></div>
          </div>
          
          {/* Terminal Body */}
          <div 
            ref={containerRef}
            className="p-4 md:p-6 h-[300px] md:h-[360px] overflow-y-auto font-mono text-xs md:text-sm bg-zinc-50/50 dark:bg-zinc-950/60 cursor-text custom-scrollbar"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div 
                key={i} 
                className={`mb-1.5 whitespace-pre-wrap break-words leading-relaxed ${
                  line.type === 'error' 
                    ? 'text-red-500' 
                    : line.type === 'user' 
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : line.type === 'success'
                        ? 'text-sky-500 dark:text-sky-400'
                        : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {line.type === 'user' && (
                  <ChevronRight size={14} className="inline-block mr-1 -mt-0.5 text-emerald-500" />
                )}
                {line.content}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 text-[16px] md:text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ChevronRight size={14} />
                <span className="hidden sm:inline">vl@guest</span><span className="sm:hidden">$</span><span className="hidden sm:inline">:~$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  uiAudio.playTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') uiAudio.playClick();
                  handleCommand(e);
                }}
                className="flex-1 bg-transparent outline-none border-none text-zinc-800 dark:text-zinc-100 caret-emerald-500 text-[16px] md:text-sm"
                spellCheck="false"
                autoComplete="off"
                placeholder="type a command..."
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
