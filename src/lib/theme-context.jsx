import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const isAnimating = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = (e) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Fallback if View Transitions not supported or already animating
    if (!e || !document.startViewTransition || isAnimating.current) {
      setTheme(newTheme);
      return;
    }

    isAnimating.current = true;

    const x = e.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      const root = document.documentElement;
      if (newTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
      animation.finished.finally(() => {
        isAnimating.current = false;
      });
    }).catch(() => {
      isAnimating.current = false;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);