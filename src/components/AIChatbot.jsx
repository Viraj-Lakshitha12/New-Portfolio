import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { uiAudio } from '@/lib/audio';
import Fuse from 'fuse.js';

const KNOWLEDGE_BASE = [
  {
    intent: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'who are you', 'what is this', 'greetings'],
    response: "Hi there! I'm Viraj's AI Assistant. I can answer questions about his skills, experience, projects, education, and personal details. What would you like to know?"
  },
  {
    intent: 'skills',
    keywords: ['skills', 'tech', 'stack', 'technologies', 'react', 'java', 'node', 'express', 'frontend', 'backend', 'database'],
    response: "Viraj is a Full Stack Engineer. His core expertise lies in Java Spring Boot, Node.js (Express), and React. He is also highly skilled in TypeScript, PostgreSQL, MongoDB, Redis, Tailwind CSS, Docker, and Microservices.",
    prompt: "Would you like me to scroll down to his Skills section to see the full list?",
    action: 'stack'
  },
  {
    intent: 'experience',
    keywords: ['experience', 'work', 'job', 'intelleon', 'company', 'history', 'intern'],
    response: "Viraj is currently a Software Engineer at INTELLEON, where he previously worked as an Associate SE and Intern. He builds scalable web applications and manages robust backend architectures.",
    prompt: "Would you like me to scroll to his Experience section for more details?",
    action: 'experience'
  },
  {
    intent: 'education',
    keywords: ['education', 'degree', 'sliit', 'university', 'study', 'studied', 'ijse', 'wrexham', 'londontec'],
    response: "Viraj holds a BSc (Hons) in Computing from Wrexham University (UK) and a Graduate Diploma in Software Engineering from IJSE.",
    prompt: "Shall I navigate to the Education section so you can see more?",
    action: 'education'
  },
  {
    intent: 'projects',
    keywords: ['projects', 'portfolio', 'query', 'built', 'made'],
    response: "Viraj has built several impressive full-stack projects, including a comprehensive Service Management Platform, a Property Booking System, and this Next-Gen Portfolio.",
    prompt: "Would you like to head over to the Projects section to see them?",
    action: 'projects'
  },
  {
    intent: 'contact',
    keywords: ['contact', 'hire', 'email', 'reach', 'number', 'phone'],
    response: "You can reach Viraj via email at viraj.lakshitha.22222@gmail.com, or connect with him on LinkedIn.",
    prompt: "Do you want me to scroll to the Contact form?",
    action: 'contact'
  },
  {
    intent: 'personal_age',
    keywords: ['age', 'old', 'born', 'birthday'],
    response: "Viraj was born in 2001, making him in his early twenties. He's young, energetic, and highly passionate about modern software engineering!"
  },
  {
    intent: 'personal_location',
    keywords: ['where', 'live', 'location', 'country', 'city', 'from', 'sri', 'lanka'],
    response: "Viraj is based in Sri Lanka. He is open to remote work and collaborating with teams worldwide."
  },
  {
    intent: 'thanks',
    keywords: ['thanks', 'thank you', 'bye', 'goodbye', 'ok', 'okay', 'cool'],
    response: "You're welcome! Feel free to ask if you have any more questions. Enjoy exploring the portfolio!"
  }
];

const FALLBACK_RESPONSES = [
  "I'm not quite sure about that! Try asking about his 'skills', 'experience', 'age', or 'education'.",
  "Hmm, my knowledge base doesn't have the exact answer for that. You can ask me about his tech stack or projects instead!",
  "I'm still learning! Could you rephrase that? Or you can try asking 'What are your skills?'",
  "Interesting question! While I don't know the answer, I can definitely tell you about his work experience or education."
];

// Common words to ignore so the bot focuses on the actual intent
const STOP_WORDS = new Set([
  'what', 'about', 'his', 'her', 'he', 'she', 'is', 'a', 'an', 'the', 'i', 
  'ask', 'tell', 'me', 'can', 'you', 'do', 'does', 'did', 'will', 'would', 'could', 
  'should', 'to', 'for', 'of', 'in', 'on', 'at', 'by', 'with', 'and', 'or', 'but', 'so', 
  'because', 'this', 'that', 'these', 'those', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'know', 'want', 'like', 'just', 'pleas', 'please', 'give'
]);

const fuse = new Fuse(KNOWLEDGE_BASE, {
  keys: ['keywords'],
  threshold: 0.3, 
  ignoreLocation: true,
  includeScore: true,
  distance: 100
});

