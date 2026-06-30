"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Systems", href: "/#architecture" },
  { label: "Projects", href: "/#projects" },
  { label: "GitHub", href: "/github" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Philosophy", href: "/#about" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-foreground transition-colors hover:text-accent"
        >
          <span className="text-muted-foreground">~/</span>ashley.mathias
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-surface-elevated"
            >
              Connect
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="section-container flex flex-col gap-4 py-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/#contact"
                  className="text-sm font-medium text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Connect
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
