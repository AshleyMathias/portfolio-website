"use client";

import { useMemo, useState } from "react";
import { blogCategories, blogPosts } from "@/data/blog-posts";
import { BlogHero } from "./BlogHero";
import { BlogSearch } from "./BlogSearch";
import { BlogCategories } from "./BlogCategories";
import { BlogDesk } from "./BlogDesk";

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

  return (
    <div className="section-container py-32">
      <BlogHero />

      <div className="mb-10 space-y-4">
        <BlogSearch value={query} onChange={setQuery} />
        <BlogCategories
          categories={blogCategories}
          active={category}
          onSelect={setCategory}
        />
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
        <BlogDesk posts={filtered} />
      )}
    </div>
  );
}
