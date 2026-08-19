/**
 * ChillChain AI — Devices Page
 * "Device Intelligence" — IoT operations / control-center view
 *
 * Stack: React 18 + TypeScript + Tailwind CSS + Framer Motion + Recharts + Lucide React + react-leaflet
 *
 * Design system carried over from the ChillChain dashboard reference:
 *  - Warm paper background (#F7F5EE) with a deep forest-green (#0B3B2E) command layer
 *  - Emerald accent (#1F9D6C) for "live / healthy" states, amber (#D9A441) for warning, red (#D14343) for critical
 *  - Display type: Fraunces (editorial serif) for headings — Geist Mono for all sensor/telemetry readouts
 *  - Open, asymmetric sections rather than a uniform card grid, per design brief
 *
 * Drop this file into: src/pages/Devices.tsx (or app/devices/page.tsx for Next.js — add "use client")
 * Requires: framer-motion, recharts, lucide-react, react-leaflet, leaflet
 *   npm i framer-motion recharts lucide-react react-leaflet leaflet
 * Also import "leaflet/dist/leaflet.css" once globally (see bottom of file for note).
 */

import React, {
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  Tooltip as RTooltip,
} from "recharts";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Bell,
  ChevronRight,
  Thermometer,
  Droplets,
  Activity,
  Satellite,
  Wifi,
  Cpu,
  Battery,
  Signal,
  AlertTriangle,
  RefreshCw,
  Settings2,
  FileText,
  Gauge,
  Zap,
  Volume2,
} from "lucide-react";

/* ------------------------------------------------------------------------ */
/*  Design tokens                                                           */
/* ------------------------------------------------------------------------ */

const COLORS = {
  paper: "#F7F5EE",
  paperDeep: "#F1EEE3",
  forest: "#0B3B2E",
  forestSoft: "#12452F",
  emerald: "#1F9D6C",
  emeraldSoft: "#DCEEE3",
  amber: "#D9A441",
  amberSoft: "#F7ECD6",
  red: "#C6483B",
  redSoft: "#F6E2DE",
  ink: "#141C18",
  inkSoft: "#5C685F",
  line: "#E3E0D3",
  white: "#FFFFFF",
};

