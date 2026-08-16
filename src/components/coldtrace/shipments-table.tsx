import { motion } from "framer-motion";
import { ArrowUpRight, Droplets, Thermometer } from "lucide-react";
import { SHIPMENTS, type RiskLevel } from "@/lib/coldtrace-data";
import { LevelPill, Reveal, Section, SectionHeading } from "./primitives";

const barTone: Record<RiskLevel, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

export function ShipmentsTable() {
  return (
    <Section id="shipments">
      <SectionHeading
        eyebrow="Active Shipments"
        title={
          <>
            The fleet, at a <span className="text-gradient-primary">single glance</span>.
          </>
        }
        description="Live telemetry per shipment: temperature, humidity, AI health score and current risk posture."
        actions={
          <a
            href="#passport"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/50"
          >
            Open health passport
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </a>
        }
      />

      <Reveal delay={0.1} className="mt-12">
        <div className="overflow-hidden rounded-[1.6rem] border border-border bg-surface shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left">
                  {[
                    "Shipment ID",
                    "Product",
                    "Route",
                    "Temperature",
                    "Humidity",
                    "Health Score",
                    "Risk",
                    "Status",
                    "Last Updated",
                  ].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIPMENTS.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="group border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-5 py-5">
                      <p className="font-display font-bold tracking-tight">{s.id}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.batch}</p>
                    </td>
                    <td className="px-5 py-5">
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold">
                        {s.product}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 font-medium">
                      {s.origin} <span className="text-accent">→</span> {s.destination}
                    </td>
                    <td className="px-5 py-5">
                      <span className="tabular inline-flex items-center gap-1.5 font-semibold">
                        <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
                        {s.temperature.toFixed(1)}°C
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span className="tabular inline-flex items-center gap-1.5 font-semibold">
                        <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                        {s.humidity}%
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <span className="tabular w-8 font-display font-bold">{s.health}</span>
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <motion.span
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.health}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                            className={`block h-full rounded-full ${barTone[s.level]}`}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="tabular px-5 py-5 font-semibold">{s.risk}%</td>
                    <td className="px-5 py-5">
                      <LevelPill level={s.level}>{s.status}</LevelPill>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-xs text-muted-foreground">{s.updatedAgo}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
