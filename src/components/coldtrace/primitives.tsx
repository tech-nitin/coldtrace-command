import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/coldtrace-data";

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let done = false;

    const run = () => {
      if (done) return;
      done = true;
      if (reduce) {
        setDisplay(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / (duration * 1000));
        setDisplay(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, reduce]);


  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * intensity * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * intensity * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const levelDot: Record<RiskLevel, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

export function LiveDot({ level = "healthy" as RiskLevel, className }: { level?: RiskLevel; className?: string }) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", levelDot[level])} />
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", levelDot[level])} />
    </span>
  );
}

export function LevelPill({ level, children }: { level: RiskLevel; children: ReactNode }) {
  const styles: Record<RiskLevel, string> = {
    healthy: "bg-success/10 text-success border-success/25",
    warning: "bg-warning/15 text-warning-foreground border-warning/40",
    critical: "bg-destructive/10 text-destructive border-destructive/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        styles[level],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", levelDot[level])} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-8 bg-border-strong" />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28", className)}>
      {children}
    </section>
  );
}
