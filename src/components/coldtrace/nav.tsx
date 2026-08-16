import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import { LiveDot } from "./primitives";

const LINKS = [
  { href: "#temperature", label: "Temperature" },
  { href: "#risk", label: "AI Risk" },
  { href: "#map", label: "Map" },
  { href: "#shipments", label: "Shipments" },
  { href: "#analytics", label: "Analytics" },
  { href: "#passport", label: "Passport" },
  { href: "#system", label: "IoT" },
];

export function TopNav() {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Snowflake className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight">COLDTRACE AI</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cold-Chain Intelligence
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:inline-flex">
            <LiveDot />
            6 sensors online
          </span>
          <a
            href="#shipments"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
          >
            Command Center
          </a>
        </div>
      </div>
    </motion.header>
  );
}
