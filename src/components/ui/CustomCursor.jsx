import React, { useEffect, useRef } from 'react';
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768;
    if (isTouch || isMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = 'none';

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animateRing = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      rafId = requestAnimationFrame(animateRing);
    };
    rafId = requestAnimationFrame(animateRing);
    const onMouseOver = (e) => {
      const target = e.target;
      const textEl = target.closest('[data-cursor-text]');

      if (textEl) {
        const text = textEl.getAttribute('data-cursor-text');
        dot.dataset.text = text;
        dot.classList.add('cursor-expanded');
        ring.classList.add('cursor-hidden');
        return;
      }

      dot.dataset.text = '';
      dot.classList.remove('cursor-expanded');
      ring.classList.remove('cursor-hidden');

      const isClickable =
        target.tagName?.toLowerCase() === 'button' ||
        target.tagName?.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList?.contains('cursor-pointer');

      if (isClickable) {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      } else {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 999999,
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--background)',
        }}
      />
      {/* Ring — lerps smoothly behind cursor */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 999998,
          willChange: 'transform',
          opacity: 0.5,
          transition: 'opacity 0.2s, transform 0.05s linear, width 0.2s, height 0.2s',
        }}
      />

      {/* CSS for cursor states — avoids inline style recalculation */}
      <style>{`
        .cursor-dot.cursor-hover { width: 18px !important; height: 18px !important; }
        .cursor-dot.cursor-expanded { width: 64px !important; height: 64px !important; }
        .cursor-dot.cursor-expanded::after { content: attr(data-text); font-size: 10px; }
        .cursor-ring.cursor-hover { opacity: 0.9 !important; transform-origin: center; }
        .cursor-ring.cursor-hidden { opacity: 0 !important; }
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
