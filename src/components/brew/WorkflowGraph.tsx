"use client";

import { motion } from "framer-motion";
import {
  computeLevels,
  KIND_COLORS,
  type BrewStep,
} from "@/data/coffee-recipes";

export type StepState = "idle" | "running" | "done";

interface WorkflowGraphProps {
  steps: BrewStep[];
  states: Record<string, StepState>;
}

interface Positioned extends BrewStep {
  nx: number; // 0..1 horizontal
  ny: number; // 0..1 vertical
}

export function WorkflowGraph({ steps, states }: WorkflowGraphProps) {
  const levels = computeLevels(steps);
  const maxLevel = Math.max(...steps.map((s) => levels.get(s.id)!));

  const byLevel = new Map<number, BrewStep[]>();
  steps.forEach((s) => {
    const l = levels.get(s.id)!;
    if (!byLevel.has(l)) byLevel.set(l, []);
    byLevel.get(l)!.push(s);
  });
  const maxRows = Math.max(...[...byLevel.values()].map((a) => a.length));

  const positioned: Positioned[] = steps.map((s) => {
    const l = levels.get(s.id)!;
    const siblings = byLevel.get(l)!;
    const slot = siblings.indexOf(s);
    const nx = (l + 0.5) / (maxLevel + 1);
    const ny = (slot + 0.5) / siblings.length;
    return { ...s, nx, ny };
  });

  const posById = new Map(positioned.map((p) => [p.id, p]));
  const minHeight = Math.max(200, maxRows * 92);

  const edges = steps.flatMap((s) =>
    s.deps.map((d) => ({ from: posById.get(d)!, to: posById.get(s.id)! }))
  );

  return (
    <div
      className="relative w-full overflow-x-auto"
      style={{ minHeight }}
    >
      <div className="relative h-full w-full" style={{ minHeight }}>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e, i) => {
            const active =
              states[e.from.id] === "done" &&
              (states[e.to.id] === "running" || states[e.to.id] === "done");
            const done =
              states[e.from.id] === "done" && states[e.to.id] === "done";
            const x1 = e.from.nx * 100;
            const y1 = e.from.ny * 100;
            const x2 = e.to.nx * 100;
            const y2 = e.to.ny * 100;
            const mx = (x1 + x2) / 2;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={
                  done
                    ? "rgba(74, 222, 128, 0.5)"
                    : active
                      ? "rgba(224, 145, 63, 0.7)"
                      : "rgba(120, 120, 130, 0.22)"
                }
                strokeWidth={active ? 1.4 : 1}
                strokeDasharray={active && !done ? "3 4" : undefined}
                vectorEffect="non-scaling-stroke"
                className={active && !done ? "brew-flow" : ""}
              />
            );
          })}
        </svg>

        {positioned.map((p, i) => {
          const state = states[p.id] ?? "idle";
          const color = KIND_COLORS[p.kind];
          return (
            <motion.div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.nx * 100}%`, top: `${p.ny * 100}%` }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <div
                className={`relative flex min-w-[92px] flex-col items-center gap-0.5 rounded-lg border px-3 py-2 backdrop-blur-sm transition-all duration-300 ${
                  state === "running"
                    ? "scale-105 border-transparent bg-surface-elevated shadow-lg"
                    : state === "done"
                      ? "border-border bg-surface/80"
                      : "border-border/60 bg-surface/40"
                }`}
                style={
                  state === "running"
                    ? { boxShadow: `0 0 0 1px ${color}, 0 0 22px -6px ${color}` }
                    : undefined
                }
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        state === "idle" ? "#3f3f46" : color,
                      boxShadow:
                        state === "running" ? `0 0 8px ${color}` : "none",
                    }}
                  />
                  <span
                    className={`text-xs font-medium transition-colors ${
                      state === "idle"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
                {p.detail && (
                  <span className="font-mono text-[9px] tracking-wide text-muted-foreground">
                    {p.detail}
                  </span>
                )}

                {state === "running" && (
                  <motion.span
                    layoutId="brew-active-badge"
                    className="absolute -top-1.5 -right-1.5 flex h-3 w-3"
                  >
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="relative inline-flex h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </motion.span>
                )}
                {state === "done" && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success text-[8px] text-background">
                    ✓
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
