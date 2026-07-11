"use client";

import { motion } from "framer-motion";
import {
  PLATFORM_LABELS,
  formatBlogDate,
  type BlogPost,
} from "@/data/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05 }}
      className={`glass-panel group relative overflow-hidden transition-colors hover:border-accent/30 ${
        featured ? "p-6 md:p-8" : "p-6"
      }`}
    >
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-accent opacity-[0.05] blur-2xl transition-opacity group-hover:opacity-[0.1]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-surface-elevated px-2 py-1 font-mono text-[10px] tracking-wide text-accent uppercase">
              {PLATFORM_LABELS[post.platform]}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {formatBlogDate(post.publishedDate)}
            </span>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {post.readTime} read
            </span>
          </div>

          <h3
            className={`mb-2 font-medium tracking-tight ${
              featured ? "text-xl md:text-2xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>

          <p className="mb-4 leading-relaxed text-muted">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border bg-background/50 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${post.title} on ${PLATFORM_LABELS[post.platform]}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 font-mono text-xs transition-colors hover:border-accent/50 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Read article →
        </a>
      </div>
    </motion.article>
  );
}
