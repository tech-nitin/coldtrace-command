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

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS  (matched to the ChillChain AI dashboard)
   ───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   MOCK DATA  (kept separate from UI so it can be swapped for an API)
   ───────────────────────────────────────────────────────────── */
const RANGE_META = {
  "24H": { points: 24, label: (i) => `${String(i).padStart(2, "0")}:00`, unit: "hour" },
  "7D": { points: 7, label: (i) => ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], unit: "day" },
  "30D": { points: 30, label: (i) => `${i + 1}`, unit: "day" },
  "90D": { points: 12, label: (i) => `W${i + 1}`, unit: "week" },
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildTempSeries(range) {
  const meta = RANGE_META[range];
  const rnd = seededRandom(range.charCodeAt(0) * 17 + range.length);
  const base = 4.0;
  const safeLow = 2.0, safeHigh = 8.0, critical = 10.0;
  let excursions = 0;
  let unsafeMinutes = 0;
  const data = [];
  let current = base + rnd() * 1.2;
  for (let i = 0; i < meta.points; i++) {
    const drift = (i / meta.points) * 6.4; // gradual upward drift, mirrors the reference chart
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

const KPI_BASE = {
  "24H": [
    { key: "health", label: "Average Shipment Health", value: 86, suffix: "/100", delta: 4.2, dir: "up", tone: "good", spark: [78,80,79,82,84,83,85,86] },
    { key: "excursions", label: "Temperature Excursions", value: 12, suffix: "", delta: 18.0, dir: "up", tone: "bad", spark: [6,7,7,9,10,9,11,12] },
    { key: "onTime", label: "On-Time Delivery", value: 94.6, suffix: "%", delta: 1.1, dir: "up", tone: "good", spark: [91,92,92,93,93,94,94.2,94.6] },
    { key: "atRisk", label: "At-Risk Shipments", value: 3, suffix: "", delta: 1, dir: "up", tone: "warn", spark: [1,1,2,2,2,3,3,3] },
    { key: "savings", label: "Losses Prevented", value: 2.4, prefix: "₹", suffix: "L", delta: 12.8, dir: "up", tone: "good", spark: [1.4,1.6,1.7,1.9,2.0,2.1,2.3,2.4] },
  ],
};
function scaleKpis(range) {
  const mult = { "24H": 1, "7D": 1.6, "30D": 3.1, "90D": 5.4 }[range];
  return KPI_BASE["24H"].map((k) => {
    if (k.key === "onTime" || k.key === "health") return { ...k };
    const scaled = k.key === "savings" ? Math.round(k.value * mult * 10) / 10 : Math.round(k.value * mult);
    return { ...k, value: scaled };
  });
}

const PERIOD_COPY = {
  "24H": "vs previous 24 hours",
  "7D": "vs previous 7 days",
  "30D": "vs previous 30 days",
  "90D": "vs previous quarter",
};

const TOTAL_SHIPMENTS = { "24H": 24, "7D": 38, "30D": 74, "90D": 130 };

/* ---- Risk Trend (stacked, responds to the global time filter) ---- */
function buildRiskTrend(range) {
  const meta = RANGE_META[range];
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
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

/* ---- Risk Distribution (donut) ---- */
function buildRiskDistribution(range) {
  const trend = buildRiskTrend(range);
  const last = trend[trend.length - 1];
  const total = TOTAL_SHIPMENTS[range];
  const segments = [
    { key: "healthy", label: "Healthy", pct: last.Low, color: T.emerald },
    { key: "atRisk", label: "At Risk", pct: last.Medium, color: T.amber },
    { key: "highRisk", label: "High Risk", pct: last.High, color: "#B85C2E" },
    { key: "critical", label: "Critical", pct: last.Critical, color: T.red },
  ];
  return segments.map((s) => ({ ...s, count: Math.max(1, Math.round((s.pct / 100) * total)) }));
}

/* ---- Route Performance ---- */
const ROUTES = [
  { id: "idr-bpl", from: "Indore", to: "Bhopal", health: 92, onTime: 97, shipments: 12, excursions: 1, avgTemp: 4.6 },
  { id: "jai-idr", from: "Jaipur", to: "Indore", health: 81, onTime: 91, shipments: 8, excursions: 2, avgTemp: 5.4 },
  { id: "idr-del", from: "Indore", to: "Delhi", health: 75, onTime: 88, shipments: 14, excursions: 3, avgTemp: 6.1 },
  { id: "bpl-jai", from: "Bhopal", to: "Jaipur", health: 70, onTime: 89, shipments: 7, excursions: 3, avgTemp: 6.4 },
  { id: "mum-pun", from: "Mumbai", to: "Pune", health: 68, onTime: 86, shipments: 9, excursions: 4, avgTemp: 6.9 },
];
function routeTone(health) {
  if (health >= 88) return "good";
  if (health >= 74) return "warn";
  return "bad";
}

/* ---- Sensor Intelligence ---- */
const SENSORS = [
  { id: "temp", name: "Temperature Sensor", model: "SHT40", icon: "temp", uptime: 99.2, quality: 98.6, issues: 1, lastComm: "12s ago", online: true },
  { id: "humidity", name: "Humidity Sensor", model: "SHT40", icon: "humidity", uptime: 98.7, quality: 96.4, issues: 0, lastComm: "12s ago", online: true },
  { id: "gps", name: "GPS Module", model: "ESP32 · u-blox", icon: "gps", uptime: 95.4, quality: 91.8, issues: 2, lastComm: "48s ago", online: true },
  { id: "accel", name: "Accelerometer", model: "MPU6050", icon: "accel", uptime: 88.1, quality: 84.2, issues: 4, lastComm: "6 min ago", online: false },
];
const sensorIcon = { temp: Thermometer, humidity: Droplets, gps: Satellite, accel: Activity };

/* ─────────────────────────────────────────────────────────────
   SMALL PRIMITIVES
   ───────────────────────────────────────────────────────────── */
function CountUp({ value, decimals = 0, prefix = "", suffix = "" }) {
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
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function Sparkline({ points, tone }) {
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

const toneStyles = {
  good: { fg: T.emerald, bg: T.mint, border: T.mintLine },
  warn: { fg: T.amber, bg: T.amberSoft, border: "#EAD3A5" },
  bad: { fg: T.red, bg: T.redSoft, border: "#E7C3BF" },
};


/* ─────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Hero({ range, setRange, shipment, setShipment }) {
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
        className="relative mx-auto max-w-[1240px] px-6 pb-10 pt-14"
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
                  <option>All Shipments</option>
                  <option>CG-10458 · Fruits</option>
                  <option>CG-10431 · Dairy</option>
                  <option>CG-10428 · Seafood</option>
                  <option>CG-10417 · Vaccines</option>
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

/* ─────────────────────────────────────────────────────────────
   KPI STRIP
   ───────────────────────────────────────────────────────────── */
const kpiIcon = {
  health: ShieldCheck,
  excursions: Thermometer,
  onTime: TrendingUp,
  atRisk: AlertTriangle,
  savings: IndianRupee,
};

function KpiCard({ kpi, range, index }) {
  const styles = toneStyles[kpi.tone];
  const Icon = kpiIcon[kpi.key];
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
        <Sparkline points={kpi.spark} tone={kpi.tone} />
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

function KpiStrip({ range }) {
  const kpis = useMemo(() => scaleKpis(range), [range]);
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-5 flex items-center justify-between">
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

/* ─────────────────────────────────────────────────────────────
   TEMPERATURE INTELLIGENCE — hero visualization
   ───────────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, range }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const riskColor = d.risk === "High" ? T.red : d.risk === "Elevated" ? T.amber : T.emerald;
  return (
    <div
      className="rounded-[14px] border px-4 py-3 shadow-lg"
      style={{ borderColor: T.line, background: "#fff", minWidth: 190 }}
    >
      <div className="text-[11px] font-semibold" style={{ color: T.inkSoft }}>
        {range === "24H" ? `Today, ${label}` : label}
      </div>
      <div className="mt-2 space-y-1.5 text-[12.5px]">
        <div className="flex items-center justify-between gap-6">
          <span style={{ color: T.inkSoft }}>Temperature</span>
          <span className="font-semibold" style={{ color: T.ink }}>{d.temp}°C</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span style={{ color: T.inkSoft }}>Humidity</span>
          <span className="font-semibold" style={{ color: T.ink }}>{d.humidity}%</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span style={{ color: T.inkSoft }}>Risk</span>
          <span className="font-semibold" style={{ color: riskColor }}>{d.risk}</span>
        </div>
        {d.temp > d.critical && (
          <div className="flex items-center justify-between gap-6">
            <span style={{ color: T.inkSoft }}>Excursion</span>
            <span className="font-semibold" style={{ color: T.red }}>
              {18 + Math.round((d.temp - d.critical) * 9)} min
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveDot(props) {
  const { cx, cy, payload } = props;
  if (cx == null) return null;
  const isExcursion = payload.temp > payload.critical;
  return (
    <circle
      cx={cx} cy={cy} r={4.5}
      fill={isExcursion ? T.red : T.emerald}
      stroke="#fff" strokeWidth={2}
    />
  );
}

function TemperatureChart({ range }) {
  const { data, stats } = useMemo(() => buildTempSeries(range), [range]);
  const statCards = [
    { label: "Average Temperature", value: `${stats.avg}°C`, note: "Within expected range", icon: Thermometer, tone: "good" },
    { label: "Peak Temperature", value: `${stats.peak}°C`, note: "Critical excursion", icon: TrendingUp, tone: "bad" },
    { label: "Excursions Detected", value: stats.excursions, note: "Requires attention", icon: AlertTriangle, tone: "warn" },
    { label: "Unsafe Exposure", value: `${stats.unsafeMinutes} min`, note: "Above critical limit", icon: Droplets, tone: "bad" },
  ];

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-6">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
        Temperature Intelligence
      </div>
      <h2 className="mt-1 max-w-[520px] text-[26px] font-medium leading-tight" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
        One continuous truth about every degree.
      </h2>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed" style={{ color: T.inkSoft }}>
        Real-time thermal behaviour from the shipment's cold-chain sensor, translated into
        drift, excursions and actionable risk.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Left: current reading card */}
        <motion.div
          key={`side-${range}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col rounded-[20px] border p-5"
          style={{ borderColor: "#E9C9C4", background: "linear-gradient(180deg,#FBEFEC 0%, #F8E3DF 100%)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: T.red }}>
              <Thermometer size={13} /> CURRENT TEMPERATURE
            </div>
            <span className="flex items-center gap-1 text-[10.5px] font-semibold" style={{ color: T.inkSoft }}>
              <Radio size={11} /> LIVE
            </span>
          </div>
          <div className="mt-3 text-[42px] font-medium leading-none" style={{ fontFamily: "'Fraunces', serif", color: T.red }}>
            {data[data.length - 1].temp}°C
          </div>
          <span
            className="mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ background: T.red, color: "#fff" }}
          >
            Critical
          </span>

          <div className="mt-4 rounded-[13px] border bg-white/60 p-3 text-[12px] leading-snug" style={{ borderColor: "#EAD0CC", color: T.inkSoft }}>
            <span className="font-semibold" style={{ color: T.ink }}>
              +{(data[data.length - 1].temp - 8).toFixed(1)}°C above safe range.
            </span>{" "}
            ChillChain is monitoring the shipment continuously.
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "#EFDAD6" }}>
            <div className="flex h-full w-full">
              <div className="h-full" style={{ width: "38%", background: T.emerald }} />
              <div className="h-full" style={{ width: "27%", background: T.amber }} />
              <div className="h-full" style={{ width: "35%", background: T.red }} />
            </div>
          </div>
          <div className="mt-1.5 flex justify-between text-[9.5px] font-semibold uppercase tracking-wide" style={{ color: T.inkSoft }}>
            <span>Safe</span><span>Warning</span><span>Critical</span>
          </div>

          <div className="mt-4 space-y-2.5 border-t pt-4 text-[12.5px]" style={{ borderColor: "#EAD0CC" }}>
            <div className="flex justify-between"><span style={{ color: T.inkSoft }}>Safe band</span><span className="font-semibold" style={{ color: T.ink }}>2.0 – 8.0°C</span></div>
            <div className="flex justify-between"><span style={{ color: T.inkSoft }}>Critical limit</span><span className="font-semibold" style={{ color: T.ink }}>10.0°C</span></div>
            <div className="flex justify-between"><span style={{ color: T.inkSoft }}>Excursions</span><span className="font-semibold" style={{ color: T.red }}>{stats.excursions}</span></div>
            <div className="flex justify-between"><span style={{ color: T.inkSoft }}>Unsafe exposure</span><span className="font-semibold" style={{ color: T.red }}>{stats.unsafeMinutes} min</span></div>
          </div>
        </motion.div>

        {/* Right: chart */}
        <div className="rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
              <LineChartIcon size={15} style={{ color: T.emerald }} />
              Temperature Trajectory
            </div>
            <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: T.mint, color: T.emerald }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.emerald }} />
              Sensor Live
            </span>
          </div>
          <div className="mb-3 text-[12px]" style={{ color: T.inkSoft }}>
            Live thermal behaviour over the selected period
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={range}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ width: "100%", height: 300 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="safeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.emerald} stopOpacity={0.16} />
                      <stop offset="100%" stopColor={T.emerald} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10.5, fill: T.inkSoft }}
                    axisLine={{ stroke: T.line }}
                    tickLine={false}
                    interval={range === "30D" ? 3 : range === "24H" ? 2 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 10.5, fill: T.inkSoft }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 14]}
                    tickFormatter={(v) => `${v}°`}
                    width={34}
                  />
                  <ReferenceLine y={10} stroke={T.red} strokeDasharray="5 4" strokeWidth={1.4}
                    label={{ value: "Critical · 10°C", position: "insideTopRight", fontSize: 10, fill: T.red, fontWeight: 600 }} />
                  <ReferenceLine y={8} stroke={T.emerald} strokeOpacity={0.35} strokeWidth={1} />
                  <ReferenceLine y={2} stroke={T.emerald} strokeOpacity={0.35} strokeWidth={1} />
                  <Tooltip content={<ChartTooltip range={range} />} />
                  <Area
                    type="monotone"
                    dataKey="safeHigh"
                    stroke="none"
                    fill="url(#safeFill)"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke={T.emerald}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={<ActiveDot />}
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-[11.5px]" style={{ color: T.inkSoft }}>
            <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: T.emerald }} /> Temperature</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm" style={{ background: T.mint }} /> Safe band</span>
            <span className="flex items-center gap-1.5"><span className="h-[2px] w-4 border-t-2 border-dashed" style={{ borderColor: T.red }} /> Critical</span>
          </div>
        </div>
      </div>

      {/* stat cards below chart */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const st = toneStyles[s.tone];
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-[16px] border p-4"
              style={{ borderColor: T.line, background: T.creamSoft }}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px]" style={{ background: st.bg, color: st.fg }}>
                  <Icon size={14} />
                </div>
                {s.tone !== "good" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.fg }} />}
              </div>
              <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: T.inkSoft }}>
                {s.label}
              </div>
              <div className="mt-1 text-[21px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
                {s.value}
              </div>
              <div className="mt-0.5 text-[11.5px]" style={{ color: T.inkSoft }}>{s.note}</div>
            </motion.div>
          );
        })}
      </div>

      {/* AI insight banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5 }}
        className="mt-5 flex flex-col justify-between gap-4 rounded-[18px] p-6 sm:flex-row sm:items-center"
        style={{ background: T.forest }}
      >
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]" style={{ background: "rgba(255,255,255,0.12)" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white">Temperature is trending upward</span>
              <span className="rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide" style={{ background: T.red, color: "#fff" }}>
                High Risk
              </span>
            </div>
            <p className="mt-1 max-w-[560px] text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              ChillChain detected {stats.excursions} temperature excursions in the selected window. The
              latest reading is {data[data.length - 1].temp}°C, {(data[data.length - 1].temp - 8).toFixed(1)}°C
              above the safe operating range. Continued exposure may increase spoilage risk.
            </p>
          </div>
        </div>
        <button className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold sm:self-center" style={{ color: T.forest }}>
          View AI Analysis →
        </button>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   RISK INTELLIGENCE — trend (left) + donut (right)
   ───────────────────────────────────────────────────────────── */
const RISK_SERIES = [
  { key: "Low", color: T.emerald, fill: "url(#riskLow)" },
  { key: "Medium", color: T.amber, fill: "url(#riskMedium)" },
  { key: "High", color: "#B85C2E", fill: "url(#riskHigh)" },
  { key: "Critical", color: T.red, fill: "url(#riskCritical)" },
];

function RiskTrendTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-[14px] border px-4 py-3 shadow-lg" style={{ borderColor: T.line, background: "#fff", minWidth: 168 }}>
      <div className="text-[11px] font-semibold" style={{ color: T.inkSoft }}>{label}</div>
      <div className="mt-2 space-y-1.5 text-[12px]">
        {RISK_SERIES.map((s) => {
          const v = payload.find((p) => p.dataKey === s.key)?.value;
          if (v == null) return null;
          return (
            <div key={s.key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5" style={{ color: T.inkSoft }}>
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.key}
              </span>
              <span className="font-semibold" style={{ color: T.ink }}>{v}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiskTrendChart({ range }) {
  const data = useMemo(() => buildRiskTrend(range), [range]);
  return (
    <div className="rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
          <Gauge size={15} style={{ color: T.emerald }} />
          Risk Trend
        </div>
      </div>
      <div className="mb-3 text-[12px]" style={{ color: T.inkSoft }}>
        Share of shipments by risk tier over the selected period
      </div>

      <div className="mb-3 flex flex-wrap gap-4 text-[11.5px]" style={{ color: T.inkSoft }}>
        {RISK_SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.key}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={range}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: "100%", height: 260 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="riskLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.emerald} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={T.emerald} stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="riskMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.amber} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={T.amber} stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="riskHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B85C2E" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#B85C2E" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="riskCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.red} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={T.red} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10.5, fill: T.inkSoft }}
                axisLine={{ stroke: T.line }}
                tickLine={false}
                interval={range === "30D" ? 3 : range === "24H" ? 2 : 0}
              />
              <YAxis
                tick={{ fontSize: 10.5, fill: T.inkSoft }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={36}
                domain={[0, 100]}
              />
              <Tooltip content={<RiskTrendTooltip />} />
              {RISK_SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stackId="risk"
                  stroke={s.color}
                  strokeWidth={1.4}
                  fill={s.fill}
                  animationDuration={850}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RiskDonut({ range }) {
  const segments = useMemo(() => buildRiskDistribution(range), [range]);
  const [active, setActive] = useState(null);
  const R = 72, STROKE = 26, CX = 110, CY = 110;
  const CIRC = 2 * Math.PI * R;

  let cumulative = 0;
  const arcs = segments.map((s) => {
    const len = (s.pct / 100) * CIRC;
    const offset = -cumulative;
    cumulative += len;
    return { ...s, len, offset };
  });

  const activeSeg = active != null ? segments[active] : null;

  return (
    <div className="flex flex-col rounded-[20px] border p-5" style={{ borderColor: T.line, background: T.creamSoft }}>
      <div className="mb-1 flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: T.ink }}>
        <PieChartIcon size={15} style={{ color: T.emerald }} />
        Risk Distribution
      </div>
      <div className="mb-2 text-[12px]" style={{ color: T.inkSoft }}>
        Current snapshot across {TOTAL_SHIPMENTS[range]} shipments
      </div>

      <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row">
        <motion.svg
          width="220" height="220" viewBox="0 0 220 220"
          initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={T.line} strokeWidth={STROKE} opacity={0.4} />
            {arcs.map((a, i) => (
              <motion.circle
                key={a.key}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={active === i ? STROKE + 6 : STROKE}
                strokeDasharray={`${a.len} ${CIRC - a.len}`}
                strokeDashoffset={a.offset}
                strokeLinecap="butt"
                animate={{
                  opacity: active == null || active === i ? 1 : 0.35,
                  strokeWidth: active === i ? STROKE + 6 : STROKE,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </g>
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="24" fontWeight="600" fontFamily="'Fraunces', serif" fill={T.ink}>
            {activeSeg ? `${activeSeg.pct.toFixed(0)}%` : `${segments[0].pct.toFixed(0)}%`}
          </text>
          <text x={CX} y={CY + 15} textAnchor="middle" fontSize="10.5" fontWeight="600" letterSpacing="0.04em" fill={T.inkSoft}>
            {(activeSeg ? activeSeg.label : segments[0].label).toUpperCase()}
          </text>
        </motion.svg>

        <div className="flex w-full flex-col gap-2 sm:w-auto">
          {segments.map((s, i) => (
            <button
              key={s.key}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="flex items-center justify-between gap-6 rounded-[12px] border px-3 py-2 text-left transition-colors"
              style={{
                borderColor: active === i ? s.color : "transparent",
                background: active === i ? T.creamSoft : "transparent",
              }}
            >
              <span className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: T.ink }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-[13px] font-semibold" style={{ color: T.ink }}>{s.pct.toFixed(0)}%</span>
                <span className="text-[11px]" style={{ color: T.inkSoft }}>{s.count} shp.</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskIntelligence({ range }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
          Risk Intelligence
        </div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
          Where risk is building, and where it's easing
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.5 }}>
          <RiskTrendChart range={range} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.5, delay: 0.08 }}>
          <RiskDonut range={range} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROUTE PERFORMANCE
   ───────────────────────────────────────────────────────────── */
function RouteRow({ route, index }) {
  const tone = routeTone(route.health);
  const st = toneStyles[tone];
  const barRef = useRef(null);

  return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="group grid grid-cols-1 gap-4 rounded-[16px] border p-4 transition-colors sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
      style={{ borderColor: T.line, background: T.creamSoft }}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: T.ink }}>
            <RouteIcon size={14} style={{ color: T.emerald }} />
            {route.from} <ChevronRight size={13} style={{ color: T.inkSoft }} /> {route.to}
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ color: st.fg, background: st.bg }}
          >
            Health {route.health}
          </span>
        </div>

        <div className="mt-2.5 h-[7px] w-full overflow-hidden rounded-full" style={{ background: T.line }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: st.fg }}
            initial={{ width: "0%" }}
            whileInView={{ width: `${route.health}%` }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: index * 0.07 + 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px]" style={{ color: T.inkSoft }}>
          <span><span className="font-semibold" style={{ color: T.ink }}>{route.onTime}%</span> on-time</span>
          <span><span className="font-semibold" style={{ color: T.ink }}>{route.shipments}</span> shipments</span>
          <span>
            <span className="font-semibold" style={{ color: route.excursions > 2 ? T.red : T.ink }}>{route.excursions}</span> excursion{route.excursions === 1 ? "" : "s"}
          </span>
          <span><span className="font-semibold" style={{ color: T.ink }}>{route.avgTemp}°C</span> avg temp</span>
        </div>
      </div>

      <div
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full border opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
        style={{ borderColor: T.line, color: T.emerald }}
      >
        <ArrowUpRight size={14} />
      </div>
    </motion.div>
  );
}

function RoutePerformance() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
          Route Performance
        </div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
          Which corridors are performing, which need attention
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {ROUTES.map((r, i) => (
          <RouteRow key={r.id} route={r} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SENSOR INTELLIGENCE
   ───────────────────────────────────────────────────────────── */
function ProgressBar({ value, color, delay }) {
  return (
    <div className="h-[6px] w-full overflow-hidden rounded-full" style={{ background: T.line }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: "0%" }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function SensorRow({ sensor, index }) {
  const Icon = sensorIcon[sensor.icon];
  const tone = !sensor.online ? "bad" : sensor.issues > 1 ? "warn" : "good";
  const st = toneStyles[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -2 }}
      className="rounded-[16px] border p-4"
      style={{ borderColor: T.line, background: T.creamSoft }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px]" style={{ background: st.bg, color: st.fg }}>
            <Icon size={16} />
            {sensor.online && (
              <motion.span
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2"
                style={{ background: T.emerald, borderColor: T.creamSoft }}
                animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
              />
            )}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: T.ink }}>{sensor.name}</div>
            <div className="text-[11px]" style={{ color: T.inkSoft }}>{sensor.model}</div>
          </div>
        </div>
        <span
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ color: sensor.online ? T.emerald : T.red, background: sensor.online ? T.mint : T.redSoft }}
        >
          {sensor.online ? <Wifi size={10} /> : <WifiOff size={10} />}
          {sensor.online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px]" style={{ color: T.inkSoft }}>
            <span>Uptime</span>
            <span className="font-semibold" style={{ color: T.ink }}>{sensor.uptime}%</span>
          </div>
          <ProgressBar value={sensor.uptime} color={T.emerald} delay={index * 0.07 + 0.05} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px]" style={{ color: T.inkSoft }}>
            <span>Data Quality</span>
            <span className="font-semibold" style={{ color: T.ink }}>{sensor.quality}%</span>
          </div>
          <ProgressBar value={sensor.quality} color={T.emeraldBright} delay={index * 0.07 + 0.12} />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: T.line, color: T.inkSoft }}>
        <span className="flex items-center gap-1.5">
          <Signal size={12} /> {sensor.lastComm}
        </span>
        <span style={{ color: sensor.issues > 0 ? T.amber : T.inkSoft, fontWeight: sensor.issues > 0 ? 600 : 400 }}>
          {sensor.issues} issue{sensor.issues === 1 ? "" : "s"}
        </span>
      </div>
    </motion.div>
  );
}

function SensorIntelligence() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
          Sensor Intelligence
        </div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
          Every device, monitored like infrastructure
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SENSORS.map((s, i) => (
          <SensorRow key={s.id} sensor={s} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI PATTERN DETECTED — preview panel, not the full AI Insights page
   ───────────────────────────────────────────────────────────── */
const patternField = [
  { label: "Pattern", icon: Radar, text: "4 of the last 7 shipments experienced temperature drift above the safe range." },
  { label: "Likely Cause", icon: Wrench, text: "Cooling performance degradation." },
  { label: "Impact", icon: TrendingUp, text: "23% higher spoilage risk." },
  { label: "Recommendation", icon: ShieldCheck, text: "Inspect refrigeration before the next dispatch." },
];

function AIPatternDetected() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[24px] p-7 sm:p-9"
        style={{ background: `linear-gradient(155deg, ${T.forest} 0%, #0B2A1D 100%)` }}
      >
        {/* restrained ambient glow — no neon */}
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(31,163,92,0.16) 0%, transparent 70%)" }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-32 -right-16 h-[300px] w-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[11px]" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Brain size={17} color="#fff" />
              </div>
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-white/85">
                AI Pattern Detected
              </span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" }}>
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: T.emeraldBright }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              Analyzing live signals
            </span>
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[620px] text-[24px] font-medium leading-snug sm:text-[27px]"
            style={{ fontFamily: "'Fraunces', serif", color: "#fff" }}
          >
            Temperature excursions are increasing on the{" "}
            <span style={{ color: T.emeraldBright }}>Mumbai → Pune</span> corridor.
          </motion.h3>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {patternField.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                className="rounded-[15px] border p-4"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: T.emeraldBright }}>
                  <f.icon size={12} />
                  {f.label}
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/80">{f.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-7 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Based on the last 7 shipments on this corridor · confidence 91%
            </span>
            <button className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold" style={{ color: T.forest }}>
              View Full AI Insight →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOSS PREVENTION — business-impact closer
   ───────────────────────────────────────────────────────────── */
const IMPACT_METRICS = [
  { value: 2.4, prefix: "₹", suffix: "L", decimals: 1, label: "Losses Prevented", note: "Estimated spoilage value averted this period" },
  { value: 18, suffix: "", decimals: 0, label: "High-Risk Shipments Intercepted", note: "Flagged and corrected before delivery" },
  { value: 96.4, suffix: "%", decimals: 1, label: "Cold-Chain Compliance", note: "Time spent within the safe temperature band" },
  { value: 42, suffix: "h", decimals: 0, label: "Potential Spoilage Avoided", note: "Cumulative exposure time prevented" },
];

function LossPrevention() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-14">
      <div className="mx-auto max-w-[640px] text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>
          Business Impact
        </div>
        <h2 className="mt-2 text-[28px] font-medium leading-tight sm:text-[32px]" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
          Measure what ChillChain prevented.
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: T.inkSoft }}>
          ChillChain doesn't just monitor cold-chain shipments — it intercepts risk before it
          becomes a financial loss.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: T.line, background: T.line }}>
        {IMPACT_METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center px-6 py-9 text-center"
            style={{ background: T.creamSoft }}
          >
            <div className="text-[38px] font-medium leading-none sm:text-[42px]" style={{ fontFamily: "'Fraunces', serif", color: T.forest }}>
              <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix || ""} suffix={m.suffix} />
            </div>
            <div className="mt-3 text-[13px] font-semibold" style={{ color: T.ink }}>{m.label}</div>
            <div className="mt-1.5 max-w-[190px] text-[11.5px] leading-snug" style={{ color: T.inkSoft }}>{m.note}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [range, setRange] = useState("24H");
  const [shipment, setShipment] = useState("All Shipments");

  return (
    <div style={{ background: T.cream, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{fontImport}</style>
      <Hero range={range} setRange={setRange} shipment={shipment} setShipment={setShipment} />
      <KpiStrip range={range} />
      <TemperatureChart range={range} />
      <RiskIntelligence range={range} />
      <RoutePerformance />
      <SensorIntelligence />
      <AIPatternDetected />
      <LossPrevention />
      <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-2 text-center text-[11.5px]" style={{ color: T.inkSoft }}>
        ChillChain AI · Analytics — SHT40 + ESP32 · AI Risk Engine · Hackathon build
      </div>
    </div>
  );
}
