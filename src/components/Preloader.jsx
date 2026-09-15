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
      <div className="preloader-core" aria-hidden="true">
        <div className="preloader-ring preloader-ring-outer" />
        <div className="preloader-ring preloader-ring-inner" />
        <div className="preloader-orbit preloader-orbit-one"><span /></div>
        <div className="preloader-orbit preloader-orbit-two"><span /></div>
        <div className="preloader-node preloader-node-one" />
        <div className="preloader-node preloader-node-two" />
        <div className="preloader-node preloader-node-three" />
        <div className="preloader-center">
          <span className="font-mono text-3xl font-extrabold gradient-text">&lt;/&gt;</span>
        </div>
      </div>
      <div className="preloader-status mt-8">
        <span className="preloader-status-dot" />
        <span className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">Initializing System</span>
        <span className="preloader-progress"><span /></span>
      </div>
    </div>
  );
}