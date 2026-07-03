import type { Metadata } from "next";
import Link from "next/link";
import { BrewLab } from "@/components/brew/BrewLab";

export const metadata: Metadata = {
  title: "The Brew Lab | Ashley Mathias",
  description:
    "A secret workflow lab where every coffee is a directed acyclic graph.",
  robots: { index: false, follow: false },
};

export default function BrewPage() {
  return (
    <div className="relative min-h-screen">
      <div className="grid-pattern fixed inset-0 z-0 opacity-15" aria-hidden="true" />
      <div className="relative z-10">
        <header className="section-container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-accent"
          >
            <span className="text-muted-foreground">~/</span>ashley.mathias
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            easter egg #01
          </span>
        </header>
        <BrewLab />
      </div>
    </div>
  );
}
