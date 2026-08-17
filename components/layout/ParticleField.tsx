"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  opacity: number;
}

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let raf = 0;

    function resize() {
      const el = canvasRef.current;
      const context = ctx;
      if (!el || !context) return;
      width = el.offsetWidth;
      height = el.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      context.scale(dpr, dpr);

      const count = width < 640 ? 16 : 36;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        speed: 0.08 + Math.random() * 0.15,
        drift: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.35,
      }));
    }

    function tick() {
      const context = ctx;
      if (!context) return;
      frame += 1;
      context.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.008 + p.phase) * 0.15;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        context.beginPath();
        context.fillStyle = `rgba(198, 166, 98, ${p.opacity})`;
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
