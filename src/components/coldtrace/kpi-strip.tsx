import { motion } from "framer-motion";
import { KPIS } from "@/lib/coldtrace-data";
import { Counter } from "./primitives";

const tone = {
  neutral: { bar: "bg-border-strong", text: "text-foreground" },
  healthy: { bar: "bg-success", text: "text-success" },
  warning: { bar: "bg-warning", text: "text-warning-foreground" },
  critical: { bar: "bg-destructive", text: "text-destructive" },
} as const;

export function KpiStrip() {
  return (
    <div className="border-y border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 md:grid-cols-3 lg:grid-cols-5">
        {KPIS.map((kpi, i) => {
          const t = tone[kpi.tone];
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative px-2 py-8 lg:px-6"
            >
              <span
                className={`absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 ${t.bar} opacity-30 lg:block`}
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {kpi.label}
              </p>
              <p className={`mt-3 font-display text-4xl font-bold tracking-tight ${t.text}`}>
                <Counter to={kpi.value} suffix={kpi.suffix} />
              </p>
              <span
                className={`mt-4 block h-1 w-10 origin-left rounded-full ${t.bar} transition-transform duration-500 group-hover:scale-x-[2.4]`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