const fontDisplay = { fontFamily: '"Fraunces", "Iowan Old Style", Georgia, serif' };
const fontMono = { fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace' };

/* ------------------------------------------------------------------------ */
/*  Mock data                                                                */
/* ------------------------------------------------------------------------ */

type DeviceStatus = "online" | "warning" | "offline";

interface Device {
  id: string;
  route: string;
  shipment: string;
  temp: number;
  humidity: number;
  gps: "Connected" | "Weak" | "Lost";
  signal: "Excellent" | "Good" | "Poor";
  battery: number;
  status: DeviceStatus;
  lastSync: string;
  lat: number;
  lng: number;
}

const DEVICES: Device[] = [
  { id: "CHL-001", route: "Indore → Delhi", shipment: "Fresh Produce", temp: 4.8, humidity: 68, gps: "Connected", signal: "Excellent", battery: 87, status: "online", lastSync: "3s ago", lat: 24.5, lng: 78.2 },
  { id: "CHL-002", route: "Mumbai → Bhopal", shipment: "Dairy Crates", temp: 5.2, humidity: 71, gps: "Connected", signal: "Good", battery: 74, status: "online", lastSync: "8s ago", lat: 21.9, lng: 75.1 },
  { id: "CHL-003", route: "Pune → Nagpur", shipment: "Vaccines", temp: 3.9, humidity: 55, gps: "Connected", signal: "Excellent", battery: 92, status: "online", lastSync: "2s ago", lat: 19.9, lng: 78.0 },
  { id: "CHL-004", route: "Delhi → Kolkata", shipment: "Fruits", temp: 9.6, humidity: 64, gps: "Connected", signal: "Good", battery: 61, status: "warning", lastSync: "14s ago", lat: 25.6, lng: 84.0 },
  { id: "CHL-005", route: "Chennai → Bengaluru", shipment: "Seafood", temp: 2.1, humidity: 82, gps: "Connected", signal: "Excellent", battery: 95, status: "online", lastSync: "1s ago", lat: 12.6, lng: 78.6 },
  { id: "CHL-006", route: "Hyderabad → Vijayawada", shipment: "Flowers", temp: 6.4, humidity: 59, gps: "Connected", signal: "Good", battery: 68, status: "online", lastSync: "6s ago", lat: 16.9, lng: 79.9 },
  { id: "CHL-007", route: "Ahmedabad → Surat", shipment: "Meat", temp: 1.8, humidity: 77, gps: "Connected", signal: "Excellent", battery: 83, status: "online", lastSync: "4s ago", lat: 22.1, lng: 72.5 },
  { id: "CHL-008", route: "Jaipur → Indore", shipment: "Dairy", temp: 5.5, humidity: 66, gps: "Weak", signal: "Poor", battery: 44, status: "warning", lastSync: "51s ago", lat: 24.9, lng: 75.6 },
  { id: "CHL-009", route: "Lucknow → Patna", shipment: "Fruits", temp: 7.0, humidity: 60, gps: "Connected", signal: "Good", battery: 77, status: "online", lastSync: "9s ago", lat: 26.3, lng: 83.4 },
  { id: "CHL-010", route: "Kolkata → Guwahati", shipment: "Fish", temp: 2.6, humidity: 85, gps: "Connected", signal: "Excellent", battery: 90, status: "online", lastSync: "2s ago", lat: 25.8, lng: 90.6 },
  { id: "CHL-011", route: "Kochi → Coimbatore", shipment: "Vegetables", temp: 6.1, humidity: 63, gps: "Lost", signal: "Poor", battery: 12, status: "offline", lastSync: "4m ago", lat: 10.6, lng: 76.7 },
  { id: "CHL-012", route: "Nashik → Pune", shipment: "Grapes", temp: 4.4, humidity: 58, gps: "Connected", signal: "Excellent", battery: 81, status: "online", lastSync: "5s ago", lat: 19.1, lng: 74.3 },
];

const DeviceMapClient = lazy(
  () => import("../components/chillchain/DeviceMapClient")
);

function ClientOnlyMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ backgroundColor: "#F1EEE3" }}
      >
        <span
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ color: "#5C685F" }}
        >
          Loading live locations…
        </span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className="h-full w-full flex items-center justify-center"
          style={{ backgroundColor: "#F1EEE3" }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.12em]"
            style={{ color: "#5C685F" }}
          >
            Loading map…
          </span>
        </div>
      }
    >
      <DeviceMapClient />
    </Suspense>
  );
}

const PIPELINE = [
  { key: "SHT40", label: "SHT40", sub: "Temp + RH" },
  { key: "LIS3DH", label: "LIS3DH", sub: "Accelerometer" },
  { key: "GPS", label: "NEO-6M", sub: "GPS" },
  { key: "NodeMCU", label: "NodeMCU", sub: "ESP8266" },
  { key: "WiFi", label: "Wi-Fi", sub: "Uplink" },
  { key: "Cloud", label: "ChillChain Cloud", sub: "AI Engine" },
];

function genSeries(base: number, spread: number, n = 24) {
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v += (Math.random() - 0.5) * spread;
    return { t: i, v: Number(v.toFixed(2)) };
  });
}

const ACTIVITY_SEED = [
  { time: "10:42:18", label: "Temperature reading received", icon: Thermometer },
  { time: "10:42:20", label: "GPS location updated", icon: Satellite },
  { time: "10:42:22", label: "Humidity reading received", icon: Droplets },
  { time: "10:42:25", label: "Movement detected", icon: Activity },
  { time: "10:42:27", label: "Data synchronized with cloud", icon: RefreshCw },
];

const SENSORS = [
  { id: "SHT40", label: "Temperature Sensor", icon: Thermometer },
  { id: "LIS3DH", label: "Motion Sensor", icon: Activity },
  { id: "NEO-6M", label: "GPS Module", icon: Satellite },
  { id: "NodeMCU", label: "Controller", icon: Cpu },
  { id: "Buzzer", label: "Alert System", icon: Volume2 },
];

const ALERTS = [
  { id: "CHL-004", text: "SHT40 temperature sensor reporting abnormal values", level: "critical" as const, time: "Just now" },
  { id: "CHL-008", text: "GPS signal weak", level: "warning" as const, time: "3 min ago" },
  { id: "CHL-011", text: "Device offline for 4 minutes", level: "critical" as const, time: "4 min ago" },
];

