"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function BlogHero() {
  return (
    <div className="relative mb-16 overflow-hidden">
      {/* Subtle knowledge-graph accents — CSS only, theme-native */}
      <div
        className="pointer-events-none absolute top-0 right-0 hidden h-40 w-56 opacity-[0.35] md:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 160" fill="none" className="h-full w-full">
          <circle cx="40" cy="50" r="3" fill="#3b82f6" fillOpacity="0.4" />
          <circle cx="110" cy="30" r="2.5" fill="#8b5cf6" fillOpacity="0.4" />
          <circle cx="180" cy="55" r="3" fill="#06b6d4" fillOpacity="0.4" />
          <circle cx="90" cy="100" r="2.5" fill="#3b82f6" fillOpacity="0.3" />
          <circle cx="160" cy="110" r="2" fill="#8b5cf6" fillOpacity="0.3" />
          <path
            d="M40 50 L110 30 L180 55 M110 30 L90 100 L160 110 M180 55 L160 110"
            stroke="#3b82f6"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative max-w-2xl"
      >
        <Link
          href="/"
          className="mb-6 inline-flex font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          ← Back to portfolio
        </Link>

        <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          technical journal · /blog
        </p>

        <h1 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl">
          Engineering notes
        </h1>

        <p className="text-lg leading-relaxed text-muted">
          Writing about AI, engineering, system design, and the lessons learned
          while building real-world intelligent systems.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          journal.status: publishing
          <span className="text-border">|</span>
          sources: Medium · Prompt Architect
        </div>
      </motion.div>
    </div>
  );
}
