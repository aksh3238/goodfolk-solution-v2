import React, { useEffect, useRef } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface CtaMotionGraphicProps {
  className?: string;
  isTriggered?: boolean;
}

export const CtaMotionGraphic: React.FC<CtaMotionGraphicProps> = ({
  className = '',
  isTriggered = false
}) => {
  const { siteContent } = useSiteContent();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isEnabled = siteContent.ctaAnimationType !== 'none';

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    // Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let phase = 0;

    // Distinctive Kinetic Ribbon Waves & Geometric Constellation
    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      phase += 0.012; // Smooth steady motion

      // LAYER 1: Ambient Depth Glow
      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.65,
        20,
        width * 0.5,
        height * 0.65,
        Math.max(width, height) * 0.7
      );
      bgGlow.addColorStop(0, 'rgba(240, 120, 34, 0.12)'); // Subtle Warm Orange focal glow
      bgGlow.addColorStop(0.4, 'rgba(36, 88, 166, 0.15)'); // Bright Blue ambient
      bgGlow.addColorStop(1, 'rgba(23, 59, 117, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // LAYER 2: Flowing Kinetic Ribbon Wave A (Bright Blue #2458A6)
      ctx.beginPath();
      ctx.moveTo(0, height * 0.6);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.58 +
          Math.sin(x * 0.0035 + phase) * 45 +
          Math.cos(x * 0.007 - phase * 0.8) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const waveGradA = ctx.createLinearGradient(0, height * 0.4, width, height);
      waveGradA.addColorStop(0, 'rgba(36, 88, 166, 0.22)');
      waveGradA.addColorStop(1, 'rgba(23, 59, 117, 0.08)');
      ctx.fillStyle = waveGradA;
      ctx.fill();

      // LAYER 3: Flowing Kinetic Ribbon Wave B (Warm Orange Accent #F07822)
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.72 +
          Math.sin(x * 0.0045 - phase * 1.2) * 35 +
          Math.cos(x * 0.002 + phase) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const waveGradB = ctx.createLinearGradient(0, height * 0.5, width, height);
      waveGradB.addColorStop(0, 'rgba(240, 120, 34, 0.18)');
      waveGradB.addColorStop(0.5, 'rgba(240, 120, 34, 0.08)');
      waveGradB.addColorStop(1, 'rgba(23, 59, 117, 0)');
      ctx.fillStyle = waveGradB;
      ctx.fill();

      // LAYER 4: Fine Vector Contour Lines (Design/Agency Grid Aesthetic)
      ctx.strokeStyle = 'rgba(255, 249, 241, 0.16)'; // Soft Cream wireframe
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y =
          height * 0.48 +
          Math.sin(x * 0.005 + phase * 0.9) * 30 +
          Math.sin(x * 0.002 - phase) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary fine contour
      ctx.strokeStyle = 'rgba(240, 120, 34, 0.25)';
      ctx.beginPath();
      for (let x = 0; x <= width; x += 25) {
        const y =
          height * 0.65 +
          Math.cos(x * 0.004 + phase * 1.1) * 28;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // LAYER 5: Pulsing Geometric Constellation Nodes along Wave Crests
      const nodeCount = width < 640 ? 5 : 8;
      for (let i = 0; i < nodeCount; i++) {
        const nx = ((i + 1) / (nodeCount + 1)) * width;
        const ny =
          height * 0.58 +
          Math.sin(nx * 0.0035 + phase) * 45 +
          Math.cos(nx * 0.007 - phase * 0.8) * 20;

        const pulse = (Math.sin(phase * 2 + i) + 1) * 0.5;

        // Outer halo
        ctx.beginPath();
        ctx.arc(nx, ny, 4 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 120, 34, 0.15)';
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
};
