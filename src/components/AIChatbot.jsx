import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { uiAudio } from '@/lib/audio';
import Fuse from 'fuse.js';

const KNOWLEDGE_BASE = [
  {
    keywords: ['hi', 'hello', 'hey', 'who'],
    response: "Hi there! I'm Viraj's AI clone. I can answer questions about his skills, experience, projects, or education. What would you like to know?"
  },
  {
    keywords: ['skills', 'react', 'frontend', 'tailwind', 'ui'],
    response: "Viraj is highly proficient in Frontend engineering. He builds immersive, responsive UIs using React, Tailwind CSS, and Framer Motion (just like this portfolio!)."
  },
  {
    keywords: ['backend', 'java', 'spring', 'node', 'express', 'api'],
    response: "On the backend, Viraj specializes in Java with Spring Boot and Node.js with Express. He builds scalable microservices and RESTful APIs."
  },
  {
    keywords: ['database', 'sql', 'postgresql', 'mongo'],
    response: "Viraj is experienced with relational databases like PostgreSQL and MySQL, as well as NoSQL databases like MongoDB. He focuses on efficient schema design and query optimization."
  },
  {
    keywords: ['experience', 'work', 'job', 'intelleon'],
    response: "Viraj is currently working as a Full Stack Software Engineer at INTELLEON (since 2024). He handles both frontend and backend development for production systems."
  },
  {
    keywords: ['education', 'degree', 'sliit', 'university'],
    response: "Viraj holds a BSc (Hons) in Information Technology from the Sri Lanka Institute of Information Technology (SLIIT)."
  },
  {
    keywords: ['projects', 'portfolio', 'query'],
    response: "Some of Viraj's featured projects include this Next-Gen Portfolio (built with React + Tailwind + Framer Motion) and a Query-Analyzer tool. You can check the Projects section for more details!"
  },
  {
    keywords: ['contact', 'hire', 'email', 'reach'],
    response: "You can reach Viraj via email at virajalakshitha.lakshitha.77@gmail.com, or connect with him on LinkedIn. There's also a contact form at the bottom of the page!"
  },
  {
    keywords: ['thanks', 'thank you', 'bye'],
    response: "You're welcome! Feel free to ask if you have any more questions. Enjoy exploring the portfolio!"
  }
];

const fuse = new Fuse(KNOWLEDGE_BASE, {
  keys: ['keywords'],
  threshold: 0.4, // Allows for fuzzy matching (typos)
  ignoreLocation: true,
  includeScore: true
});

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm Viraj's AI Assistant. Ask me anything about his tech stack, experience, or projects." }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (text) => {
    // Split the user text into words and search each word to find the best match
    const words = text.toLowerCase().split(/\s+/);
    let bestResult = null;
    let highestScore = 1; // Lower score is better in Fuse (0 is exact match)

    for (const word of words) {
      if (word.length < 2) continue; // Skip single letter words
      const results = fuse.search(word);
      if (results.length > 0) {
        // Find the best match across all words
        if (results[0].score < highestScore) {
          highestScore = results[0].score;
          bestResult = results[0].item.response;
        }
      }
    }

    if (bestResult) {
      return bestResult;
    }
    
    return "I'm still learning! While I might not know the exact answer to that, you can try asking about Viraj's 'skills', 'experience', 'projects', or 'education'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    uiAudio.playClick();
    const userText = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setInput('');

    // Simulate network delay for realism
    setTimeout(() => {
      const response = generateResponse(userText);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      uiAudio.playHover(); // Soft pop for message receive
    }, 600 + Math.random() * 800);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-[var(--accent)] shadow-lg hover:shadow-[0_0_15px_var(--glow)] transition-shadow backdrop-blur-xl border border-[var(--accent)]/20"
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {isOpen ? <X size={22} /> : <Bot size={22} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-[102] w-[320px] sm:w-[360px] h-[480px] max-h-[70vh] flex flex-col glass rounded-2xl shadow-2xl border border-[var(--accent)]/20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bot size={20} className="text-[var(--accent)]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none">Viraj.AI</h3>
                    <span className="text-[10px] text-muted-foreground">Always online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-[var(--accent)]/20 text-[var(--accent)]'}`}>
                      {msg.type === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user' 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-tr-sm' 
                        : 'bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-foreground rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      uiAudio.playTyping();
                    }}
                    placeholder="Ask about Viraj..."
                    className="w-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-full pl-4 pr-10 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <Send size={12} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
