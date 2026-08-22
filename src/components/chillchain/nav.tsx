import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { LiveDot } from "./primitives";

const LINKS = [
  { to: "/", label: "Overview" },
  { to: "/shipments", label: "Shipments" },
  { to: "/storage", label: "Storage" },
  { to: "/risk-spoilage", label: "Risk & Spoilage" },
  { to: "/analytics", label: "Analytics" },
  { to: "/devices", label: "Devices" },
] as const;

export function TopNav() {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Snowflake className="h-5 w-5" />
          </span>

          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight">
              ChillChain AI
            </span>

            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cold-Chain Intelligence
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{
                className:
                  "rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-foreground",
              }}
              inactiveProps={{
                className:
                  "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Sensor Status */}
          <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:inline-flex">
            <LiveDot />
            6 Sensors Online
          </span>

          {/* Profile */}
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-secondary"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
              N
            </span>

            <span className="hidden sm:inline">
              Profile
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}