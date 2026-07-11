import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { BlogContent } from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Blog | Ashley Mathias",
  description:
    "Technical writing on AI systems, RAG, multi-agent orchestration, and lessons from building production intelligent systems.",
};

export default function BlogPage() {
  return (
    <div className="relative min-h-screen">
      <div
        className="grid-pattern fixed inset-0 z-0 opacity-15"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Navigation />
        <main>
          <BlogContent />
        </main>
        <Footer />
      </div>
    </div>
  );
}
