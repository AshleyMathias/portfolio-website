"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getInterpolatedTier,
  type ArchNode,
  type NodeType,
} from "@/lib/architecture-tiers";

const NODE_COLORS: Record<NodeType, string> = {
  api: "#3b82f6",
  ai: "#8b5cf6",
  data: "#06b6d4",
  queue: "#f59e0b",
  db: "#10b981",
  gateway: "#a1a1aa",
  agent: "#a78bfa",
};

interface Packet {
  edgeId: string;
  progress: number;
  speed: number;
}

interface LivingArchitectureCanvasProps {
  scrollProgress: number;
}

export function LivingArchitectureCanvas({
  scrollProgress,
}: LivingArchitectureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(scrollProgress);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const packetsRef = useRef<Packet[]>([]);
  const frameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  scrollRef.current = scrollProgress;

  const getCurrentTier = useCallback(() => {
    return getInterpolatedTier(scrollRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    let lastSpawn = 0;
    let dashOffset = 0;

    const draw = (time: number) => {
      const tier = getCurrentTier();
      const { width, height } = dimensions;
      const pulse = 0.5 + Math.sin(time * 0.0012) * 0.2;
      const parallaxX = (mouseRef.current.x - 0.5) * 18;
      const parallaxY = (mouseRef.current.y - 0.5) * 12;
      dashOffset = (dashOffset + 0.4) % 16;

      ctx.clearRect(0, 0, width, height);

      const nodeMap = new Map<string, ArchNode>();
      for (const node of tier.nodes) {
        nodeMap.set(node.id, {
          ...node,
          x: node.x * width + parallaxX,
          y: node.y * height + parallaxY,
        });
      }

      if (time - lastSpawn > 1800 && tier.edges.length > 0) {
        const edge =
          tier.edges[Math.floor(Math.random() * tier.edges.length)];
        packetsRef.current.push({
          edgeId: edge.id,
          progress: 0,
          speed: 0.003 + Math.random() * 0.002,
        });
        if (packetsRef.current.length > 4) packetsRef.current.shift();
        lastSpawn = time;
      }

      for (const edge of tier.edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 + pulse * 0.1})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.lineDashOffset = -dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (const packet of packetsRef.current) {
        const edge = tier.edges.find((e) => e.id === packet.edgeId);
        if (!edge) continue;
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        packet.progress += packet.speed;
        if (packet.progress > 1) packet.progress = 0;

        const px = source.x + (target.x - source.x) * packet.progress;
        const py = source.y + (target.y - source.y) * packet.progress;

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 6);
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.7)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      for (const node of tier.nodes) {
        const pos = nodeMap.get(node.id);
        if (!pos) continue;

        const color = NODE_COLORS[node.type];
        const r = 5 + pulse;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r + 10, 0, Math.PI * 2);
        ctx.fillStyle = `${color}0c`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17, 17, 19, 0.7)";
        ctx.fill();
        ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.35 + pulse * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${color}cc`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [dimensions, getCurrentTier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.38]"
      aria-hidden="true"
    />
  );
}
