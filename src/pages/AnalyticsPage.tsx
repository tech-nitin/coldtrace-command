import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, animate } from "framer-motion";
import {
  AreaChart, Area, Line, ReferenceLine, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ComposedChart,
} from "recharts";
import {
  Thermometer, Droplets, TrendingUp, TrendingDown, AlertTriangle,
  ShieldCheck, IndianRupee, ChevronDown, Download, Radio, Truck,
  MapPin, Bell, LayoutDashboard, LineChart as LineChartIcon, Sparkles,
  PieChart as PieChartIcon, Route as RouteIcon, Activity, Satellite,
  Wifi, WifiOff, Signal, Gauge, ArrowUpRight, ChevronRight,
  Radar, Wrench, Brain,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = "http://localhost:5000";

const T = {
  cream: "#F6F3EA",
  creamSoft: "#FBFAF5",
  ink: "#132A20",
  inkSoft: "#3F5348",
  forest: "#0F3324",
  emerald: "#1E7A4C",
  emeraldBright: "#1FA35C",
  mint: "#E4F1E8",
  mintLine: "#CFE6D6",
  amber: "#C4842A",
  amberSoft: "#F6E7CF",
  red: "#B23B34",
  redSoft: "#F5DEDB",
  line: "#E4DFD1",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340;9..144,480;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
`;

const RANGE_META: Record<string, { points: number; label: (i: number) => string; unit: string }> = {
  "24H": { points: 24, label: (i) => `${String(i).padStart(2, "0")}:00`, unit: "hour" },
  "7D": { points: 7, label: (i) => ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], unit: "day" },
  "30D": { points: 30, label: (i) => `${i + 1}`, unit: "day" },
  "90D": { points: 12, label: (i) => `W${i + 1}`, unit: "week" },
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildTempSeries(range: string) {
  const meta = RANGE_META[range] || RANGE_META["24H"];
  const rnd = seededRandom(range.charCodeAt(0) * 17 + range.length);
  const base = 4.0;
  const safeLow = 2.0, safeHigh = 8.0, critical = 10.0;
  let excursions = 0;
  let unsafeMinutes = 0;
  const data = [];
  let current = base + rnd() * 1.2;
  for (let i = 0; i < meta.points; i++) {
    const drift = (i / meta.points) * 6.4;
    const noise = (rnd() - 0.45) * 1.1;
    current = base + drift + noise * (1 + i / meta.points);
    current = Math.max(1.5, current);
    const isExcursion = current > critical;
    if (isExcursion) {
      excursions += 1;
      unsafeMinutes += meta.unit === "hour" ? 12 + Math.round(rnd() * 20) : 4 + Math.round(rnd() * 6);
    }
    data.push({
      idx: i,
      label: meta.label(i),
      temp: Math.round(current * 10) / 10,
      safeLow, safeHigh, critical,
      humidity: Math.round(60 + rnd() * 22),
      risk: current > critical ? "High" : current > safeHigh ? "Elevated" : "Low",
    });
  }
  const avg = data.reduce((a, d) => a + d.temp, 0) / data.length;
  const peak = Math.max(...data.map((d) => d.temp));
  return {
    data,
    stats: {
      avg: Math.round(avg * 10) / 10,
      peak: Math.round(peak * 10) / 10,
      excursions: Math.max(excursions, range === "24H" ? 5 : Math.round(excursions * 0.8) + 2),
      unsafeMinutes: Math.max(unsafeMinutes, 20),
    },
  };
}

const PERIOD_COPY: Record<string, string> = {
  "24H": "vs previous 24 hours",
  "7D": "vs previous 7 days",
  "30D": "vs previous 30 days",
  "90D": "vs previous quarter",
};

const TOTAL_SHIPMENTS: Record<string, number> = { "24H": 24, "7D": 38, "30D": 74, "90D": 130 };

function buildRiskTrend(range: string) {
  const meta = RANGE_META[range] || RANGE_META["24H"];
  const rnd = seededRandom(range.length * 31 + 7);
  let low = 74, medium = 16, high = 7, critical = 3;
  const data = [];
  for (let i = 0; i < meta.points; i++) {
    const drift = i / meta.points;
    low = clamp(74 - drift * 16 + (rnd() - 0.5) * 3, 48, 80);
    medium = clamp(16 + drift * 7 + (rnd() - 0.5) * 2.4, 12, 28);
    high = clamp(7 + drift * 6 + (rnd() - 0.5) * 1.6, 5, 18);
    critical = clamp(100 - low - medium - high, 1, 12);
    const sum = low + medium + high + critical;
    data.push({
      label: meta.label(i),
      Low: Math.round((low / sum) * 1000) / 10,
      Medium: Math.round((medium / sum) * 1000) / 10,
      High: Math.round((high / sum) * 1000) / 10,
      Critical: Math.round((critical / sum) * 1000) / 10,
    });
  }
  return data;
}
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function buildRiskDistribution(range: string) {
  const trend = buildRiskTrend(range);
  const last = trend[trend.length - 1];
  const total = TOTAL_SHIPMENTS[range] || 24;
  const segments = [
    { key: "healthy", label: "Healthy", pct: last.Low, color: T.emerald },
    { key: "atRisk", label: "At Risk", pct: last.Medium, color: T.amber },
    { key: "highRisk", label: "High Risk", pct: last.High, color: "#B85C2E" },
    { key: "critical", label: "Critical", pct: last.Critical, color: T.red },
  ];
  return segments.map((s) => ({ ...s, count: Math.max(1, Math.round((s.pct / 100) * total)) }));
}

function routeTone(health: number) {
  if (health >= 88) return "good";
  if (health >= 74) return "warn";
  return "bad";
}

const SENSORS = [
  { id: "temp", name: "Temperature Sensor", model: "SHT40", icon: "temp", uptime: 99.2, quality: 98.6, issues: 1, lastComm: "12s ago", online: true },
  { id: "humidity", name: "Humidity Sensor", model: "SHT40", icon: "humidity", uptime: 98.7, quality: 96.4, issues: 0, lastComm: "12s ago", online: true },
  { id: "gps", name: "GPS Module", model: "ESP32 · u-blox", icon: "gps", uptime: 95.4, quality: 91.8, issues: 2, lastComm: "48s ago", online: true },
  { id: "accel", name: "Accelerometer", model: "MPU6050", icon: "accel", uptime: 88.1, quality: 84.2, issues: 4, lastComm: "6 min ago", online: false },
];
const sensorIcon: Record<string, any> = { temp: Thermometer, humidity: Droplets, gps: Satellite, accel: Activity };

const IMPACT_METRICS = [
  { value: 2.4, prefix: "₹", suffix: "L", decimals: 1, label: "Losses Prevented", note: "Estimated spoilage value averted this period" },
  { value: 18, suffix: "", decimals: 0, label: "High-Risk Shipments Intercepted", note: "Flagged and corrected before delivery" },
  { value: 96.4, suffix: "%", decimals: 1, label: "Cold-Chain Compliance", note: "Time spent within the safe temperature band" },
  { value: 42, suffix: "h", decimals: 0, label: "Potential Spoilage Avoided", note: "Cumulative exposure time prevented" },
];

function CountUp({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function Sparkline({ points, tone }: { points: number[]; tone: string }) {
  const w = 72, h = 26;
  const min = Math.min(...points), max = Math.max(...points);
  const span = max - min || 1;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const color = tone === "bad" ? T.red : tone === "warn" ? T.amber : T.emerald;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={path} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const toneStyles: Record<string, { fg: string; bg: string; border: string }> = {
  good: { fg: T.emerald, bg: T.mint, border: T.mintLine },
  warn: { fg: T.amber, bg: T.amberSoft, border: "#EAD3A5" },
  bad: { fg: T.red, bg: T.redSoft, border: "#E7C3BF" },
};

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Hero({ range, setRange, shipment, setShipment, shipmentsList }: any) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: T.line, background: `linear-gradient(180deg, #EFF4EE 0%, ${T.cream} 62%)` }}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #CFE6D6 0%, transparent 70%)" }}
      />
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-[1240px] px-4 pb-8 pt-10 sm:px-6 sm:pt-12"
      >
        <motion.div variants={heroItem} className="mb-5 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ borderColor: T.mintLine, background: T.mint, color: T.emerald }}
          >
            <motion.span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: T.emerald }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Analytics &amp; Intelligence
          </span>
          <span className="text-[11.5px] font-medium" style={{ color: T.inkSoft }}>
            Last updated {timeStr}
          </span>
        </motion.div>

        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[640px]">
            <motion.h1
              variants={heroItem}
              className="text-[38px] font-medium leading-[1.08] tracking-[-0.01em] sm:text-[46px]"
              style={{ fontFamily: "'Fraunces', serif", color: T.ink }}
            >
              Understand every pattern.
              <br />
              <span style={{ color: T.emerald }}>Prevent the next loss.</span>
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-4 max-w-[460px] text-[15.5px] leading-relaxed"
              style={{ color: T.inkSoft }}
            >
              Turn shipment and sensor data into actionable cold-chain intelligence.
            </motion.p>
          </div>

          <motion.div variants={heroItem} className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex items-center gap-0.5 rounded-full border p-1"
                style={{ borderColor: T.line, background: T.creamSoft }}
              >
                {Object.keys(RANGE_META).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className="relative rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
                    style={{ color: range === r ? "#fff" : T.inkSoft }}
                  >
                    {range === r && (
                      <motion.span
                        layoutId="range-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: T.forest }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{r}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <select
                  value={shipment}
                  onChange={(e) => setShipment(e.target.value)}
                  className="appearance-none rounded-full border py-2 pl-3.5 pr-8 text-[12.5px] font-medium outline-none"
                  style={{ borderColor: T.line, background: T.creamSoft, color: T.ink }}
                >
                  <option value="ALL">All Shipments</option>
                  {shipmentsList.map((s: any) => (
                    <option key={s.shipmentId || s.id} value={s.shipmentId || s.id}>
                      {s.shipmentId || s.id} · {s.cargoType || "Cargo"}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: T.inkSoft }}
                />
              </div>

              <button
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-[1px]"
                style={{ background: T.emerald }}
              >
                <Download size={13} />
                Export Report
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const kpiIcon: Record<string, any> = {
  health: ShieldCheck,
  excursions: Thermometer,
  onTime: TrendingUp,
  atRisk: AlertTriangle,
  savings: IndianRupee,
};

function KpiCard({ kpi, range, index }: any) {
  const styles = toneStyles[kpi.tone] || toneStyles.good;
  const Icon = kpiIcon[kpi.key] || ShieldCheck;
  const DirIcon = kpi.dir === "up" ? TrendingUp : TrendingDown;
  const isGoodDelta = kpi.key === "excursions" || kpi.key === "atRisk" ? kpi.dir === "down" : kpi.dir === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="group relative rounded-[20px] border p-5 transition-shadow"
      style={{ borderColor: T.line, background: T.creamSoft, boxShadow: "0 1px 2px rgba(19,42,32,0.03)" }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[11px] transition-colors"
          style={{ background: styles.bg, color: styles.fg }}
        >
          <Icon size={16} strokeWidth={2.1} />
        </div>
        <Sparkline points={kpi.spark || [1,2,3]} tone={kpi.tone} />
      </div>

      <div className="text-[11.5px] font-medium" style={{ color: T.inkSoft }}>
        {kpi.label}
      </div>
      <div
        className="mt-1.5 text-[27px] font-medium tracking-[-0.01em]"
        style={{ fontFamily: "'Fraunces', serif", color: T.ink }}
      >
        <CountUp value={kpi.value} decimals={kpi.key === "onTime" || kpi.key === "savings" ? 1 : 0} prefix={kpi.prefix || ""} />
        <span className="text-[16px]" style={{ color: T.inkSoft }}>{kpi.suffix}</span>
      </div>

      <div
        className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
        style={{
          color: isGoodDelta ? T.emerald : T.red,
          background: isGoodDelta ? T.mint : T.redSoft,
        }}
      >
        <DirIcon size={11} />
        {kpi.delta}% <span className="font-normal" style={{ color: T.inkSoft, marginLeft: 2 }}>{PERIOD_COPY[range]}</span>
      </div>

      <div
        className="absolute inset-x-5 bottom-0 h-[2px] scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: styles.fg, transformOrigin: "left" }}
      />
    </motion.div>
  );
}

function KpiStrip({ range, kpis }: { range: string; kpis: any[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-9">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
            KPI Intelligence
          </div>
          <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
            The numbers behind cold-chain performance
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <KpiCard key={k.key} kpi={k} range={range} index={i} />
        ))}
      </div>
    </section>
  );
}

function TemperatureChart({ range, liveTelemetry }: { range: string; liveTelemetry: any }) {
  const { data, stats } = useMemo(() => buildTempSeries(range), [range]);

  const currentTemp = Number(liveTelemetry?.temperature ?? data[data.length - 1].temp).toFixed(1);
  const isCritical = Number(currentTemp) > 10.0;

  return (
    <section className="mx-auto max-w-[1240px] px-4 pb-8 sm:px-6 sm:pb-9">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
        Temperature Intelligence
      </div>
      <h2 className="mt-1 max-w-[520px] text-[26px] font-medium leading-tight" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
        One continuous truth about every degree.
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div
          className="flex flex-col rounded-[20px] border p-5"
          style={{
            borderColor: isCritical ? "#E9C9C4" : T.line,
            background: isCritical ? "linear-gradient(180deg,#FBEFEC 0%, #F8E3DF 100%)" : T.creamSoft,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: isCritical ? T.red : T.emerald }}>
              <Thermometer size={13} /> CURRENT TEMPERATURE
            </div>
            <span className="flex items-center gap-1 text-[10.5px] font-semibold" style={{ color: T.inkSoft }}>
              <Radio size={11} /> LIVE
            </span>
          </div>
          <div className="mt-3 text-[42px] font-medium leading-none" style={{ fontFamily: "'Fraunces', serif", color: isCritical ? T.red : T.emerald }}>
            {currentTemp}°C
          </div>
          <span
            className="mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ background: isCritical ? T.red : T.emerald, color: "#fff" }}
          >
            {isCritical ? "Critical" : "Healthy"}
          </span>
        </div>

        <div className="rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
              <LineChartIcon size={15} style={{ color: T.emerald }} />
              Temperature Trajectory
            </div>
          </div>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
                <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: T.inkSoft }} axisLine={{ stroke: T.line }} />
                <YAxis tick={{ fontSize: 10.5, fill: T.inkSoft }} domain={[0, 14]} tickFormatter={(v) => `${v}°`} width={34} />
                <Line type="monotone" dataKey="temp" stroke={T.emerald} strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

const RISK_SERIES = [
  { key: "Low", color: T.emerald, fill: "url(#riskLow)" },
  { key: "Medium", color: T.amber, fill: "url(#riskMedium)" },
  { key: "High", color: "#B85C2E", fill: "url(#riskHigh)" },
  { key: "Critical", color: T.red, fill: "url(#riskCritical)" },
];

function RiskTrendChart({ range }: { range: string }) {
  const data = useMemo(() => buildRiskTrend(range), [range]);
  return (
    <div className="rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
          <Gauge size={15} style={{ color: T.emerald }} /> Risk Trend
        </div>
      </div>
      <div className="mb-3 text-[12px]" style={{ color: T.inkSoft }}>
        Share of shipments by risk tier over the selected period
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
            <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: T.inkSoft }} />
            <YAxis tick={{ fontSize: 10.5, fill: T.inkSoft }} tickFormatter={(v) => `${v}%`} width={36} domain={[0, 100]} />
            {RISK_SERIES.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} stackId="risk" stroke={s.color} fill={s.color} fillOpacity={0.15} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RiskDonut({ range }: { range: string }) {
  const segments = useMemo(() => buildRiskDistribution(range), [range]);
  return (
    <div className="flex flex-col rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
      <div className="mb-1 flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
        <PieChartIcon size={15} style={{ color: T.emerald }} /> Risk Distribution
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.key} className="flex justify-between items-center text-[12.5px]">
            <span className="flex items-center gap-2" style={{ color: T.ink }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.label}
            </span>
            <span className="font-semibold">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskIntelligence({ range }: { range: string }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-9">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Risk Intelligence</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Where risk is building, and where it's easing</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <RiskTrendChart range={range} />
        <RiskDonut range={range} />
      </div>
    </section>
  );
}

function RoutePerformance({ routes }: { routes: any[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-9">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Route Performance</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Which corridors are performing, which need attention</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {routes.map((route, i) => (
          <div key={i} className="flex justify-between items-center rounded-[16px] border p-4" style={{ borderColor: T.line, background: T.creamSoft }}>
            <div className="flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: T.ink }}>
              <RouteIcon size={14} style={{ color: T.emerald }} />
              {route.from} <ChevronRight size={13} style={{ color: T.inkSoft }} /> {route.to}
            </div>
            <span className="font-semibold" style={{ color: route.health < 75 ? T.red : T.emerald }}>Health {route.health}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SensorIntelligence({ sensors }: { sensors: any[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-9">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Sensor Intelligence</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Every device, monitored like infrastructure</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sensors.map((s) => {
          const Icon = sensorIcon[s.icon] || Activity;
          return (
            <div key={s.id} className="rounded-[16px] border p-4" style={{ borderColor: T.line, background: T.creamSoft }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: T.emerald }} />
                  <span className="text-[13px] font-semibold">{s.name}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Online</span>
              </div>
              <div className="mt-3 text-[11px]" style={{ color: T.inkSoft }}>Uptime: {s.uptime}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AIPatternDetected() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-9">
      <div className="relative overflow-hidden rounded-[24px] p-6 sm:p-8" style={{ background: `linear-gradient(155deg, ${T.forest} 0%, #0B2A1D 100%)` }}>
        <div className="flex items-center gap-2.5 text-white/85 text-[13px] font-semibold uppercase tracking-[0.1em]">
          <Brain size={17} color="#fff" /> AI Pattern Detected
        </div>
        <h3 className="mt-3 max-w-[620px] text-[24px] font-medium leading-snug text-white" style={{ fontFamily: "'Fraunces', serif" }}>
          Temperature excursions are increasing on the <span style={{ color: T.emeraldBright }}>Mumbai → Pune</span> corridor.
        </h3>
      </div>
    </section>
  );
}

function LossPrevention({ impact }: { impact: any[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[640px] text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Business Impact</div>
        <h2 className="mt-2 text-[28px] font-medium leading-tight sm:text-[32px]" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Measure what ChillChain prevented.</h2>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: T.line, background: T.line }}>
        {impact.map((m, i) => (
          <div key={i} className="flex flex-col items-center px-6 py-7 text-center" style={{ background: T.creamSoft }}>
            <div className="text-[38px] font-medium leading-none" style={{ fontFamily: "'Fraunces', serif", color: T.forest }}>
              <CountUp value={m.value} decimals={m.decimals || 0} prefix={m.prefix || ""} suffix={m.suffix || ""} />
            </div>
            <div className="mt-3 text-[13px] font-semibold" style={{ color: T.ink }}>{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("24H");
  const [shipment, setShipment] = useState("ALL");
  const [shipmentsList, setShipmentsList] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/analytics?range=${range}&shipmentId=${shipment}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setAnalyticsData(resData.data);
      })
      .catch((err) => console.error("Analytics fetch error:", err));

    fetch(`${API_BASE_URL}/api/v1/shipments`)
      .then((res) => res.json())
      .then((resData) => {
        const raw = resData.data || resData;
        if (Array.isArray(raw)) setShipmentsList(raw);
      })
      .catch((err) => console.error("Shipments fetch error:", err));
  }, [range, shipment]);

  useEffect(() => {
    const socket: Socket = io(API_BASE_URL);

    socket.on("telemetry_update", (data: any) => {
      if (shipment === "ALL" || shipment === data.shipmentId) {
        setLiveTelemetry(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [shipment]);

  const kpis = analyticsData?.kpis || [];
  const routes = analyticsData?.routes || [];
  const sensors = analyticsData?.sensors || SENSORS;
  const impact = analyticsData?.impact || IMPACT_METRICS;

  return (
    <div className="overflow-x-hidden" style={{ background: T.cream, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{fontImport}</style>
      <Hero
        range={range}
        setRange={setRange}
        shipment={shipment}
        setShipment={setShipment}
        shipmentsList={shipmentsList}
      />
      <KpiStrip range={range} kpis={kpis} />
      <TemperatureChart range={range} liveTelemetry={liveTelemetry} />
      {/* <RiskIntelligence range={range} /> */}
      {/* <RoutePerformance routes={routes} /> */}
      {/* <SensorIntelligence sensors={sensors} /> */}
      {/* <AIPatternDetected /> */}
      {/* <LossPrevention impact={impact} /> */}
      
      <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-2 text-center text-[11.5px]" style={{ color: T.inkSoft }}>
        ChillChain AI · Operational Analytics Active
      </div>
    </div>
  );
}