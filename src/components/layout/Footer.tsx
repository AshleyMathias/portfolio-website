const statusItems = [
  { label: "system.status", value: "operational", status: "success" as const },
  { label: "location", value: "Pune, India", status: "success" as const },
  { label: "role", value: "AI Engineer", status: "success" as const },
  { label: "email", value: "ashleymathias100@gmail.com", status: "success" as const },
];

const contactLinks = [
  {
    label: "Email",
    href: "mailto:ashleymathias100@gmail.com",
    value: "ashleymathias100@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashleymathias10/",
    value: "ashleymathias10",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/AshleyMathias",
    value: "AshleyMathias",
    external: true,
  },
  {
    label: "Phone",
    href: "tel:+918770028291",
    value: "+91 87700 28291",
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-20 border-t border-border py-16">
      <div className="section-container">
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-medium tracking-tight">
              Let&apos;s build something intelligent.
            </h3>
            <p className="mb-6 max-w-md leading-relaxed text-muted">
              AI Engineer building production GenAI systems, RAG pipelines, and
              enterprise workflow automation. Open to collaborations, research, and
              interesting AI problems.
            </p>
            <a
              href="mailto:ashleymathias100@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
          </div>

          <div className="glass-panel p-6 font-mono text-xs">
            <p className="mb-4 text-muted-foreground">contact.links</p>
            <div className="space-y-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center justify-between gap-4 transition-colors hover:text-accent"
                >
                  <span className="text-muted-foreground">{link.label}</span>
                  <span className="truncate text-foreground">{link.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel mb-8 p-6 font-mono text-xs">
          <p className="mb-4 text-muted-foreground">system.dashboard</p>
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="flex items-center gap-2">
                  {item.status === "success" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  )}
                  <span className="text-foreground">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © 2026 Ashley Mathias — Architect&apos;s Canvas
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/AshleyMathias"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ashleymathias10/"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
