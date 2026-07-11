"use client";

interface BlogCategoriesProps {
  categories: string[];
  active: string | null;
  onSelect: (category: string | null) => void;
}

export function BlogCategories({
  categories,
  active,
  onSelect,
}: BlogCategoriesProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by category"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-lg border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          active === null
            ? "border-accent bg-accent/10 text-foreground"
            : "border-border text-muted hover:border-muted hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-lg border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            active === category
              ? "border-accent bg-accent/10 text-foreground"
              : "border-border text-muted hover:border-muted hover:text-foreground"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
