import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';

const terminalLines = [
  '> Initializing system...',
  '> Loading core modules: Java, Node.js, React...',
  '> Establishing database connections: PostgreSQL, MongoDB...',
  '> Bootstrapping microservices...',
  '> Mounting API routes...',
  '> SUCCESS: System operational. Ready to build.'
];

function AnimatedTerminal() {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 w-full max-w-lg mx-auto">
      {/* Terminal Header */}
      <div className="bg-black/10 dark:bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-black/10 dark:border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <TerminalIcon size={14} />
          <span>viraj@portfolio:~</span>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-5 font-mono text-sm md:text-base min-h-[250px] bg-black/5 dark:bg-transparent">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 ${i === terminalLines.length - 1 ? 'text-green-500' : 'text-foreground/80'}`}
          >
            {line}
          </motion.div>
        ))}
        {lines.length < terminalLines.length && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2.5 h-5 bg-foreground/70 inline-block align-middle"
          />
        )}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-28 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-6">
            Engineering robust solutions from backend to frontend.
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I am a Full Stack Software Engineer with over two years of professional experience designing and building scalable web applications. 
              My core expertise lies in Java Spring, Node.js, React, and PostgreSQL.
            </p>
            <p>
              I have a strong focus on backend architecture and database query optimization, combined with the ability to deliver seamless frontend experiences. 
              I thrive in dynamic environments, collaborating in agile teams to solve complex technical challenges and build reliable, efficient software.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatedTerminal />
        </motion.div>

      </div>
    </section>
  );
}
