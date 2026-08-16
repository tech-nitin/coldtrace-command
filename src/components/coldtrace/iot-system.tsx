import { motion } from "framer-motion";
import { Brain, Cpu, LayoutDashboard, Server, Thermometer, Wifi } from "lucide-react";
import { PIPELINE } from "@/lib/coldtrace-data";
import { LiveDot, Reveal, Section, SectionHeading } from "./primitives";

const icons = [Thermometer, Cpu, Wifi, Server, Brain, LayoutDashboard];

export function IotSystem() {
  return (
    <Section id="system">
      <SectionHeading
        eyebrow="IoT System Architecture"
        title={
          <>
            From a single sensor to a <span className="text-gradient-primary">command center</span>.
          </>
        }
        description="Every reading travels the same verified path — sampled at the crate, reasoned about in the cloud, surfaced in seconds."
        align="center"
      />

      <Reveal delay={0.1} className="mt-14">
        <div className="relative">
          <div className="grid gap-4 lg:grid-cols-6">
            {PIPELINE.map((node, i) => {
              const Icon = icons[i]!;
              return (
                <motion.div
                  key={node.key}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {i < PIPELINE.length - 1 && (
                    <>
                      <svg className="absolute -right-4 top-1/2 hidden h-3 w-8 -translate-y-1/2 lg:block" aria-hidden>
                        <line x1="0" y1="6" x2="32" y2="6" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" style={{ animationDuration: "3s" }} />
                      </svg>
                      <svg className="mx-auto h-6 w-3 lg:hidden" aria-hidden>
                        <line x1="6" y1="0" x2="6" y2="24" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                      </svg>
                    </>
                  )}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="surface-panel h-full rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <LiveDot />
                    </div>
                    <p className="mt-5 font-display text-sm font-bold tracking-tight">{node.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{node.note}</p>
                    <p className="mt-4 tabular text-[11px] font-bold uppercase tracking-wider text-accent">
                      {node.metric}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function ClosingBanner() {
  return (
    <Section className="pt-0">
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-border bg-surface px-8 py-14 text-center shadow-[var(--shadow-soft)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <LiveDot />
            Live cold-chain command center
          </span>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-[2.6rem]">
            Built for the field. Ready for the <span className="text-gradient-primary">real ESP32 fleet</span>.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            ColdTrace AI — IoT telemetry, AI spoilage prediction and operator-grade intelligence for
            temperature-sensitive agriculture.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a
              href="#shipments"
              className="rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              View Live Shipments
            </a>
            <a
              href="#top"
              className="rounded-full border border-border-strong bg-background px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/50"
            >
              Back to overview
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
