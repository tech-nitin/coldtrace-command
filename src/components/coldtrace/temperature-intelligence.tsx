import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Thermometer } from "lucide-react";
import { SHIPMENTS, temperatureSeries, type Range } from "@/lib/coldtrace-data";
import { Counter, LevelPill, Reveal, Section, SectionHeading, useMounted } from "./primitives";

const RANGES: Range[] = ["24H", "7D", "30D"];

export function TemperatureIntelligence() {
  const [range, setRange] = useState<Range>("24H");
  const [shipment, setShipment] = useState(SHIPMENTS[0]!.id);
  const mounted = useMounted();
  const seed = useMemo(() => shipment.charCodeAt(shipment.length - 1) % 9, [shipment]);
  const data = useMemo(() => temperatureSeries(range, seed), [range, seed]);
  const breaches = data.filter((d) => d.temp >= d.critical).length;

  return (
    <Section id="temperature">
      <SectionHeading
        eyebrow="Temperature Intelligence"
        title={
          <>
            One continuous truth about <span className="text-gradient-primary">every degree</span>.
          </>
        }
        description="Streamed from the SHT40 sensor every second, smoothed into a live thermal narrative with safe band, critical threshold and excursion detection."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-border bg-surface p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {range === r && (
                    <motion.span
                      layoutId="range-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className={range === r ? "relative text-primary-foreground" : "relative text-muted-foreground"}>
                    {r}
                  </span>
                </button>
              ))}
            </div>
            <select
              value={shipment}
              onChange={(e) => setShipment(e.target.value)}
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground outline-none transition-colors focus:border-accent"
            >
              {SHIPMENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.product}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <Reveal delay={0.1} className="mt-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-destructive/25 bg-destructive/5 p-7">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive/12 text-destructive">
                <Thermometer className="h-5 w-5" />
              </span>
              <p className="mt-6 font-display text-6xl font-bold tracking-tighter text-destructive">
                <Counter to={11.8} decimals={1} suffix="°C" />
              </p>
              <div className="mt-4">
                <LevelPill level="critical">Critical</LevelPill>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Threshold Breached
              </p>
            </div>
            <dl className="space-y-3 border-t border-destructive/20 pt-5 text-sm">
              {[
                ["Safe band", "2.0 – 8.0 °C"],
                ["Critical threshold", "10.0 °C"],
                ["Excursions detected", `${breaches || 3}`],
                ["Unsafe exposure", "47 min"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="tabular font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="surface-panel rounded-3xl p-4 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-accent" /> Current temperature
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-success/25" /> Safe operating range
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-destructive" /> Critical threshold
              </span>
            </div>
            <div className="h-[340px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
                    <defs>
                      <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="t"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, 14]}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      unit="°"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        fontSize: 12,
                        boxShadow: "var(--shadow-soft)",
                      }}
                      formatter={(v: number) => [`${v}°C`, "Temp"]}
                    />
                    <Area
                      dataKey="safeHigh"
                      stroke="none"
                      fill="var(--chart-1)"
                      fillOpacity={0.07}
                      animationDuration={1200}
                    />
                    <Area
                      dataKey="safeLow"
                      stroke="none"
                      fill="var(--surface)"
                      fillOpacity={1}
                      animationDuration={1200}
                    />
                    <ReferenceLine
                      y={10}
                      stroke="var(--chart-4)"
                      strokeDasharray="6 6"
                      label={{
                        value: "CRITICAL 10°C",
                        position: "insideTopRight",
                        fill: "var(--chart-4)",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="none"
                      fill="url(#tempFill)"
                      animationDuration={1800}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="var(--chart-2)"
                      strokeWidth={2.6}
                      dot={false}
                      activeDot={{ r: 5, fill: "var(--chart-2)" }}
                      animationDuration={2000}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full animate-pulse rounded-2xl bg-muted/50" />
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
