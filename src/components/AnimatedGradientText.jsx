import React from 'react';
import { useTheme } from '@/lib/theme-context';

/**
 * Animated Gradient Text Component
 * Creates a smooth animated gradient text effect
 */
export default function AnimatedGradientText({
  children,
  className = '',
  colors = ['#64d2ff', '#a855f7', '#ec4899'],
  lightColors = ['#0369a1', '#7c3aed', '#db2777'],
  speed = 3
}) {
  const { theme } = useTheme();
  const activeColors = theme === 'dark' ? colors : lightColors;

  return (
    <span
      className={`gradient-text-anim ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${activeColors.join(', ')})`,
        backgroundSize: '200% auto',
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
}