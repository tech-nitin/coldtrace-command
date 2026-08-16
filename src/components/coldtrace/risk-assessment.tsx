import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Clock, Gauge, HeartPulse, Sparkles, Wrench } from "lucide-react";
import { AI_ASSESSMENT } from "@/lib/coldtrace-data";
import { Counter, Reveal, Section } from "./primitives";

function RiskGauge({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const r = 92;
  const circumference = Math.PI * r; // half circle
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[320px]">
      <svg viewBox="0 0 220 130" className="w-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--chart-2)" />
            <stop offset="55%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--chart-4)" />
          </linearGradient>
        </defs>
        <path
          d={`M 18 114 A ${r} ${r} 0 0 1 202 114`}
          fill="none"
          stroke="oklch(1 0 0 / 0.14)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 18 114 A ${r} ${r} 0 0 1 202 114`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? circumference * (1 - value / 100) : circumference }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: inView ? -90 + (value / 100) * 180 : -90 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ originX: "110px", originY: "114px" }}
        >
          <line x1="110" y1="114" x2="110" y2="40" stroke="oklch(1 0 0 / 0.85)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="114" r="7" fill="oklch(1 0 0 / 0.9)" />
        </motion.g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="font-display text-5xl font-bold tracking-tighter text-primary-foreground">
          <Counter to={value} suffix="%" />
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
          Spoilage Risk
        </p>
      </div>
    </div>
  );
}

const METRICS = [
  { icon: HeartPulse, label: "Shipment Health", value: AI_ASSESSMENT.health, suffix: "/100", decimals: 0 },
  { icon: Gauge, label: "Anomaly Score", value: AI_ASSESSMENT.anomalyScore, suffix: "", decimals: 2 },
  { icon: Clock, label: "Estimated Safe Time", value: AI_ASSESSMENT.safeMinutes, suffix: " min", decimals: 0 },
];

export function RiskAssessment() {
  return (
    <Section id="risk">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 lg:px-16"
          style={{ backgroundImage: "var(--gradient-deep)" }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary-glow/15 blur-3xl" />

          <div className="relative grid gap-14 lg:grid-cols-[380px_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground/60">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                AI Risk Assessment
              </p>
              <div className="mt-8">
                <RiskGauge value={AI_ASSESSMENT.spoilageRisk} />
              </div>
            </div>

            <div className="text-primary-foreground">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                The engine reasons about risk, not just readings.
              </h2>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {METRICS.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -6 }}
                    className="rounded-2xl border border-primary-foreground/12 bg-primary-foreground/6 p-5 backdrop-blur"
                  >
                    <m.icon className="h-4.5 w-4.5 text-accent" />
                    <p className="mt-4 font-display text-3xl font-bold tracking-tight">
                      <Counter to={m.value} decimals={m.decimals} suffix={m.suffix} />
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/55">
                      {m.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-9 space-y-4">
                <div className="flex gap-4 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/5 p-5">
                  <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
                      AI Explanation
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-primary-foreground/90">
                      {AI_ASSESSMENT.explanation}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-accent/40 bg-accent/12 p-5">
                  <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
                      Recommended Action
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-relaxed">
                      {AI_ASSESSMENT.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
