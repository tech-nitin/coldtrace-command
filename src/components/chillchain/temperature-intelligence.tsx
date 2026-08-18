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
import {
  AlertTriangle,
  BrainCircuit,
  Clock3,
  Flame,
  ShieldCheck,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import {
  SHIPMENTS,
  temperatureSeries,
  type Range,
} from "@/lib/ChillChain-data";
import {
  Counter,
  LevelPill,
  Reveal,
  Section,
  SectionHeading,
  useMounted,
} from "./primitives";

const RANGES: Range[] = ["24H", "7D", "30D"];

export function TemperatureIntelligence() {
  const [range, setRange] = useState<Range>("24H");
  const [shipment, setShipment] = useState(SHIPMENTS[0]!.id);

  const mounted = useMounted();

  const seed = useMemo(
    () => shipment.charCodeAt(shipment.length - 1) % 9,
    [shipment],
  );

  const data = useMemo(
    () => temperatureSeries(range, seed),
    [range, seed],
  );

  const breaches = data.filter(
    (d) => d.temp >= d.critical,
  ).length;

  const currentTemp = data[data.length - 1]?.temp ?? 11.8;
  const previousTemp =
    data[data.length - 2]?.temp ?? currentTemp;

  const temperatureRising = currentTemp > previousTemp;

  const safeHigh = 8;
  const criticalThreshold = 10;

  const aboveSafe = Math.max(
    0,
    currentTemp - safeHigh,
  );

  const risk =
    currentTemp >= criticalThreshold
      ? "HIGH"
      : currentTemp >= safeHigh
        ? "MEDIUM"
        : "LOW";

  return (
    <Section id="temperature">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

      <SectionHeading
        eyebrow="Temperature Intelligence"
        title={
          <>
            One continuous truth about{" "}
            <span className="text-gradient-primary">
              every degree.
            </span>
          </>
        }
        description="Real-time thermal intelligence from the SHT40 sensor. ChillChain tracks temperature drift, detects excursions and translates sensor data into actionable risk."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* RANGE */}

            <div className="flex rounded-full border border-border bg-surface p-1 shadow-sm">
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
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}

                  <span
                    className={
                      range === r
                        ? "relative text-primary-foreground"
                        : "relative text-muted-foreground"
                    }
                  >
                    {r}
                  </span>
                </button>
              ))}
            </div>

            {/* SHIPMENT */}

            <select
              value={shipment}
              onChange={(e) =>
                setShipment(e.target.value)
              }
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground outline-none transition-colors focus:border-accent"
            >
              {SHIPMENTS.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.id} · {s.product}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* -------------------------------------------------- */}
      {/* MAIN INTELLIGENCE */}
      {/* -------------------------------------------------- */}

      <Reveal
        delay={0.1}
        className="mt-12"
      >
        <div className="space-y-6">

          {/* TOP ROW */}

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* CURRENT TEMPERATURE */}

            <motion.div
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-3xl border border-destructive/20 bg-destructive/[0.045] p-7"
            >
              {/* glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-destructive/10 blur-3xl" />

              <div className="relative">

                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                    <Thermometer className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                    Live
                  </div>
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Current temperature
                </p>

                <p className="mt-2 font-display text-6xl font-bold tracking-tighter text-destructive">
                  <Counter
                    to={currentTemp}
                    decimals={1}
                    suffix="°C"
                  />
                </p>

                <div className="mt-4">
                  <LevelPill level="critical">
                    Critical
                  </LevelPill>
                </div>

                <div className="mt-5 rounded-2xl border border-destructive/15 bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" />

                    {aboveSafe > 0
                      ? `+${aboveSafe.toFixed(1)}°C above safe range`
                      : "Within safe range"}
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Temperature is currently{" "}
                    {temperatureRising
                      ? "rising"
                      : "stable"}
                    . ChillChain is monitoring the
                    shipment continuously.
                  </p>
                </div>

                {/* SAFE → CRITICAL SCALE */}

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Safe</span>
                    <span>Warning</span>
                    <span>Critical</span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div className="absolute inset-y-0 left-0 w-[57%] bg-success" />

                    <div className="absolute inset-y-0 left-[57%] w-[14%] bg-warning" />

                    <div className="absolute inset-y-0 right-0 w-[29%] bg-destructive/80" />

                    <motion.div
                      initial={{ left: "0%" }}
                      animate={{
                        left: `${Math.min(
                          97,
                          Math.max(
                            4,
                            (currentTemp / 14) * 100,
                          ),
                        )}%`,
                      }}
                      className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-md"
                    />
                  </div>
                </div>

                {/* DETAILS */}

                <dl className="mt-6 space-y-3 border-t border-destructive/15 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Safe band
                    </dt>
                    <dd className="font-semibold">
                      2.0 – 8.0°C
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Critical limit
                    </dt>
                    <dd className="font-semibold">
                      10.0°C
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Excursions
                    </dt>
                    <dd className="font-semibold">
                      {breaches || 3}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Unsafe exposure
                    </dt>
                    <dd className="font-semibold">
                      47 min
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>

            {/* GRAPH */}

            <motion.div
              whileHover={{ y: -2 }}
              className="surface-panel rounded-3xl p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />

                    <h3 className="font-display text-lg font-bold">
                      Temperature trajectory
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Live thermal behavior over the selected period
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Sensor live
                </div>
              </div>

              {/* LEGEND */}

              <div className="mb-4 flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-6 rounded-full bg-accent" />
                  Temperature
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-6 rounded-full bg-success/25" />
                  Safe band
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-6 rounded-full border-t-2 border-dashed border-destructive" />
                  Critical
                </span>
              </div>

              <div className="h-[370px] w-full">
                {mounted ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <ComposedChart
                      data={data}
                      margin={{
                        top: 10,
                        right: 20,
                        bottom: 0,
                        left: -10,
                      }}
                    >
                      <defs>

                        {/* Temperature gradient */}

                        <linearGradient
                          id="tempFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--chart-2)"
                            stopOpacity={0.3}
                          />

                          <stop
                            offset="100%"
                            stopColor="var(--chart-2)"
                            stopOpacity={0.01}
                          />
                        </linearGradient>

                        {/* Safe zone */}

                        <linearGradient
                          id="safeZone"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--chart-1)"
                            stopOpacity={0.12}
                          />

                          <stop
                            offset="100%"
                            stopColor="var(--chart-1)"
                            stopOpacity={0.03}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="var(--border)"
                        vertical={false}
                        strokeDasharray="3 5"
                      />

                      <XAxis
                        dataKey="t"
                        tick={{
                          fontSize: 10,
                          fill: "var(--muted-foreground)",
                        }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />

                      <YAxis
                        domain={[0, 14]}
                        tick={{
                          fontSize: 10,
                          fill: "var(--muted-foreground)",
                        }}
                        axisLine={false}
                        tickLine={false}
                        unit="°"
                      />

                      <Tooltip
                        cursor={{
                          stroke: "var(--accent)",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                        contentStyle={{
                          borderRadius: 16,
                          border:
                            "1px solid var(--border)",
                          background:
                            "var(--surface)",
                          fontSize: 12,
                          boxShadow:
                            "var(--shadow-soft)",
                        }}
                        formatter={(v: number) => [
                          `${v}°C`,
                          "Temperature",
                        ]}
                      />

                      {/* SAFE BAND */}

                      <Area
                        dataKey="safeHigh"
                        stroke="none"
                        fill="url(#safeZone)"
                        animationDuration={1000}
                      />

                      <Area
                        dataKey="safeLow"
                        stroke="none"
                        fill="var(--surface)"
                        fillOpacity={1}
                        animationDuration={1000}
                      />

                      {/* CRITICAL */}

                      <ReferenceLine
                        y={criticalThreshold}
                        stroke="var(--chart-4)"
                        strokeDasharray="7 6"
                        strokeWidth={1.5}
                        label={{
                          value: "CRITICAL · 10°C",
                          position: "insideTopRight",
                          fill: "var(--chart-4)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />

                      {/* TEMPERATURE AREA */}

                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="none"
                        fill="url(#tempFill)"
                        animationDuration={1500}
                      />

                      {/* TEMPERATURE LINE */}

                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="var(--chart-2)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: "var(--chart-2)",
                          stroke:
                            "var(--surface)",
                          strokeWidth: 3,
                        }}
                        animationDuration={1800}
                      />

                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full animate-pulse rounded-2xl bg-muted/50" />
                )}
              </div>
            </motion.div>
          </div>

          {/* -------------------------------------------------- */}
          {/* METRICS */}
          {/* -------------------------------------------------- */}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <MetricCard
              icon={Thermometer}
              label="Average temperature"
              value="6.8°C"
              detail="Within expected range"
            />

            <MetricCard
              icon={Flame}
              label="Peak temperature"
              value="11.8°C"
              detail="Critical excursion"
              danger
            />

            <MetricCard
              icon={AlertTriangle}
              label="Excursions detected"
              value={breaches || 3}
              detail="Requires attention"
            />

            <MetricCard
              icon={Clock3}
              label="Unsafe exposure"
              value="47 min"
              detail="Above critical limit"
              danger
            />
          </div>

          {/* -------------------------------------------------- */}
          {/* AI INSIGHT */}
          {/* -------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-7"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex gap-4">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
                  <BrainCircuit className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
                      AI Temperature Insight
                    </p>

                    <span className="rounded-full bg-destructive/20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-200">
                      {risk} risk
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-bold">
                    Temperature is{" "}
                    {temperatureRising
                      ? "trending upward."
                      : "currently stable."}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-foreground/70">
                    ChillChain detected {breaches || 3} temperature
                    excursions. The current reading is{" "}
                    {currentTemp.toFixed(1)}°C, which is{" "}
                    {aboveSafe.toFixed(1)}°C above the safe
                    operating range. Continued exposure may
                    increase spoilage risk.
                  </p>
                </div>
              </div>

              <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5">
                <ShieldCheck className="h-4 w-4" />
                View AI Analysis
              </button>

            </div>
          </motion.div>

        </div>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------- */
/* METRIC CARD */
/* -------------------------------------------------- */

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  danger = false,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string | number;
  detail: string;
  danger?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="surface-panel rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">

        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            danger
              ? "bg-destructive/10 text-destructive"
              : "bg-accent/10 text-accent"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        {danger && (
          <span className="h-2 w-2 rounded-full bg-destructive" />
        )}
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 font-display text-2xl font-bold ${
          danger
            ? "text-destructive"
            : "text-foreground"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {detail}
      </p>
    </motion.div>
  );
}