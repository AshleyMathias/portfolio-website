"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ArchitectureCaseStudy } from "@/data/architectures";

const ModularArchitecture = dynamic(
  () => import("./ModularArchitecture").then((mod) => mod.ModularArchitecture),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-[#0c0c0e]" />,
  }
);

const LAYER_COLORS = ["#60a5fa", "#a78bfa", "#c4b5fd", "#67e8f9", "#6ee7b7"];

function moduleId(layerId: string, component: string) {
  return `${layerId}::${component}`;
}

interface EnterpriseLayerDiagramProps {
  architecture: ArchitectureCaseStudy;
}

export function EnterpriseLayerDiagram({ architecture }: EnterpriseLayerDiagramProps) {
  const [selected, setSelected] = useState(() =>
    moduleId(architecture.layers[0].id, architecture.layers[0].components[0])
  );

  useEffect(() => {
    const layer = architecture.layers[0];
    setSelected(moduleId(layer.id, layer.components[0]));
  }, [architecture]);

  const selectedLayer =
    architecture.layers.find((layer) => selected.startsWith(`${layer.id}::`)) ??
    architecture.layers[0];
  const selectedName = selected.slice(selectedLayer.id.length + 2);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0c0c0e]">
      <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
        </div>
        <p className="min-w-0 flex-1 truncate text-center font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          system.architecture — {architecture.id}
        </p>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">v1.0</span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="relative h-[460px] sm:h-[540px]">
          <ModularArchitecture
            architecture={architecture}
            selected={selected}
            onSelect={setSelected}
          />
          <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            Drag to turn · pull a module
          </p>
        </div>

        <div className="border-t border-border p-4 lg:border-t-0 lg:border-l">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Pulled module
          </p>
          <p className="mt-2 text-xl font-medium tracking-tight">{selectedName}</p>
          <p className="mt-1 font-mono text-xs text-accent">{selectedLayer.name}</p>

          <div className="mt-5 max-h-[390px] space-y-4 overflow-auto pr-1">
            {architecture.layers.map((layer, index) => (
              <div key={layer.id}>
                <p
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: LAYER_COLORS[index % LAYER_COLORS.length] }}
                >
                  {String(index + 1).padStart(2, "0")} {layer.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {layer.components.map((component) => {
                    const id = moduleId(layer.id, component);
                    const active = id === selected;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelected(id)}
                        className={`rounded-md border px-2 py-1 text-left font-mono text-[11px] transition-colors ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted hover:border-muted hover:text-foreground"
                        }`}
                      >
                        {component}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
