"use client";

import { motion } from "framer-motion";
import { HotCoffeeMug } from "@/components/ui/HotCoffeeMug";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <HotCoffeeMug className="absolute top-32 right-6 hidden opacity-80 lg:right-12 lg:block xl:right-[max(3rem,calc((100vw-72rem)/2+2rem))]" />

      <div className="section-container relative z-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            AI Engineer · Pune, India
          </p>

          <h1 className="mb-6 text-4xl leading-tight font-medium tracking-tight md:text-6xl md:leading-[1.1]">
            Hi, I&apos;m{" "}
            <span className="text-gradient">Ashley Mathias</span>
            <br />
            I design AI systems.
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted">
            AI engineer specializing in RAG pipelines, multi-agent workflows,
            and MCP architectures. I think in diagrams first — then build
            production systems that scale.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              View Projects
            </a>
            <a
              href="#projects"
              className="rounded-lg border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-muted hover:bg-surface"
            >
              View Systems
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-20 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground"
          >
            <HotCoffeeMug className="mr-1 scale-[0.55] lg:hidden" compact />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            system.status: online
            <span className="text-border">|</span>
            scroll to evolve architecture
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