// Typewriter effect component for bot messages
const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15); // typing speed
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm Viraj's AI Assistant. Ask me anything about his tech stack, experience, or projects." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  // Tooltip state
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoShowing, setIsAutoShowing] = useState(false);
  // Track scroll position to swap with scroll-to-top on mobile
  const [scrolledPast, setScrolledPast] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Auto show tooltip after 2 seconds for 5 seconds to grab attention
    const showTimer = setTimeout(() => {
      setIsAutoShowing(true);
      
      const hideTimer = setTimeout(() => {
        setIsAutoShowing(false);
      }, 5000); // Keep it visible for 5s
      
      return () => clearTimeout(hideTimer);
    }, 2000); // 2s after initial load

    return () => clearTimeout(showTimer);
  }, []);

  const generateResponse = (text) => {
    // 1. Tokenize and clean the input
    const words = text.toLowerCase().split(/[^a-z0-9]+/);
    
    // 2. Remove stop words to extract the core intent/keywords
    const importantWords = words.filter(word => word.length > 2 && !STOP_WORDS.has(word));
    
    // 3. Search the knowledge base using the important words
    let bestResultItem = null;
    let highestScore = 1; // 0 is a perfect match in fuse

    const getFallback = () => ({ text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] });

    // If no important words found, fallback immediately
    if (importantWords.length === 0) {
       return getFallback();
    }

    // Try matching the combined phrase first (e.g., "frontend skills")
    const phraseResults = fuse.search(importantWords.join(' '));
    if (phraseResults.length > 0 && phraseResults[0].score < 0.4) {
      return { text: phraseResults[0].item.response, prompt: phraseResults[0].item.prompt, action: phraseResults[0].item.action };
    }

    // Fallback to word-by-word intent extraction
    for (const word of importantWords) {
      const results = fuse.search(word);
      if (results.length > 0) {
        if (results[0].score < highestScore) {
          highestScore = results[0].score;
          bestResultItem = results[0].item;
        }
      }
    }

    if (bestResultItem) {
      return { text: bestResultItem.response, prompt: bestResultItem.prompt, action: bestResultItem.action };
    }
    
    return getFallback();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    uiAudio.playClick();
    const userText = input.trim().toLowerCase();
    setMessages(prev => [...prev, { type: 'user', text: input.trim() }]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay for realism
    setTimeout(() => {
      // Check if we are waiting for a yes/no permission to navigate
      if (pendingAction) {
        const yesWords = ['yes', 'yeah', 'yup', 'sure', 'ok', 'okay', 'scroll', 'take me', 'please', 'ow', 'yep'];
        const noWords = ['no', 'nope', 'nah', 'stop', 'epaa', 'naa'];
        
        const isYes = yesWords.some(w => userText.includes(w));
        const isNo = noWords.some(w => userText.includes(w));

        if (isYes) {
          setMessages(prev => [...prev, { type: 'bot', text: "Scrolling there now!" }]);
          setTimeout(() => {
            const element = document.getElementById(pendingAction);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          setPendingAction(null);
          uiAudio.playHover();
          return;
        } else if (isNo || userText.length <= 4) {
          setMessages(prev => [...prev, { type: 'bot', text: "Alright! What else would you like to know?" }]);
          setPendingAction(null);
          uiAudio.playHover();
          return;
        }
        // If it's a completely new sentence and not a simple yes/no, we just clear pending action and process it normally
        setPendingAction(null);
      }

      const responseData = generateResponse(userText);
      setMessages(prev => [...prev, { type: 'bot', text: responseData.text, prompt: responseData.prompt }]);
      uiAudio.playHover(); // Soft pop for message receive
      
      // If there is an action, save it to pendingAction so we can ask for permission next turn
      if (responseData.action) {
        setPendingAction(responseData.action);
      }
    }, 500 + Math.random() * 500);
  };

  const shouldShowTooltip = (isHovered || isAutoShowing) && !isOpen;

  return (
    <>
      {/* Chatbot FAB — on mobile, fades out when scrolled past hero (scroll-to-top takes over) */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] flex items-center justify-end gap-3 transition-all duration-300 ${
          scrolledPast && !isOpen
            ? 'opacity-0 pointer-events-none translate-y-4 md:opacity-100 md:pointer-events-auto md:translate-y-0'
            : 'opacity-100 pointer-events-auto translate-y-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip — hidden on mobile (touch has no hover) */}
        <AnimatePresence>
          {shouldShowTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-none hidden md:block"
            >
              <div className="whitespace-nowrap px-4 py-2.5 rounded-2xl glass bg-white/90 dark:bg-zinc-950/90 border border-[var(--accent)]/30 shadow-xl text-sm font-medium text-foreground flex items-center gap-3 backdrop-blur-xl relative">
                <span>Ask me anything!</span>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </div>
                {/* Small triangle pointer */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-y-8 border-y-transparent border-l-8 border-l-[var(--accent)]/20"></div>
                <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 border-y-[7px] border-y-transparent border-l-[7px] border-l-white dark:border-l-zinc-950"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setIsHovered(false);
            setIsAutoShowing(false);
          }}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-[var(--accent)] shadow-lg hover:shadow-[0_0_15px_var(--glow)] transition-shadow backdrop-blur-xl border border-[var(--accent)]/20 relative"
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {isOpen ? <X size={22} /> : <Bot size={22} />}
          {!isOpen && (
             <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
          )}
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
                {messages.map((msg, idx) => {
                  const isLastBotMsg = idx === messages.length - 1 && msg.type === 'bot' && isTyping;
                  return (
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
                        {isLastBotMsg ? (
                          <TypewriterText text={msg.text} onComplete={() => setIsTyping(false)} />
                        ) : (
                          msg.text
                        )}
                        {msg.prompt && !isLastBotMsg && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.4 }}
                            className="mt-3 pt-3 border-t border-[var(--accent)]/10 font-semibold text-[var(--accent)]"
                          >
                            {msg.prompt}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {isTyping && messages[messages.length - 1].type === 'user' && (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-[var(--accent)]/20 text-[var(--accent)]">
                      <Bot size={12} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-tl-sm flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    </div>
                  </div>
                )}
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
