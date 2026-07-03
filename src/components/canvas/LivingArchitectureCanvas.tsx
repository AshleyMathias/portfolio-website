"use client";

import { useEffect, useRef } from "react";
import { NeuralWorkflowEngine } from "@/lib/neural-workflow";

interface LivingArchitectureCanvasProps {
  scrollProgress: number;
}

export function LivingArchitectureCanvas({
  scrollProgress,
}: LivingArchitectureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<NeuralWorkflowEngine | null>(null);
  const scrollRef = useRef(scrollProgress);

  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const engine = new NeuralWorkflowEngine();
    engineRef.current = engine;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.resize(w, h);
      if (prefersReduced) {
        ctx.clearRect(0, 0, w, h);
        engine.renderStatic(ctx);
      }
    };

    resize();

    const onMove = (e: MouseEvent) => {
      engine.setMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };
    const onResize = () => resize();

    window.addEventListener("resize", onResize);

    if (prefersReduced) {
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(now - last, 48); // clamp long frames (tab switch)
      last = now;
      engine.setScroll(scrollRef.current);
      engine.render(ctx, now, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.55]"
      aria-hidden="true"
    />
  );
}
