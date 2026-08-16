import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BellRing, CheckCircle2, Droplets, Route, WifiOff } from "lucide-react";
import { ALERTS, type RiskLevel } from "@/lib/coldtrace-data";
import { LiveDot, Reveal, Section, SectionHeading } from "./primitives";

const iconFor: Record<string, typeof AlertTriangle> = {
  "Temperature Breach": AlertTriangle,
  "Humidity Warning": Droplets,
  "Route Deviation": Route,
  "Sensor Offline": WifiOff,
  "Temperature Normalized": CheckCircle2,
};

const styles: Record<RiskLevel, { wrap: string; icon: string }> = {
  healthy: { wrap: "border-success/30 bg-success/6", icon: "bg-success/12 text-success" },
  warning: { wrap: "border-warning/40 bg-warning/8", icon: "bg-warning/18 text-warning-foreground" },
  critical: { wrap: "border-destructive/30 bg-destructive/6", icon: "bg-destructive/12 text-destructive" },
};

export function AlertCenter() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= ALERTS.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 700);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <Section id="alerts">
      <SectionHeading
        eyebrow="Alert Center"
        title={
          <>
            Escalations arrive <span className="text-gradient-primary">before the loss does</span>.
          </>
        }
        description="Every anomaly is streamed, classified and ranked by urgency so operators act on the one shipment that matters."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <LiveDot level="critical" />
            2 unresolved critical
          </span>
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {ALERTS.slice(0, visible).map((a) => {
              const Icon = iconFor[a.title] ?? BellRing;
              const s = styles[a.level];
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, x: 48, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 6 }}
                  className={`flex items-start gap-4 rounded-2xl border px-5 py-4 ${s.wrap}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.icon}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <p className="font-display text-sm font-bold tracking-tight">{a.title}</p>
                      <span className="text-xs font-semibold text-muted-foreground">{a.shipment}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="ml-auto whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {a.time}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <Reveal delay={0.1}>
          <div className="surface-panel sticky top-24 rounded-2xl p-6">
            <p className="eyebrow">Response playbook</p>
            <ul className="mt-5 space-y-4 text-sm">
              {[
                ["Critical", "Call driver, verify compressor, reroute to nearest cold hub."],
                ["Warning", "Increase sampling to 5 s, monitor 15 min window."],
                ["Recovered", "Log excursion into shipment passport."],
              ].map(([k, v]) => (
                <li key={k}>
                  <p className="font-display text-xs font-bold uppercase tracking-wider">{k}</p>
                  <p className="mt-1 text-muted-foreground">{v}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setVisible(1)}
              className="mt-6 w-full rounded-full border border-border-strong bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:border-accent/50"
            >
              Replay alert feed
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
