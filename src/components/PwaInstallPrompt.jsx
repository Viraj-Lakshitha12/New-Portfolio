import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { uiAudio } from '@/lib/audio';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Wait a bit before showing to not overwhelm the user
      setTimeout(() => {
        setShowPrompt(true);
        uiAudio.playHover();
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    uiAudio.playClick();
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      uiAudio.playSuccess();
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-6 z-[90] max-w-[320px] p-4 glass bg-white/90 dark:bg-zinc-950/90 rounded-2xl shadow-2xl border border-[var(--accent)]/30 backdrop-blur-2xl"
        >
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <X size={14} />
          </button>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-emerald-400 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1 text-foreground">Install VL.dev App</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Add my portfolio to your home screen for quick access and offline viewing!
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-bold hover:shadow-[0_0_15px_var(--glow)] transition-all"
              >
                Install Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