const COMMANDS = [
  { label: "Restart Device", icon: RefreshCw },
  { label: "Sync Now", icon: Zap },
  { label: "Calibrate Sensor", icon: Gauge },
  { label: "View Logs", icon: FileText },
  { label: "Update Configuration", icon: Settings2 },
];

/* ------------------------------------------------------------------------ */
/*  Small utilities                                                         */
/* ------------------------------------------------------------------------ */

function statusColor(status: DeviceStatus) {
  if (status === "online") return COLORS.emerald;
  if (status === "warning") return COLORS.amber;
  return COLORS.red;
}

function StatusDot({ status, size = 8 }: { status: DeviceStatus; size?: number }) {
  const c = statusColor(status);
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {status === "online" && (
        <motion.span
          className="absolute inline-flex rounded-full"
          style={{ backgroundColor: c, width: size, height: size }}
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="relative inline-flex rounded-full" style={{ backgroundColor: c, width: size, height: size }} />
    </span>
  );
}

function AnimatedCounter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    mv.set(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(v.toFixed(decimals)));
    return unsub;
  }, [spring, decimals]);

  return <span style={fontMono}>{display}{suffix}</span>;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------ */
/*  Page title bar                                                          */
/* ------------------------------------------------------------------------ */

function TitleBar() {
  return (
    <div className="mx-auto max-w-[1440px] px-8 pt-12 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <div className="text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: COLORS.emerald }}>— Device Intelligence</div>
        <h1 className="text-[42px] sm:text-[52px] leading-[1.02] tracking-tight" style={{ ...fontDisplay, color: COLORS.ink, fontWeight: 600 }}>
          Monitor every sensor<br />powering your <span style={{ color: COLORS.emerald, fontStyle: "italic" }}>network</span>.
        </h1>
        <p className="mt-4 max-w-md text-[15px]" style={{ color: COLORS.inkSoft }}>
          Live telemetry from every ChillChain node — temperature, motion, location and uplink health, streamed straight from the field.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 h-10 px-3.5 rounded-full border bg-white" style={{ borderColor: COLORS.line }}>
          <Search size={14} color={COLORS.inkSoft} />
          <input placeholder="Search devices…" className="text-[13px] bg-transparent outline-none w-[130px] placeholder:text-[#9AA39C]" style={{ color: COLORS.ink }} />
        </div>
        <button className="h-10 px-4 rounded-full border bg-white flex items-center gap-2 text-[13px] font-medium" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
          <SlidersHorizontal size={14} /> Filter
        </button>
        <button className="h-10 px-4 rounded-full flex items-center gap-2 text-[13px] font-medium text-white" style={{ backgroundColor: COLORS.forest }}>
          <Plus size={14} /> Add Device
        </button>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Hero — pipeline / system status                                         */
/* ------------------------------------------------------------------------ */

