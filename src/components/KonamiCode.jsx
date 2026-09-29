import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uiAudio } from '../lib/audio';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
    const alphabet = letters.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Hacker green
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none opacity-80 mix-blend-screen"
    />
  );
};

const KonamiCode = () => {
  const [inputSequence, setInputSequence] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key;

      setInputSequence((prev) => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

        // Check if sequence matches exactly
        const isMatch = newSequence.length === KONAMI_CODE.length && newSequence.every((val, index) => {
          return val.toLowerCase() === KONAMI_CODE[index].toLowerCase();
        });

        if (isMatch && !isUnlocked) {
          setIsUnlocked(true);
          // Play sound
          uiAudio.playHover();
          // Auto close after 8 seconds
          setTimeout(() => {
            setIsUnlocked(false);
          }, 8000);
          return []; // Reset sequence
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked]);

  return (
    <AnimatePresence>
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden bg-black/90"
        >
          <MatrixRain />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[10000]"
          >
            <h1 className="text-6xl md:text-8xl font-black text-green-500 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,0,0.8)]">
              ACCESS GRANTED
            </h1>
            <p className="mt-4 text-green-400 font-mono text-xl md:text-2xl animate-pulse">
              Welcome to the Matrix, Developer.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KonamiCode;
