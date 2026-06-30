import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import { GitHubProjectsContent } from "@/components/sections/GitHubProjectsContent";

export const metadata: Metadata = {
  title: "GitHub Projects | Ashley Mathias",
  description:
    "Featured open-source AI projects and LLM research repositories by Ashley Mathias.",
};

export default function GitHubPage() {
  return (
    <div className="relative min-h-screen">
      <div className="grid-pattern fixed inset-0 z-0 opacity-15" aria-hidden="true" />
      <div className="relative z-10">
        <Navigation />
        <GitHubProjectsContent />
      </div>
    </div>
  );
}
