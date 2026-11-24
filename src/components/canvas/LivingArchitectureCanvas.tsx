"use client";

import { useEffect, useRef } from "react";
import { NeuralWorkflowEngine } from "@/lib/neural-workflow";
import { readIsScrolling, readScrollProgress, subscribeScrollProgress } from "@/lib/scroll-signal";

export function LivingArchitectureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<NeuralWorkflowEngine | null>(null);
  const scrollRef = useRef(0);

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

    const unsubScroll = subscribeScrollProgress((progress) => {
      scrollRef.current = progress;
    });
    scrollRef.current = readScrollProgress();

    let dpr = 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = 1;
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
        unsubScroll();
        window.removeEventListener("resize", onResize);
      };
    }

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (readIsScrolling() || now - last < 40) return;
      const dt = Math.min(now - last, 64);
      last = now;
      engine.setScroll(scrollRef.current);
      engine.render(ctx, now, dt);
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
      unsubScroll();
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
