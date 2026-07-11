"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";

const navItems = [
  { label: "Systems", href: "/#architecture", section: "architecture" },
  { label: "Projects", href: "/#projects", section: "projects" },
  { label: "GitHub", href: "/github", section: null },
  { label: "Blog", href: "/blog", section: null },
  { label: "Skills", href: "/#skills", section: "skills" },
  { label: "Experience", href: "/#experience", section: "experience" },
  { label: "Philosophy", href: "/#about", section: "about" },
];

const sectionIds = ["architecture", "projects", "skills", "experience", "about"];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string, section: string | null) => {
    if (!mounted) return false;
    if (section === null) return pathname === href;
    return isHome && activeSection === section;
  };

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
          className="rounded font-mono text-sm tracking-tight text-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <span className="text-muted-foreground">~/</span>ashley.mathias
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={
                  isActive(item.href, item.section) ? "page" : undefined
                }
                className={`relative rounded py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                  isActive(item.href, item.section)
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.href, item.section) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Connect
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="flex flex-col gap-1.5 rounded p-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="section-container flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={
                      isActive(item.href, item.section) ? "page" : undefined
                    }
                    className={`block rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive(item.href, item.section)
                        ? "bg-surface text-foreground"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/#contact"
                  className="block rounded-lg border border-border bg-surface px-3 py-3 text-sm font-medium text-foreground"
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
