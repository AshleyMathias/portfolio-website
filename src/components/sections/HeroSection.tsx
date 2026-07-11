"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HotCoffeeMug } from "@/components/ui/HotCoffeeMug";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Link
        href="/brew"
        aria-label="Open the secret Brew Lab"
        title="brew?"
        className="group absolute top-32 right-6 z-20 hidden lg:right-12 lg:block xl:right-[max(3rem,calc((100vw-72rem)/2+2rem))]"
      >
        <HotCoffeeMug
          interactive
          className="opacity-80 transition-opacity group-hover:opacity-100"
        />
      </Link>

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
              className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              View Projects
            </a>
            <a
              href="#architecture"
              className="rounded-lg border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-muted hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              View Systems
            </a>
            <a
              href="#contact"
              className="rounded-lg px-6 py-3 text-sm text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Get in touch →
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-20 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground"
          >
            <ProfileAvatar size="sm" className="mr-1" />
            <Link
              href="/brew"
              aria-label="Open the secret Brew Lab"
              className="lg:hidden"
            >
              <HotCoffeeMug className="mr-1 scale-[0.55]" compact interactive />
            </Link>
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            system.status: online
            <span className="text-border">|</span>
            scroll to evolve architecture
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#architecture"
        aria-label="Scroll to systems"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">
          scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-border pt-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-muted-foreground" />
        </motion.span>
      </motion.a>
    </section>
  );
}
