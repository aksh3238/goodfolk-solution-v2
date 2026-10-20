import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  initialDist: number;
}

interface AboutCtaParticleConvergenceProps {
  className?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
}

export const AboutCtaParticleConvergence: React.FC<AboutCtaParticleConvergenceProps> = ({
  className = '',
  targetRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Palette: Crisp white and subtle neon-tinted brand accents
    const palette = [
      'rgba(255, 255, 255, 0.85)',
      'rgba(255, 255, 255, 0.70)',
      'rgba(240, 120, 34, 0.75)',  // Warm Orange accent
      'rgba(140, 190, 255, 0.80)', // Subtle neon bright blue
      'rgba(255, 249, 241, 0.80)'  // Soft cream
    ];

    const spawnParticle = (tx: number, ty: number): Particle => {
      // Spawn in radial burst around perimeter / wide radii
      const angle = Math.random() * Math.PI * 2;
      const minRadius = Math.min(width, height) * 0.35;
      const maxRadius = Math.max(width, height) * 0.65;
      const spawnDist = minRadius + Math.random() * (maxRadius - minRadius);

      const x = tx + Math.cos(angle) * spawnDist;
      const y = ty + Math.sin(angle) * spawnDist;

      // Intentional trajectory pointing inward toward target button
      const speed = Math.random() * 1.8 + 1.2;
      const dirX = tx - x;
      const dirY = ty - y;
      const norm = Math.hypot(dirX, dirY) || 1;

      return {
        x,
        y,
        vx: (dirX / norm) * speed,
        vy: (dirY / norm) * speed,
        size: Math.random() * 2.2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.3 + 0.6,
        life: 0,
        maxLife: Math.floor(Math.random() * 50 + 60),
        initialDist: norm
      };
    };

    // Initialize initial batch
    const particleCount = width < 640 ? 35 : 65;
    const initialTargetX = width * 0.5;
    const initialTargetY = height * 0.72;

    particlesRef.current = Array.from({ length: particleCount }, () =>
      spawnParticle(initialTargetX, initialTargetY)
    );

    // Stagger initial progress
    particlesRef.current.forEach((p) => {
      p.life = Math.floor(Math.random() * p.maxLife * 0.7);
    });

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Determine current target position (CTA button center)
      let targetX = width * 0.5;
      let targetY = height * 0.72;

      if (targetRef && targetRef.current && canvas) {
        const btnRect = targetRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        targetX = btnRect.left + btnRect.width / 2 - canvasRect.left;
        targetY = btnRect.top + btnRect.height / 2 - canvasRect.top;
      }

      // Draw subtle ambient focal glow behind button
      const halo = ctx.createRadialGradient(targetX, targetY, 10, targetX, targetY, 140);
      halo.addColorStop(0, 'rgba(240, 120, 34, 0.18)');
      halo.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      halo.addColorStop(1, 'rgba(23, 59, 117, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Update & render streaming particles targeting CTA
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Steer intentionally towards current target coordinates
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy);

        // Smooth acceleration toward target
        const steerFactor = 0.045;
        p.vx += (dx / (dist || 1)) * steerFactor;
        p.vy += (dy / (dist || 1)) * steerFactor;

        // Dampen slight drift
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Fade in smoothly, then fade out upon convergence at button
        let currentAlpha = p.alpha;
        if (p.life < 15) {
          currentAlpha *= p.life / 15;
        }
        if (dist < 40) {
          currentAlpha *= dist / 40;
        }

        // Draw particle with gentle glow
        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/, `${Math.max(0, currentAlpha).toFixed(3)})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Respawn when reaching target or expiring
        if (dist < 12 || p.life >= p.maxLife) {
          particles[i] = spawnParticle(targetX, targetY);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
