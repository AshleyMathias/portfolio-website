import type { ArchitectureCaseStudy } from "@/data/architectures";

const LAYER_COLORS = [
  "border-l-blue-500/60",
  "border-l-violet-500/60",
  "border-l-purple-500/60",
  "border-l-cyan-500/60",
  "border-l-emerald-500/60",
];

interface EnterpriseLayerDiagramProps {
  architecture: ArchitectureCaseStudy;
}

export function EnterpriseLayerDiagram({
  architecture,
}: EnterpriseLayerDiagramProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
        </div>
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          system.architecture — {architecture.id}
        </p>
        <span className="font-mono text-[10px] text-muted-foreground">v1.0</span>
      </div>

      <div className="relative p-4 md:p-6">
        <div
          className="pointer-events-none absolute top-8 bottom-8 left-[2.15rem] w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-[2.35rem]"
          aria-hidden="true"
        />

        <div className="space-y-3">
          {architecture.layers.map((layer, index) => (
            <div key={layer.id} className="relative pl-10 md:pl-12">
              <div
                className="absolute top-4 left-0 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface font-mono text-[10px] text-muted-foreground"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className={`rounded-lg border border-border border-l-2 bg-surface/60 ${LAYER_COLORS[index % LAYER_COLORS.length]} p-4`}
              >
                <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {layer.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((component) => (
                    <div
                      key={component}
                      className="rounded-md border border-border/80 bg-background/80 px-3 py-2 shadow-sm"
                    >
                      <span className="font-mono text-[11px] text-foreground/90">
                        {component}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {index < architecture.layers.length - 1 && (
                <div
                  className="flex justify-center py-1"
                  aria-hidden="true"
                >
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    ↓
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