function PipelineHero() {
  const stats = [
    { label: "Devices Online", value: 12, color: COLORS.emerald },
    { label: "Devices Warning", value: 2, color: COLORS.amber },
    { label: "Device Offline", value: 1, color: COLORS.red },
  ];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-8 rounded-[28px] overflow-hidden relative"
      style={{ backgroundColor: COLORS.forest }}
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{ background: "radial-gradient(720px 320px at 15% 0%, rgba(31,157,108,0.35), transparent 60%)" }}
      />
      <div className="relative px-8 sm:px-12 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2">
            <StatusDot status="online" size={7} />
            <span className="text-[11px] tracking-[0.16em] uppercase text-white/70">Live Pipeline</span>
          </div>
          <div className="flex items-center gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-right">
                <div className="text-[26px] font-semibold" style={{ ...fontMono, color: s.color }}>
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-[10px] tracking-[0.08em] uppercase text-white/50">{s.label}</div>
              </div>
            ))}
            <div className="text-right pl-6 border-l border-white/15">
              <div className="text-[26px] font-semibold text-white" style={fontMono}>
                <AnimatedCounter value={98.2} decimals={1} suffix="%" />
              </div>
              <div className="text-[10px] tracking-[0.08em] uppercase text-white/50">Network Health</div>
            </div>
          </div>
        </div>

        {/* Pipeline flow */}
        <div className="relative">
          <div className="flex items-center justify-between relative">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/15" />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${COLORS.emerald}, transparent)`, width: "18%" }}
              animate={{ left: ["-18%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            />
            {PIPELINE.map((node, i) => (
              <div key={node.key} className="relative z-10 flex flex-col items-center gap-3" style={{ flex: "1 1 0" }}>
                <motion.div
                  className="h-14 w-14 rounded-2xl grid place-items-center border"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.14)" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                >
                  <span className="text-[10px] font-semibold text-white/90" style={fontMono}>{node.key.slice(0, 3)}</span>
                </motion.div>
                <div className="text-center">
                  <div className="text-[12px] font-medium text-white">{node.label}</div>
                  <div className="text-[10px] text-white/45">{node.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Device overview visual (large, non-card)                                */
/* ------------------------------------------------------------------------ */

function DeviceOverviewVisual() {
  const labels = [
    { icon: Thermometer, title: "SHT40", v1: "4.8°C", v2: "68% RH", pos: "top-6 left-6", delay: 0 },
    { icon: Activity, title: "LIS3DH", v1: "Stable", v2: "0.02g", pos: "top-6 right-6", delay: 0.4 },
    { icon: Satellite, title: "GPS", v1: "Connected", v2: "3 Satellites", pos: "bottom-24 left-10", delay: 0.8 },
    { icon: Wifi, title: "NodeMCU", v1: "Wi-Fi", v2: "Excellent", pos: "bottom-24 right-10", delay: 1.2 },
  ];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-8 mt-16"
    >
      <SectionKicker label="Device Overview" title="What's inside every node." />
      <div
        className="relative mt-8 rounded-[28px] h-[420px] overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${COLORS.paperDeep}, #EDE9DA)` }}
      >
        {/* device silhouette */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[190px] rounded-3xl"
          style={{ backgroundColor: COLORS.forest, boxShadow: "0 40px 80px -30px rgba(11,59,46,0.5)" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full flex flex-col items-center justify-center gap-2">
            <Cpu size={26} color={COLORS.emerald} />
            <span className="text-[11px] tracking-[0.14em] uppercase text-white/60">Sensor Node</span>
            <span className="text-[13px] font-semibold text-white" style={fontMono}>CHL-001</span>
          </div>
        </motion.div>

        {labels.map((l) => (
          <motion.div
            key={l.title}
            className={`absolute ${l.pos} bg-white rounded-2xl px-4 py-3 border flex items-center gap-3`}
            style={{ borderColor: COLORS.line, boxShadow: "0 12px 30px -18px rgba(20,28,24,0.25)" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: l.delay }}
          >
            <div className="h-8 w-8 rounded-full grid place-items-center" style={{ backgroundColor: COLORS.emeraldSoft }}>
              <l.icon size={14} color={COLORS.forestSoft} />
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: COLORS.ink }}>{l.title}</div>
              <div className="text-[10px]" style={{ color: COLORS.inkSoft }}>{l.v1} · {l.v2}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function SectionKicker({ label, title, right }: { label: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: COLORS.emerald }}>— {label}</div>
        <h2 className="text-[28px] sm:text-[32px] leading-[1.1] tracking-tight" style={{ ...fontDisplay, color: COLORS.ink, fontWeight: 600 }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Device list + detail                                                    */
/* ------------------------------------------------------------------------ */

function DeviceListAndDetail() {
  const [selected, setSelected] = useState<Device>(DEVICES[0]);
  const tempSeries = useMemo(() => genSeries(selected.temp, 0.6), [selected.id]);
  const humSeries = useMemo(() => genSeries(selected.humidity, 3), [selected.id]);

  return (
    <section className="mx-8 mt-16 grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
      {/* table */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <SectionKicker label="Connected Devices" title="Every node, at a glance." />
        <div className="mt-6 rounded-[24px] border bg-white overflow-hidden" style={{ borderColor: COLORS.line }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="border-b" style={{ borderColor: COLORS.line }}>
                  {["Device", "Route", "Shipment", "Temp", "Humidity", "GPS", "Signal", "Battery", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[10px] tracking-[0.1em] uppercase font-medium" style={{ color: COLORS.inkSoft }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEVICES.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="border-b last:border-0 cursor-pointer transition-colors hover:bg-[#F7F5EE]"
                    style={{ borderColor: COLORS.line, backgroundColor: selected.id === d.id ? COLORS.emeraldSoft : "transparent" }}
                  >
                    <td className="px-5 py-3.5 text-[13px] font-semibold" style={{ ...fontMono, color: COLORS.ink }}>{d.id}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: COLORS.inkSoft }}>{d.route}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: COLORS.inkSoft }}>{d.shipment}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={fontMono}>{d.temp.toFixed(1)}°C</td>
                    <td className="px-5 py-3.5 text-[13px]" style={fontMono}>{d.humidity}%</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: COLORS.inkSoft }}>{d.gps}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: COLORS.inkSoft }}>{d.signal}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={fontMono}>{d.battery}%</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={d.status} size={6} />
                        <span className="text-[10px] font-semibold tracking-[0.06em] uppercase" style={{ color: statusColor(d.status) }}>
                          {d.status === "online" ? "Live" : d.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* detail panel */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <div className="text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: COLORS.emerald }}>— Selected Device</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="rounded-[24px] p-7 text-white relative overflow-hidden"
            style={{ backgroundColor: COLORS.forest }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[20px] font-semibold" style={fontMono}>{selected.id}</div>
                <div className="text-[12px] text-white/50">{selected.route}</div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <StatusDot status={selected.status} size={6} />
                <span className="text-[11px] capitalize">{selected.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <MiniStat label="Temperature" value={`${selected.temp.toFixed(1)}°C`} />
              <MiniStat label="Humidity" value={`${selected.humidity}%`} />
              <MiniStat label="Shock Level" value="0.02g" />
              <MiniStat label="GPS" value={selected.gps} />
              <MiniStat label="Wi-Fi Signal" value={selected.signal} />
              <MiniStat label="Battery" value={`${selected.battery}%`} />
            </div>

            <Sparkline data={tempSeries} color={COLORS.emerald} label="Temperature trend" />
            <div className="h-4" />
            <Sparkline data={humSeries} color="#7FC4E8" label="Humidity trend" />

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-white/45">Last sync</span>
              <span className="text-[12px]" style={fontMono}>{selected.lastSync}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
      <div className="text-[9px] tracking-[0.08em] uppercase text-white/40">{label}</div>
      <div className="text-[15px] mt-0.5" style={fontMono}>{value}</div>
    </div>
  );
}

function Sparkline({ data, color, label }: { data: { t: number; v: number }[]; color: string; label: string }) {
  return (
    <div>
      <div className="text-[10px] text-white/40 mb-1">{label}</div>
      <div className="h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
            <RTooltip
              contentStyle={{ background: COLORS.forest, border: "none", borderRadius: 8, fontSize: 11 }}
              labelFormatter={() => ""}
              itemStyle={{ color: "#fff" }}
            />
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${label.replace(/\s/g, "")})`} isAnimationActive />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Sensor health                                                            */
/* ------------------------------------------------------------------------ */

function SensorHealth() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-8 mt-16"
    >
      <SectionKicker label="Sensor Health" title="Every component, operational." />
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-px rounded-[24px] overflow-hidden border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.line }}>
        {SENSORS.map((s, i) => (
          <div key={s.id} className="bg-white p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ backgroundColor: COLORS.emeraldSoft }}>
                <s.icon size={16} color={COLORS.forestSoft} />
              </div>
              <StatusDot status="online" size={7} />
            </div>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>{s.id}</div>
              <div className="text-[11px]" style={{ color: COLORS.inkSoft }}>{s.label}</div>
            </div>
            <div className="text-[10px] font-medium tracking-[0.06em] uppercase" style={{ color: COLORS.emerald }}>● Operational</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Activity timeline                                                        */
/* ------------------------------------------------------------------------ */

function ActivityTimeline() {
  const [events, setEvents] = useState(ACTIVITY_SEED);

  useEffect(() => {
    const pool = [
      { label: "Temperature reading received", icon: Thermometer },
      { label: "GPS location updated", icon: Satellite },
      { label: "Humidity reading received", icon: Droplets },
      { label: "Movement detected", icon: Activity },
      { label: "Data synchronized with cloud", icon: RefreshCw },
      { label: "Battery level reported", icon: Battery },
    ];
    const interval = setInterval(() => {
      const next = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const time = now.toTimeString().slice(0, 8);
      setEvents((prev) => [{ time, ...next }, ...prev].slice(0, 6));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <SectionKicker label="Live Activity" title="The last few seconds, in order." />
      <div className="mt-6 rounded-[24px] border bg-white p-6" style={{ borderColor: COLORS.line }}>
        <AnimatePresence initial={false}>
          {events.map((e, i) => (
            <motion.div
              key={e.time + e.label + i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4 py-3"
              style={{ borderBottom: i < events.length - 1 ? `1px solid ${COLORS.line}` : "none" }}
            >
              <span className="text-[11px] w-16 shrink-0" style={{ ...fontMono, color: COLORS.inkSoft }}>{e.time}</span>
              <div className="h-7 w-7 rounded-full grid place-items-center shrink-0" style={{ backgroundColor: COLORS.emeraldSoft }}>
                <e.icon size={12} color={COLORS.forestSoft} />
              </div>
              <span className="text-[13px]" style={{ color: COLORS.ink }}>{e.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Map                                                                      */
/* ------------------------------------------------------------------------ */

function DeviceMap() {
  return (
    <motion.div
      variants={fadeUp}
      custom={1}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <SectionKicker
        label="Live Locations"
        title="Where every device sits right now."
      />

      <div
        className="mt-6 rounded-[24px] overflow-hidden border h-[360px]"
        style={{ borderColor: COLORS.line }}
      >
        <ClientOnlyMap />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Alerts + Commands                                                        */
/* ------------------------------------------------------------------------ */

function AlertsAndCommands() {
  return (
    <section className="mx-8 mt-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <SectionKicker
          label="Device Alerts"
          title="What needs attention."
          right={
            <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: COLORS.red }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.red }} /> 2 unresolved critical
            </span>
          }
        />
        <div className="mt-6 space-y-3">
          {ALERTS.map((a) => (
            <div
              key={a.id + a.text}
              className="rounded-2xl px-5 py-4 flex items-start gap-3.5"
              style={{ backgroundColor: a.level === "critical" ? COLORS.redSoft : COLORS.amberSoft }}
            >
              {a.level === "critical" ? (
                <AlertTriangle size={16} color={COLORS.red} className="mt-0.5 shrink-0" />
              ) : (
                <Signal size={16} color={COLORS.amber} className="mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-[13px]">
                  <span className="font-semibold" style={fontMono}>{a.id}</span>
                  <span style={{ color: COLORS.inkSoft }}> — {a.text}</span>
                </div>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: COLORS.inkSoft }}>{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <SectionKicker label="Device Commands" title="Take action." />
        <div className="mt-6 rounded-[24px] border bg-white p-3" style={{ borderColor: COLORS.line }}>
          {COMMANDS.map((c, i) => (
            <button
              key={c.label}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors hover:bg-[#F7F5EE] group"
              style={{ borderBottom: i < COMMANDS.length - 1 ? `1px solid ${COLORS.line}` : "none" }}
            >
              <span className="flex items-center gap-3 text-[13px] font-medium" style={{ color: COLORS.ink }}>
                <c.icon size={15} color={COLORS.forestSoft} /> {c.label}
              </span>
              <ChevronRight size={14} color={COLORS.inkSoft} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Page                                                                     */
/* ------------------------------------------------------------------------ */

export default function Devices() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.paper }}>
      <TitleBar />
      <PipelineHero />
      <DeviceOverviewVisual />
      <DeviceListAndDetail />
      <SensorHealth />
      <section className="mx-8 mt-16 grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ActivityTimeline />
        <DeviceMap />
      </section>
      <AlertsAndCommands />
      <footer className="mx-8 mt-20 py-8 border-t text-center text-[11px]" style={{ borderColor: COLORS.line, color: COLORS.inkSoft }}>
        ChillChain AI · SHT40 + ESP8266 + AI Risk Engine — hackathon build
      </footer>
    </div>
  );
}

/**
 * NOTE — one-time global setup (not part of this component):
 *
 * 1. Fonts — add to your root HTML head or _document:
 *    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..600&display=swap" rel="stylesheet" />
 *    Geist Mono ships via `npm i geist` (Vercel) or swap for JetBrains Mono from Google Fonts.
 *
 * 2. Leaflet CSS — import once in your app entry:
 *    import "leaflet/dist/leaflet.css";
 *
 * 3. Leaflet default marker icons aren't used here (CircleMarker only), so no icon-path patching is required.
 */
