"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PLATFORM_LABELS,
  formatBlogDate,
  type BlogPost,
} from "@/data/blog-posts";

interface BlogDeskProps {
  posts: BlogPost[];
}

export function BlogDesk({ posts }: BlogDeskProps) {
  const [activeId, setActiveId] = useState(posts[0]?.id ?? "");

  useEffect(() => {
    if (!posts.some((post) => post.id === activeId)) {
      setActiveId(posts[0]?.id ?? "");
    }
  }, [posts, activeId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const index = posts.findIndex((post) => post.id === activeId);
      const next =
        event.key === "ArrowDown"
          ? Math.min(posts.length - 1, index + 1)
          : Math.max(0, index - 1);
      const post = posts[next];
      if (post) setActiveId(post.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [posts, activeId]);

  const activeIndex = Math.max(
    0,
    posts.findIndex((post) => post.id === activeId)
  );
  const active = posts[activeIndex];

  if (!active) return null;

  const progress = ((activeIndex + 1) / posts.length) * 100;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Essays" className="order-2 lg:sticky lg:top-28 lg:order-1">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span>index</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(posts.length).padStart(2, "0")}
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-0 w-px bg-border"
            aria-hidden="true"
          />
          <div
            className="absolute top-0 left-0 w-px bg-accent transition-[height] duration-500 ease-out"
            style={{ height: `${progress}%` }}
            aria-hidden="true"
          />
          <ol className="max-h-[28rem] space-y-0.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-10rem)]">
            {posts.map((post, index) => {
              const selected = post.id === active.id;
              return (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(post.id)}
                    aria-current={selected ? "true" : undefined}
                    className={`flex w-full items-start gap-3 rounded-lg py-2.5 pr-2 pl-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                      selected
                        ? "bg-accent/10 text-foreground"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <span className="mt-0.5 font-mono text-[10px] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-sm leading-snug">
                        {post.title}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                        {post.category}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-4 hidden font-mono text-[10px] tracking-wide text-muted-foreground lg:block">
          Move with ↑ ↓
        </p>
      </nav>

      <AnimatePresence mode="wait">
        <motion.article
          key={active.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel relative order-1 min-h-[28rem] overflow-hidden p-6 md:p-10 lg:order-2"
        >
          <div
            className="pointer-events-none absolute top-0 left-0 h-px bg-accent/70 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-accent opacity-[0.07] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            <span className="text-accent">
              essay {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-border" aria-hidden="true">
              /
            </span>
            <span>{active.category}</span>
            {active.featured && (
              <>
                <span className="text-border" aria-hidden="true">
                  /
                </span>
                <span>featured</span>
              </>
            )}
          </div>

          <h2 className="relative mt-6 max-w-3xl text-3xl leading-tight font-medium tracking-tight md:text-5xl md:leading-[1.08]">
            {active.title}
          </h2>

          <p className="relative mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {active.description}
          </p>

          <dl className="relative mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] text-muted-foreground">
            <div>
              <dt className="uppercase tracking-widest">published</dt>
              <dd className="mt-1 text-foreground">
                {formatBlogDate(active.publishedDate)}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest">read</dt>
              <dd className="mt-1 text-foreground">{active.readTime}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest">source</dt>
              <dd className="mt-1 text-foreground">
                {PLATFORM_LABELS[active.platform]}
              </dd>
            </div>
          </dl>

          <ul className="relative mt-8 flex flex-wrap gap-2">
            {active.tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-10 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            Read on {PLATFORM_LABELS[active.platform]}
            <span aria-hidden="true">→</span>
          </a>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
