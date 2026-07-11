"use client";

import { useMemo, useState } from "react";
import {
  blogCategories,
  blogPosts,
  featuredPosts,
} from "@/data/blog-posts";
import { BlogHero } from "./BlogHero";
import { BlogCard } from "./BlogCard";
import { BlogSearch } from "./BlogSearch";
import { BlogCategories } from "./BlogCategories";

export function BlogContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      if (category && post.category !== category) return false;
      if (!q) return true;
      const haystack = [
        post.title,
        post.description,
        post.category,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  const showFeatured =
    !query && !category && featuredPosts.length > 0;

  return (
    <div className="section-container py-32">
      <BlogHero />

      <div className="mb-12 space-y-4">
        <BlogSearch value={query} onChange={setQuery} />
        <BlogCategories
          categories={blogCategories}
          active={category}
          onSelect={setCategory}
        />
      </div>

      {showFeatured && (
        <section className="mb-20" aria-labelledby="featured-heading">
          <div className="mb-8 flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            <h2 id="featured-heading" className="text-xl font-medium">
              Featured
            </h2>
          </div>
          <div className="grid gap-4">
            {featuredPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} featured />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="latest-heading">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            <h2 id="latest-heading" className="text-xl font-medium">
              {showFeatured ? "Latest Articles" : "Articles"}
            </h2>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1 ? "result" : "results"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              no matches
            </p>
            <p className="mt-3 text-muted">
              Try another keyword or clear the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
              className="mt-6 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>

      <aside className="mt-20 rounded-xl border border-border border-dashed bg-surface/30 p-6">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          note
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Links open on Medium and{" "}
          <a
            href="https://promptengineeringwithashley.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Prompt Architect
          </a>{" "}
          (Blogger). This journal is structured so articles can later ship
          natively on this site without changing the card model.
        </p>
      </aside>
    </div>
  );
}
