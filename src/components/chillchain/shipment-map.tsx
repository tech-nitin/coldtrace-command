import { motion } from "framer-motion";
import { ROUTES, type RiskLevel } from "@/lib/ChillChain-data";
import { LiveDot, Reveal, Section, SectionHeading } from "./primitives";

const strokeFor: Record<RiskLevel, string> = {
  healthy: "var(--chart-2)",
  warning: "var(--chart-3)",
  critical: "var(--chart-4)",
};

/** Stylised India silhouette (percentage viewBox 0 0 100 100). */
const INDIA_PATH =
  "M31 12 L38 15 L44 13 L48 18 L55 17 L58 22 L64 21 L66 26 L72 27 L76 32 L74 38 L78 42 L74 46 L69 45 L66 49 L62 48 L60 53 L64 58 L61 63 L57 61 L54 66 L50 74 L46 84 L42 92 L38 84 L34 74 L30 66 L26 62 L22 57 L20 50 L23 44 L20 38 L23 33 L21 27 L25 22 L27 16 Z";

function curve(a: { x: number; y: number }, b: { x: number; y: number }, bend: number) {
  const mx = (a.x + b.x) / 2 + bend * 0.35;
  const my = (a.y + b.y) / 2 - Math.abs(bend) * 0.55;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function ShipmentMap() {
  return (
    <Section id="map">
      <SectionHeading
        eyebrow="Live Shipment Map"
        title={
          <>
            Every corridor, <span className="text-gradient-primary">watched in motion</span>.
          </>
        }
        description="Active cold-chain routes across India with health-coded markers streaming from onboard ESP32 gateways."
      />

      <Reveal delay={0.1} className="mt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-4 shadow-[var(--shadow-soft)]">
            <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "var(--gradient-canvas)" }} />
            <svg viewBox="0 0 100 100" className="relative h-[420px] w-full sm:h-[560px]" role="img" aria-label="Map of active shipment routes across India">
              <defs>
                <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              <motion.path
                d={INDIA_PATH}
                fill="url(#landGrad)"
                stroke="var(--chart-1)"
                strokeOpacity="0.45"
                strokeWidth="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />

              {ROUTES.map((r, i) => {
                const d = curve(r.a, r.b, r.bend);
                return (
                  <g key={r.id}>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={strokeFor[r.level]}
                      strokeOpacity="0.28"
                      strokeWidth="0.7"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.4 + i * 0.2 }}
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke={strokeFor[r.level]}
                      strokeWidth="0.7"
                      strokeLinecap="round"
                      strokeDasharray="3 8"
                      className="animate-dash"
                      style={{ animationDuration: `${5 + i}s` }}
                    />
                    <motion.circle
                      r="1.1"
                      fill={strokeFor[r.level]}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <animateMotion dur={`${7 + i * 1.5}s`} repeatCount="indefinite" path={d} />
                    </motion.circle>

                    {[r.a, r.b].map((p, k) => (
                      <g key={k}>
                        <circle cx={p.x} cy={p.y} r="2.6" fill={strokeFor[r.level]} opacity="0.15">
                          <animate attributeName="r" values="2.2;4.4;2.2" dur="2.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={p.x} cy={p.y} r="1.1" fill={strokeFor[r.level]} />
                      </g>
                    ))}
                    <text
                      x={r.b.x + 2}
                      y={r.b.y + 0.6}
                      fontSize="2.1"
                      fill="var(--muted-foreground)"
                      fontWeight="700"
                    >
                      {r.to}
                    </text>
                    <text x={r.a.x - 8.5} y={r.a.y - 1.6} fontSize="2.1" fill="var(--muted-foreground)" fontWeight="700">
                      {r.from}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-4">
            <div className="surface-panel rounded-2xl p-5">
              <p className="eyebrow">Marker legend</p>
              <ul className="mt-4 space-y-3 text-sm">
                {(["healthy", "warning", "critical"] as RiskLevel[]).map((l) => (
                  <li key={l} className="flex items-center gap-3">
                    <LiveDot level={l} />
                    <span className="font-semibold capitalize">{l}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {l === "healthy" ? "In safe band" : l === "warning" ? "Drifting" : "Breach active"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {ROUTES.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.6 }}
                whileHover={{ x: -4 }}
                className="surface-panel flex items-center justify-between rounded-2xl px-5 py-4"
              >
                <div>
                  <p className="font-display text-sm font-bold">
                    {r.from} → {r.to}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.id}</p>
                </div>
                <LiveDot level={r.level} />
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
