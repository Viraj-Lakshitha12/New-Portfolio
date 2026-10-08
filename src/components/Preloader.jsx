import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const bgCode = `
import { Architect, Developer } from '@viraj/core';
import { Microservices } from '@infrastructure/backend';
import { ResponsiveUI } from '@frontend/react';

const App = async () => {
  const server = new Microservices({
    db: 'PostgreSQL',
    cache: 'Redis',
    broker: 'Kafka'
  });
  
  await server.initialize();
};

App.boot();
`.repeat(8);

const buildFiles = [
  "src/main.jsx", "src/App.jsx", "src/index.css",
  "src/components/Navbar.jsx", "src/components/Hero.jsx",
  "src/lib/theme-context.jsx", "src/components/Experience.jsx",
  "src/components/Projects.jsx", "src/components/Contact.jsx",
  "node_modules/framer-motion/dist/es/index.mjs",
  "src/lib/utils.ts", "src/hooks/use-theme.ts",
  "src/components/ui/CustomCursor.jsx", "src/components/Preloader.jsx"
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [whoami, setWhoami] = useState("");

  // Typing effect for "whoami"
  useEffect(() => {
    const text = "VIRAJ LAKSHITHA";
    let i = 0;
    const typing = setInterval(() => {
      if (i <= text.length) {
        setWhoami(text.slice(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  // Rapid build logs
  useEffect(() => {
    let index = 0;
    const logInterval = setInterval(() => {
      setLogs(prev => {
        const file = buildFiles[index % buildFiles.length];
        const newLogs = [...prev, `✓ [built] ${file}`];
        return newLogs.slice(-5);
      });
      index++;
    }, 150);
    return () => clearInterval(logInterval);
  }, []);

  // Progress counter
  useEffect(() => {
    const duration = 2800;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuart = 1 - Math.pow(1 - currentStep / steps, 4);
      const newProgress = Math.min(Math.round(easeOutQuart * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          window.dispatchEvent(new Event('preloader-finished'));
        }, 500);
      }
    }, interval);

    document.body.style.overflow = 'hidden';
    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#050505] text-white pointer-events-none overflow-hidden flex flex-col justify-between p-6 md:p-12"
        >
          {/* Background Code */}
          <div className="absolute inset-0 opacity-[0.03] overflow-hidden whitespace-pre font-mono text-xs md:text-sm leading-relaxed text-[var(--accent)] pointer-events-none">
            <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
              {bgCode}
            </motion.div>
          </div>

          {/* Top Section */}
          <div className="relative z-10 flex justify-between items-start font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-500">
            <div className="flex items-center gap-2 md:gap-3">
              <Terminal size={14} className="text-[var(--accent)]" />
              <span>Compiler Engine v2.0</span>
            </div>
            <div className="flex gap-4">
              <span className="hidden md:inline">PORTFOLIO_SYS</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Center Main Content */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center flex-grow py-10 md:py-20 max-w-7xl mx-auto w-full gap-10">



            {/* Left: Terminal output */}
            <div className="w-full max-w-sm md:max-w-none md:w-1/2 flex flex-col justify-center mx-auto md:mx-0">
              <div className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 md:mb-12 text-zinc-800 text-left">
                SYSTEM_BOOT<span className="text-[var(--accent)]">_</span>
              </div>

              {/* Live Build Logs */}
              <div className="h-32 md:h-40 flex flex-col justify-end overflow-hidden mb-8 border-l-2 border-white/10 pl-4 md:pl-6">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div
                      key={log + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-zinc-400 py-1 font-mono text-[10px] md:text-sm break-all"
                    >
                      <span className="text-[var(--accent)] mr-2 md:mr-3">✓</span>
                      {log.replace('✓ ', '')}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Whoami command */}
              <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-4 text-zinc-300">
                <span className="text-[var(--accent)] font-bold text-base md:text-lg">&gt;</span>
                <span className="font-mono text-base md:text-lg">whoami</span>
              </div>
              <div className="flex items-center gap-2 text-white font-bold text-2xl md:text-4xl mt-2 md:mt-3 tracking-widest">
                {whoami}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-6 md:w-4 md:h-8 bg-[var(--accent)] inline-block ml-2"
                />
              </div>
            </div>

            {/* Right: Massive Tech Graphic (Hidden on very small mobile, visible on tablet/desktop) */}
            <div className="hidden sm:flex w-full md:w-1/2 justify-center items-center opacity-30 md:opacity-100">
              <div className="relative flex items-center justify-center w-56 h-56 md:w-72 md:h-72">
                {/* Orbit 1 */}
                <motion.div
                  className="absolute inset-0 border border-cyan-500/30 rounded-full"
                  style={{ transform: 'rotateX(65deg) rotateY(25deg)' }}
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                >
                  <div className="absolute top-0 left-1/2 w-2 h-2 md:w-2.5 md:h-2.5 -ml-1 -mt-1 md:-ml-1.5 md:-mt-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
                </motion.div>

                {/* Orbit 2 */}
                <motion.div
                  className="absolute inset-0 border border-blue-500/30 rounded-full"
                  style={{ transform: 'rotateX(65deg) rotateY(-45deg)' }}
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                >
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 md:w-2 md:h-2 -ml-1 -mb-1 md:-ml-[4px] md:-mb-[4px] bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]" />
                </motion.div>

                {/* Orbit 3 */}
                <motion.div
                  className="absolute inset-0 border border-indigo-500/30 rounded-full"
                  style={{ transform: 'rotateX(65deg) rotateY(85deg)' }}
                  animate={{ rotateZ: -360 }}
                  transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                >
                  <div className="absolute top-1/2 right-0 w-2 h-2 md:w-2.5 md:h-2.5 -mt-1 -mr-1 md:-mt-1.5 md:-mr-1.5 bg-indigo-400 rounded-full shadow-[0_0_15px_#818cf8]" />
                </motion.div>

                {/* Center Glass Box */}
                <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                  <span className="font-mono text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
                    &lt;/&gt;
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Progress Bar */}
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-2 md:mb-4 font-mono">
              <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-[10px] md:text-sm">
                {progress < 100 ? 'Compiling Assets...' : 'Build Successful'}
              </span>
              <span className="text-white text-3xl md:text-5xl font-black tabular-nums tracking-tighter">
                {progress}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--accent)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}