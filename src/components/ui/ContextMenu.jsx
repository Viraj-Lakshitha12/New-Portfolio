import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Mail, Download, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { uiAudio } from '@/lib/audio';

export default function ContextMenu() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setOpen(true);
      
      // Calculate position to ensure it doesn't go off-screen
      const menuWidth = 220;
      const menuHeight = 250;
      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
      if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

      setPosition({ x, y });
    };

    const handleClick = () => setOpen(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const menuItems = [
    {
      icon: <Copy size={16} />,
      label: 'Copy Portfolio Link',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    },
    {
      icon: <Download size={16} />,
      label: 'Download Resume',
      action: () => {
        const a = document.createElement('a');
        a.href = '/Viraj_Lakshitha_CV.pdf';
        a.download = 'Viraj_Lakshitha_CV.pdf';
        a.click();
      }
    },
    {
      icon: <Mail size={16} />,
      label: 'Contact Me',
      action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    },
    { divider: true },
    {
      icon: <Terminal size={16} />,
      label: 'Open Terminal',
      action: () => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <Github size={16} />,
      label: 'GitHub Profile',
      action: () => window.open('https://github.com/Viraj-Lakshitha12', '_blank')
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed z-[99999] glass w-56 rounded-xl border border-black/10 dark:border-white/10 shadow-2xl py-2 flex flex-col"
          style={{ top: position.y, left: position.x }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {menuItems.map((item, idx) => 
            item.divider ? (
              <div key={idx} className="w-full h-px bg-black/5 dark:bg-white/5 my-1" />
            ) : (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  uiAudio?.playClick?.();
                  item.action();
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
