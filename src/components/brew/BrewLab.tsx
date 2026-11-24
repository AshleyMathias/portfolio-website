"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  computeLevels,
  recipes,
  type Recipe,
} from "@/data/coffee-recipes";
import { WorkflowGraph, type StepState } from "./WorkflowGraph";
import { CoffeeCup } from "./CoffeeCup";

type Phase = "idle" | "brewing" | "done";

function idleStates(recipe: Recipe): Record<string, StepState> {
  return Object.fromEntries(recipe.steps.map((s) => [s.id, "idle"]));
}

export function BrewLab() {
  const [recipe, setRecipe] = useState<Recipe>(recipes[0]);
  const [states, setStates] = useState<Record<string, StepState>>(
    idleStates(recipes[0])
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const doneCount = Object.values(states).filter((s) => s === "done").length;
  const progress = doneCount / recipe.steps.length;
  const running = recipe.steps.find((step) => states[step.id] === "running");
  const latest =
    running ??
    [...recipe.steps].reverse().find((step) => states[step.id] === "done");
  const headline = phase === "brewing" ? (latest?.label ?? recipe.name) : recipe.name;
  const caption =
    phase === "done"
      ? recipe.result.notes.join(" · ")
      : phase === "brewing"
        ? (latest?.detail ?? recipe.tagline)
        : recipe.tagline;

  const brew = useCallback((r: Recipe) => {
    clearTimers();
    setStates(idleStates(r));
    setPhase("brewing");

    const levels = computeLevels(r.steps);
    const maxLevel = Math.max(...r.steps.map((s) => levels.get(s.id)!));
    const stepMs = 700;

    for (let lvl = 0; lvl <= maxLevel; lvl++) {
      const ids = r.steps
        .filter((s) => levels.get(s.id) === lvl)
        .map((s) => s.id);

      timers.current.push(
        setTimeout(() => {
          setStates((prev) => {
            const next = { ...prev };
            ids.forEach((id) => (next[id] = "running"));
            return next;
          });
        }, lvl * stepMs)
      );

      timers.current.push(
        setTimeout(() => {
          setStates((prev) => {
            const next = { ...prev };
            ids.forEach((id) => (next[id] = "done"));
            return next;
          });
        }, lvl * stepMs + stepMs * 0.75)
      );
    }

    timers.current.push(
      setTimeout(
        () => setPhase("done"),
        (maxLevel + 1) * stepMs
      )
    );
  }, []);

  const selectRecipe = (r: Recipe) => {
    if (r.id === recipe.id) return;
    clearTimers();
    setRecipe(r);
    setStates(idleStates(r));
    setPhase("idle");
  };

  // auto-brew the first recipe once on mount for delight
  useEffect(() => {
    const t = setTimeout(() => brew(recipes[0]), 700);
    return () => {
      clearTimeout(t);
      clearTimers();
    };
  }, [brew]);

  return (
    <div className="section-container relative z-10 py-24">
      {/* header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            secret · /brew
          </p>
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
            The Brew Lab
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            You found it. Every coffee is just a workflow — inputs, parallel
            branches, and a final pour. Pick a recipe and watch it execute.
          </p>
        </div>
        <Link
          href="/"
          className="w-fit rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          ← Back to portfolio
        </Link>
      </div>

      {/* recipe tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {recipes.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => selectRecipe(r)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
              r.id === recipe.id
                ? "border-accent/60 bg-surface-elevated text-foreground"
                : "border-border bg-surface/50 text-muted hover:border-muted hover:text-foreground"
            }`}
          >
            <span>{r.emoji}</span>
            {r.name}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="h-px bg-border">
          <div
            className="h-px bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            brew.workflow — {recipe.id}
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            {recipe.time}
          </span>
        </div>

        <div className="grid items-center gap-2 px-4 py-6 md:grid-cols-[240px_minmax(0,1fr)] md:px-8">
          <div className="flex justify-center">
            <CoffeeCup recipe={recipe} progress={progress} done={phase === "done"} />
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {phase === "brewing"
                ? `step ${String(doneCount + 1).padStart(2, "0")} / ${String(recipe.steps.length).padStart(2, "0")}`
                : phase === "done"
                  ? "poured"
                  : "standing by"}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${recipe.id}-${headline}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">
                  {headline}
                </h2>
                <p className="mt-3 max-w-lg text-lg text-muted">{caption}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  key="signs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 max-w-lg space-y-4"
                >
                  <Signs recipe={recipe} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-border px-4 py-6 md:px-8">
          <WorkflowGraph steps={recipe.steps} states={states} />
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface/40 px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                phase === "brewing"
                  ? "animate-pulse bg-warning"
                  : phase === "done"
                    ? "bg-success"
                    : "bg-muted-foreground"
              }`}
            />
            {phase === "brewing"
              ? "executing…"
              : phase === "done"
                ? "brew complete"
                : "ready"}
            <span className="text-border">|</span>
            {doneCount}/{recipe.steps.length} steps
          </div>
          <button
            type="button"
            onClick={() => brew(recipe)}
            disabled={phase === "brewing"}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "brewing" ? "Brewing…" : phase === "done" ? "Brew again" : "Brew"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Signs({ recipe }: { recipe: Recipe }) {
  const { result } = recipe;
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Temp" value={result.temp === "hot" ? "Hot ♨" : "Iced ❄"} />
        <Stat label="Caffeine" value={result.caffeine} />
        <Stat label="Volume" value={result.volume} />
        <Stat
          label="Strength"
          value={
            <span className="inline-flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-1.5 rounded-sm ${
                    i < result.strength ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </span>
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {result.notes.map((n) => (
          <span
            key={n}
            className="rounded-full border border-border bg-surface/60 px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted"
          >
            {n}
          </span>
        ))}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 px-3 py-2">
      <p className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 flex h-4 items-center text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}
