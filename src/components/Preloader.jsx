import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1600);
    const t2 = setTimeout(() => setVisible(false), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div
          className="absolute -inset-6 rounded-[2rem] blur-2xl glow-pulse"
          style={{ background: 'var(--glow)' }}
        />
        <div className="glass relative w-28 h-28 rounded-[1.75rem] flex items-center justify-center float-anim">
          <span className="font-mono text-4xl font-extrabold gradient-text">&lt;/&gt;</span>
        </div>
      </div>
      <p className="mt-8 font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
        Initializing System
      </p>
    </div>
  );
}