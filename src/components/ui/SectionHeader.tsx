interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-16 max-w-2xl">
      <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
