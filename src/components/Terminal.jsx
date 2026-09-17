import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to VL.dev terminal. Type "help" to see available commands.' }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const commands = {
    help: '📋 Available commands:\n   whoami    → About me\n   skills    → My tech stack\n   experience → Work history\n   education → Academic background\n   contact   → How to reach me\n   projects  → Featured projects\n   echo [text] → Repeat your text\n   clear     → Clear terminal',
    whoami: '👋 Viraj Lakshitha\n   Full Stack Software Engineer @ INTELLEON\n   Sri Lanka 🇱🇰\n   2+ years building production web systems.',
    skills: '⚡ Core Stack:\n   → Java / Spring Boot\n   → React / TypeScript\n   → Node.js / Express\n   → PostgreSQL / Docker\n   → RESTful APIs / Microservices',
    experience: '💼 Software Engineer @ INTELLEON (2024 - Present)\n   Building production web systems, optimizing\n   database queries, and designing microservices.',
    education: '🎓 BSc (Hons) in Information Technology\n   Sri Lanka Institute of Information Technology',
    contact: '📬 Get in touch:\n   → Email: virajalakshitha.lakshitha.77@gmail.com\n   → LinkedIn: linkedin.com/in/viraj-lakshitha\n   → GitHub: github.com/Viraj-Lakshitha12',
    projects: '🚀 Featured Projects:\n   → New-Portfolio (This site!)\n   → Query-Analyzer\n   → Visit #projects section for more!',
    clear: 'CLEAR_COMMAND',
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const parts = cmd.split(' ');
      const baseCmd = parts[0];

      if (!cmd) return;

      const newHistory = [...history, { type: 'user', content: `$ ${input}` }];

      if (baseCmd === 'clear') {
        setHistory([]);
      } else if (baseCmd === 'echo') {
        newHistory.push({ type: 'system', content: parts.slice(1).join(' ') || '(empty)' });
        setHistory(newHistory);
      } else if (commands[baseCmd]) {
        newHistory.push({ type: 'system', content: commands[baseCmd] });
        setHistory(newHistory);
      } else {
        newHistory.push({ type: 'error', content: `Command not found: ${baseCmd}. Type "help" for commands.` });
        setHistory(newHistory);
      }

      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <section className="relative py-16 md:py-24 px-6">
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
                      : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {line.type === 'user' && (
                  <ChevronRight size={14} className="inline-block mr-1 -mt-0.5 text-emerald-500" />
                )}
                {line.content}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ChevronRight size={14} />
                <span className="hidden sm:inline">vl@guest</span><span className="sm:hidden">$</span><span className="hidden sm:inline">:~$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none border-none text-zinc-800 dark:text-zinc-100 caret-emerald-500"
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
