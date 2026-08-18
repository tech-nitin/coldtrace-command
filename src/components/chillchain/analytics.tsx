import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EXCURSIONS,
  HEALTH_TREND,
  RISK_DISTRIBUTION,
  humiditySeries,
  temperatureSeries,
} from "@/lib/ChillChain-data";
import { Reveal, Section, SectionHeading, useMounted } from "./primitives";

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  fontSize: 12,
  boxShadow: "var(--shadow-soft)",
} as const;

const axis = {
  tick: { fontSize: 11, fill: "var(--muted-foreground)" },
  axisLine: false,
  tickLine: false,
} as const;

const riskColors = ["var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function Panel({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface-panel rounded-[1.6rem] p-6 ${className ?? ""}`}>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-base font-bold tracking-tight">{title}</h3>
        {meta ? <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function Analytics() {
  const mounted = useMounted();
  const temp = temperatureSeries("7D", 2);
  const hum = humiditySeries("7D");

  if (!mounted) {
    return (
      <Section id="analytics">
        <div className="h-[500px] w-full animate-pulse rounded-[1.6rem] bg-muted/40" />
      </Section>
    );
  }

  return (
    <Section id="analytics">
      <SectionHeading
        eyebrow="Fleet Analytics"
        title={
          <>
            Patterns that predict <span className="text-gradient-primary">tomorrow's losses</span>.
          </>
        }
        description="Aggregated cold-chain analytics across the active fleet — trends, exposure and risk distribution in one reading."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Panel title="Temperature trends" meta="Last 7 days">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temp} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anaTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="t" {...axis} interval="preserveStartEnd" />
                  <YAxis {...axis} unit="°" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--chart-1)"
                    strokeWidth={2.4}
                    fill="url(#anaTemp)"
                    animationDuration={1800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel title="Risk distribution" meta="24 shipments">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Pie
                    data={RISK_DISTRIBUTION}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={64}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="var(--surface)"
                    strokeWidth={3}
                    animationDuration={1500}
                  >
                    {RISK_DISTRIBUTION.map((_, i) => (
                      <Cell key={i} fill={riskColors[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2 text-xs font-semibold">
              {RISK_DISTRIBUTION.map((r, i) => (
                <li key={r.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: riskColors[i] }} />
                  {r.name}
                  <span className="ml-auto tabular text-muted-foreground">{r.value}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel title="Humidity trends" meta="RH % vs dew point">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hum} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="t" {...axis} interval="preserveStartEnd" />
                  <YAxis {...axis} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="humidity" stroke="var(--chart-2)" strokeWidth={2.4} dot={false} animationDuration={1800} />
                  <Line
                    type="monotone"
                    dataKey="dew"
                    stroke="var(--chart-5)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.1}>
          <Panel title="Temperature excursions" meta="Per day">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXCURSIONS} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="excursions" radius={[8, 8, 0, 0]} animationDuration={1500}>
                    {EXCURSIONS.map((e, i) => (
                      <Cell key={i} fill={e.excursions >= 4 ? "var(--chart-4)" : e.excursions >= 3 ? "var(--chart-3)" : "var(--chart-2)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.15}>
          <Panel title="Unsafe exposure time" meta="Minutes / day">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EXCURSIONS} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="unsafeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis {...axis} unit="m" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="unsafe" stroke="var(--chart-4)" strokeWidth={2.4} fill="url(#unsafeFill)" animationDuration={1800} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-3">
          <Panel title="Shipment health trends" meta="Batch health vs fleet average">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HEALTH_TREND} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis {...axis} domain={[50, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="health" stroke="var(--chart-2)" strokeWidth={2.6} fill="url(#healthFill)" animationDuration={1800} />
                  <Line type="monotone" dataKey="fleet" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="6 6" dot={false} animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
