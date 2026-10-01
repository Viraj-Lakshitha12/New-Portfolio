import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X } from 'lucide-react';

export default function SpotifyWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed bottom-[90px] right-6 z-[100] transition-all duration-300 ${
      scrolledPast ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
    }`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full glass bg-white/80 dark:bg-zinc-950/80 border border-emerald-500/30 shadow-lg backdrop-blur-xl group"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500">
              <Music size={14} className="animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col items-start overflow-hidden w-[90px]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-500 font-bold">Listen</span>
              <span className="text-xs font-semibold text-foreground truncate w-full group-hover:text-emerald-500 transition-colors">
                My Playlist
              </span>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="w-[300px] rounded-2xl glass bg-white/90 dark:bg-zinc-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden relative"
          >
            <div className="p-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2 text-emerald-500">
                <Music size={14} className="animate-bounce" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Spotify Vibes</span>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="p-2 h-[168px]">
              {/* Real Spotify Embed - Track: The Weeknd - Blinding Lights */}
              <iframe 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
