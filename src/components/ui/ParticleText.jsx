import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function ParticleText({ text, className = "" }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let particlesArray = [];
    let animationFrameId;
    
    // Scale for retina displays
    const dpr = window.devicePixelRatio || 1;
    
    // Adjust canvas size based on window width
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth * dpr;
      // Height should be enough for the text
      canvas.height = (window.innerWidth < 768 ? 80 : 120) * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${canvas.height / dpr}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    let mouse = {
      x: null,
      y: null,
      radius: 80
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', () => {
      setCanvasSize();
      init();
    });

    // Base color for particles depending on theme
    const baseColor = theme === 'dark' ? '255, 255, 255' : '10, 10, 10';
    // Accent color (approximate the gradient)
    const accentColor = theme === 'dark' ? '#64d2ff' : '#0369a1';

    class Particle {
      constructor(x, y, color) {
        this.x = x + (Math.random() * 100 - 50); // Start scattered
        this.y = y + (Math.random() * 100 - 50);
        this.destX = x;
        this.destY = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = color;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.friction = 0.85;
        this.vx = 0;
        this.vy = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.x != null && distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          
          this.vx -= directionX;
          this.vy -= directionY;
        } else {
          // Return to base
          let dx = this.baseX - this.x;
          let dy = this.baseY - this.y;
          this.vx += dx * 0.05; // Spring strength
          this.vy += dy * 0.05;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    function init() {
      particlesArray = [];
      
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw text
      const fontSize = window.innerWidth < 768 ? 40 : 70;
      ctx.font = `900 ${fontSize}px "Inter", "Segoe UI", sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
      
      const textCoordinates = ctx.getImageData(0, 0, width * dpr, height * dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas after reading
      
      // Sampling density
      const step = window.innerWidth < 768 ? 4 : 5;
      
      for (let y = 0, y2 = textCoordinates.height; y < y2; y += step) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x += step) {
          // If pixel is not transparent
          if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
            let positionX = x / dpr;
            let positionY = y / dpr;
            
            // Randomly assign some particles the accent color for a nice mix
            const pColor = Math.random() > 0.85 ? accentColor : `rgba(${baseColor}, ${Math.random() * 0.5 + 0.5})`;
            
            particlesArray.push(new Particle(positionX, positionY, pColor));
          }
        }
      }
      setIsLoaded(true);
    }

    init();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, theme]);

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`} style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease' }}>
      <canvas ref={canvasRef} className="block w-full max-w-full touch-none" />
    </div>
  );
}
