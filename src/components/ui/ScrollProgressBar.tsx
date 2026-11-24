"use client";

import { useEffect, useRef } from "react";
import { subscribeScrollProgress } from "@/lib/scroll-signal";

export function ScrollProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeScrollProgress((progress) => {
      if (bar.current) bar.current.style.width = `${progress * 100}%`;
    });
  }, []);

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-accent via-node-ai to-node-data"
        style={{ width: "0%" }}
      />
    </div>
  );
}
