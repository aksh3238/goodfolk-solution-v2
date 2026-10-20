import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: 'dot' | 'rect';
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const HomepageCursorAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const lastSpawnTimeRef = useRef(0);

  useEffect(() => {
    // 1. Check if device supports fine hover cursor (disable on mobile touch-only)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // 2. Respect user accessibility reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Palette: Approved Good Folk palette with soft, minimal opacities
    const palette = [
      'rgba(23, 59, 117, 0.28)',   // Navy #173B75
      'rgba(36, 88, 166, 0.25)',   // Bright Blue #2458A6
      'rgba(240, 120, 34, 0.32)',  // Warm Orange #F07822
      'rgba(23, 59, 117, 0.18)'    // Soft Navy
    ];

    // Helper: Determine if target element is interactive or content-bearing
    const isOverInteractiveOrContent = (elem: Element | null): boolean => {
      if (!elem) return true;

      // Check interactive tags and roles
      const interactiveSelector = 'button, a, input, textarea, select, label, form, [role="button"], [role="link"], [role="tab"], [role="menuitem"], .cursor-pointer';
      if (elem.closest(interactiveSelector)) return true;

      // Check computed cursor
      try {
        const style = window.getComputedStyle(elem);
        if (style.cursor === 'pointer' || style.cursor === 'text') return true;
      } catch {
        // Fallback
      }

      // Check content nodes (headings, paragraphs, images, videos, icons)
      const contentSelector = 'h1, h2, h3, h4, h5, h6, p, img, video, svg, span, strong, em, code, pre, blockquote, figure';
      if (elem.matches(contentSelector)) return true;

      // If it's a small container or card with text
      const rect = elem.getBoundingClientRect();
      // If element is small and contains text
      if (rect.width < 500 && elem.textContent && elem.textContent.trim().length > 0 && elem.children.length === 0) {
        return true;
      }

      return false;
    };

    // Main animation loop
    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.alpha * (p.life / p.maxLife);
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/, `${currentAlpha.toFixed(3)})`);

        if (p.shape === 'dot') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Minimal rectangle / micro-square
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      }

      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
      }
    };

    const startAnimation = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle particle emission to every 45ms for buttery, lightweight motion
      if (now - lastSpawnTimeRef.current < 45) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (isOverInteractiveOrContent(target)) {
        return; // Suppress over interactive or content elements
      }

      lastSpawnTimeRef.current = now;

      // Spawn 1 or 2 minimal geometric particles close to the cursor
      const count = Math.random() < 0.6 ? 1 : 2;
      for (let k = 0; k < count; k++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 8 + 4;
        const speed = Math.random() * 0.45 + 0.2;
        const maxLife = Math.floor(Math.random() * 15 + 35); // 35-50 frames (~600-800ms)
        const isDot = Math.random() > 0.4;

        particlesRef.current.push({
          x: e.clientX + Math.cos(angle) * dist,
          y: e.clientY + Math.sin(angle) * dist,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isDot ? Math.random() * 1.2 + 1.2 : Math.random() * 1.5 + 2.0, // 2-3px
          shape: isDot ? 'dot' : 'rect',
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.15 + 0.22,
          life: maxLife,
          maxLife
        });
      }

      // Cap max particles to prevent any performance overhead
      if (particlesRef.current.length > 25) {
        particlesRef.current.splice(0, particlesRef.current.length - 25);
      }

      startAnimation();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none"
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
};
