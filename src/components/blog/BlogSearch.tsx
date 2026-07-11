"use client";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className="relative">
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <span
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-xs text-muted-foreground"
        aria-hidden="true"
      >
        /
      </span>
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles, tags, topics…"
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-surface/50 py-2.5 pr-4 pl-7 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </div>
  );
}
