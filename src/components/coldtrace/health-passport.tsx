import { motion } from "framer-motion";
import { FileCheck2, MapPin, ShieldAlert, Thermometer, Timer, TrendingDown } from "lucide-react";
import { PASSPORT, type RiskLevel } from "@/lib/coldtrace-data";
import { Counter, Reveal, Section, SectionHeading, TiltCard } from "./primitives";

const dot: Record<RiskLevel, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

const STATS = [
  { icon: TrendingDown, label: "Health Score", value: PASSPORT.health, suffix: "/100", tone: "text-destructive" },
  { icon: ShieldAlert, label: "Spoilage Risk", value: PASSPORT.risk, suffix: "%", tone: "text-destructive" },
  { icon: Thermometer, label: "Maximum Temperature", value: PASSPORT.maxTemp, suffix: "°C", decimals: 1, tone: "text-warning-foreground" },
  { icon: Timer, label: "Unsafe Exposure", value: PASSPORT.unsafeExposure, suffix: " min", tone: "text-warning-foreground" },
  { icon: FileCheck2, label: "Temperature Excursions", value: PASSPORT.excursions, suffix: "", tone: "text-foreground" },
];

export function HealthPassport() {
  return (
    <Section id="passport">
      <SectionHeading
        eyebrow="Shipment Health Passport"
        title={
          <>
            Every Shipment Has a <span className="text-gradient-primary">Health Story</span>.
          </>
        }
        description="A verifiable, sensor-signed record of everything that happened to a batch between loading dock and delivery."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <Reveal>
          <TiltCard className="[transform-style:preserve-3d]">
            <div
              className="relative overflow-hidden rounded-[1.8rem] p-8 text-primary-foreground shadow-[var(--shadow-float)]"
              style={{ backgroundImage: "var(--gradient-deep)" }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary-foreground/55">
                  ColdTrace Passport
                </p>
                <p className="mt-4 font-display text-4xl font-bold tracking-tighter">{PASSPORT.id}</p>
                <p className="mt-2 text-sm text-primary-foreground/75">{PASSPORT.batch}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {PASSPORT.route}
                </p>

                <dl className="mt-8 space-y-3 border-t border-primary-foreground/12 pt-6">
                  {STATS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <s.icon className="h-4 w-4 text-accent" />
                      <dt className="text-sm text-primary-foreground/70">{s.label}</dt>
                      <dd className="ml-auto font-display text-lg font-bold">
                        <Counter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="eyebrow">Shipment journey</p>
          <ol className="relative mt-8 space-y-8 pl-8">
            <span className="absolute left-[7px] top-1 h-full w-px bg-border" />
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute left-[7px] top-1 w-px bg-accent"
            />
            {PASSPORT.timeline.map((step, i) => (
              <motion.li
                key={step.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.14, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-background ${dot[step.state]}`} />
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p className="font-display text-base font-bold tracking-tight">{step.label}</p>
                  <span className="tabular text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {step.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.place}</p>
              </motion.li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
