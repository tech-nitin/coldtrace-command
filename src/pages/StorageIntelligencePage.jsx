import React, { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Snowflake, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Radar,
  Plus,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                     */
/* ------------------------------------------------------------------ */
const C = {
  cream: "#F7F3E9",
  card: "#FFFFFF",
  ink: "#1B241C",
  inkSoft: "#4B5548",
  muted: "#8A9184",
  forest: "#173425",
  forestMid: "#20492F",
  forestLine: "#2F5F41",
  emerald: "#3E8F63",
  emeraldSoft: "#E7F1E7",
  amber: "#D99A3B",
  amberSoft: "#FBF0DD",
  red: "#C85C4C",
  redSoft: "#FBE9E4",
  border: "rgba(23,52,37,0.09)",
};

const STATUS_META = {
  healthy: { label: "Healthy", color: C.emerald, bg: C.emeraldSoft },
  warning: { label: "Warning", color: C.amber, bg: C.amberSoft },
  critical: { label: "Critical", color: C.red, bg: C.redSoft },
};

/* ------------------------------------------------------------------ */
/*  Small utility components                                          */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function CountUp({ value, decimals = 0, suffix = "", duration = 1300, start }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, duration]);
  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Sparkline({ data = [], color, width = 92, height = 30 }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPts = `0,${height} ${pts} ${width},${height}`;
  const uid = React.useId();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={`spark-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#spark-${uid})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="spark-line"
      />
    </svg>
  );
}

function RiskGauge({ value = 0, size = 128, animate }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = animate ? c - (value / 100) * c : c;
  const color = value >= 70 ? C.red : value >= 40 ? C.amber : C.emerald;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 40,
            lineHeight: 1,
            color: "#FFFFFF",
            fontWeight: 600,
          }}
        >
          <CountUp value={value} start={animate} duration={1500} />
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.55)",
            marginTop: 4,
          }}
        >
          {value >= 70 ? "HIGH RISK" : value >= 40 ? "ELEVATED" : "LOW RISK"}
        </span>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: C.forest,
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 10,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        boxShadow: "0 12px 32px rgba(23,52,37,0.28)",
      }}
    >
      <div style={{ opacity: 0.6, marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{Number(payload[0].value).toFixed(1)}°C</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Zone card                                                         */
/* ------------------------------------------------------------------ */
function ZoneCard({ zone, index }) {
  const statusKey = (zone.status || "healthy").toLowerCase();
  const meta = STATUS_META[statusKey] || STATUS_META.healthy;
  const isCritical = statusKey === "critical";
  return (
    <Reveal delay={index * 70}>
      <div
        className="group relative rounded-3xl p-5 flex flex-col gap-4 zone-card"
        style={{
          background: C.card,
          border: `1px solid ${isCritical ? "rgba(200,92,76,0.35)" : C.border}`,
          boxShadow: isCritical
            ? "0 1px 2px rgba(200,92,76,0.08), 0 14px 32px rgba(200,92,76,0.14)"
            : "0 1px 2px rgba(23,52,37,0.04), 0 8px 22px rgba(23,52,37,0.05)",
        }}
      >
        {isCritical && <span className="pulse-ring" />}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 17,
                color: C.ink,
                fontWeight: 600,
              }}
            >
              {zone.zoneId}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{zone.category}</div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 shrink-0"
            style={{
              background: meta.bg,
              color: meta.color,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            <span
              className={isCritical ? "dot-pulse" : ""}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: meta.color,
                display: "inline-block",
              }}
            />
            {meta.label}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Thermometer size={14} color={isCritical ? C.red : C.forestLine} strokeWidth={2.2} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 15,
                  color: isCritical ? C.red : C.ink,
                  fontWeight: 600,
                }}
              >
                {zone.temperature}°C
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets size={14} color={C.muted} strokeWidth={2.2} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 15,
                  color: C.inkSoft,
                  fontWeight: 500,
                }}
              >
                {zone.humidity}%
              </span>
            </div>
          </div>
          <Sparkline data={zone.sparklineData} color={meta.color} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.04em" }}>
              SPOILAGE RISK
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: meta.color,
                fontWeight: 700,
              }}
            >
              {zone.spoilageRisk}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 6, background: "rgba(23,52,37,0.06)" }}
          >
            <div
              className="risk-bar"
              style={{
                height: "100%",
                width: `${zone.spoilageRisk}%`,
                background: meta.color,
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero visual                                                       */
/* ------------------------------------------------------------------ */
function HeroVisual({ activeZonesCount = 6 }) {
  const nodes = [
    { x: 60, y: 46, r: 5, critical: false },
    { x: 150, y: 30, r: 6, critical: false },
    { x: 235, y: 58, r: 7, critical: true },
    { x: 120, y: 110, r: 5, critical: false },
    { x: 210, y: 128, r: 5, critical: false },
    { x: 40, y: 130, r: 5, critical: false },
  ];
  const links = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
    [0, 5],
  ];
  return (
    <div
      className="relative rounded-3xl overflow-hidden shrink-0"
      style={{
        width: 300,
        height: 220,
        background: `linear-gradient(155deg, ${C.forest} 0%, ${C.forestMid} 100%)`,
        boxShadow: "0 24px 60px rgba(23,52,37,0.28)",
      }}
    >
      <div className="absolute inset-0 hero-grain" />
      <svg viewBox="0 0 280 180" width="100%" height="100%" className="relative">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            className="hero-link"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            {n.critical && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 4}
                fill="none"
                stroke={C.red}
                strokeWidth="1.5"
                className="node-pulse"
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.critical ? C.red : "#EAF3EC"}
              className="hero-node"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute top-4 left-4 flex items-center gap-1.5">
        <Snowflake size={13} color="rgba(255,255,255,0.7)" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {activeZonesCount} ZONES LIVE
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          ESP32 · SHT40 · LIS3DH
        </span>
        <span className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            LIVE
          </span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */
export default function StorageIntelligencePage() {
  const [mounted, setMounted] = useState(false);
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gaugeRef, gaugeInView] = useInView(0.3);

  // New Zone Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    zoneId: "",
    category: "",
    temperature: "",
    humidity: "",
    productSensitivity: "Medium",
  });

  const fetchStorage = () => {
    fetch("http://localhost:5000/api/v1/storage/overview")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStorageData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching storage overview:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStorage();
    const timer = setTimeout(() => setMounted(true), 80);
    const interval = setInterval(fetchStorage, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleCreateZone = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/v1/storage/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setIsModalOpen(false);
          setFormData({ zoneId: "", category: "", temperature: "", humidity: "", productSensitivity: "Medium" });
          fetchStorage();
        }
      })
      .catch((err) => console.error("Error creating storage zone:", err));
  };

  if (loading) {
    return (
      <div style={{ background: C.cream, minHeight: "100vh" }} className="w-full flex items-center justify-center">
        <p className="font-serif text-lg text-emerald-900">Loading live storage telemetry...</p>
      </div>
    );
  }

  const summary = storageData?.summary || { activeZones: 6, inventoryProtectedTons: "18.4T", highRiskZonesCount: 2 };
  const zonesList = storageData?.zones || [];
  const alertZone = storageData?.aiElevatedRiskAlert || {
    zoneId: "Storage Zone D",
    category: "Fresh Fruits",
    spoilageRisk: 82,
    temperature: 7.6,
    humidity: 89,
    exposureTime: "2h 18m",
    productSensitivity: "High",
    recommendedAction: "Move sensitive inventory away from Storage Zone D and inspect its cooling system."
  };

  const tempSeries = [
    { t: "00:00", v: 3.4 },
    { t: "02:00", v: 3.6 },
    { t: "04:00", v: 3.3 },
    { t: "06:00", v: 3.5 },
    { t: "08:00", v: 3.9 },
    { t: "10:00", v: 4.2 },
    { t: "12:00", v: 4.6 },
    { t: "14:00", v: 6.8 },
    { t: "16:00", v: alertZone.temperature },
    { t: "18:00", v: 5.4 },
    { t: "20:00", v: 3.9 },
    { t: "22:00", v: 3.5 },
    { t: "23:59", v: 3.4 },
  ];

  const events = [
    {
      icon: AlertTriangle,
      tone: "red",
      title: "Temperature alert detected",
      detail: `${alertZone.zoneId} · ${alertZone.temperature}°C, above safe ceiling`,
      time: "3 min ago",
    },
    {
      icon: Droplets,
      tone: "amber",
      title: "Humidity increased",
      detail: `${alertZone.zoneId} · relative humidity climbed to ${alertZone.humidity}%`,
      time: "12 min ago",
    },
    {
      icon: RefreshCw,
      tone: "muted",
      title: "Sensor data synchronized",
      detail: "All zones · SHT40 + LIS3DH heartbeat confirmed",
      time: "28 min ago",
    },
    {
      icon: CheckCircle2,
      tone: "emerald",
      title: "Cooling system stabilized",
      detail: "Storage Zone E · compressor cycle back to nominal",
      time: "41 min ago",
    },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100%" }} className="w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .si-root, .si-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }

        .si-bg-texture {
          background-image: radial-gradient(rgba(23,52,37,0.05) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        @keyframes spark-draw {
          from { stroke-dashoffset: 240; }
          to { stroke-dashoffset: 0; }
        }
        .spark-line {
          stroke-dasharray: 240;
          animation: spark-draw 1.4s cubic-bezier(.16,1,.3,1) forwards;
        }

        @keyframes risk-fill {
          from { width: 0%; }
        }
        .risk-bar {
          animation: risk-fill 1.2s cubic-bezier(.16,1,.3,1) forwards;
        }

        .zone-card { transition: transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease; }
        .zone-card:hover { transform: translateY(-4px); }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .dot-pulse { animation: pulse-soft 1.8s ease-in-out infinite; }

        .pulse-ring {
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          border: 1.5px solid ${C.red};
          opacity: 0;
          animation: ring-pulse 2.6s ease-out infinite;
          pointer-events: none;
        }
        @keyframes ring-pulse {
          0% { opacity: 0.55; transform: scale(1); }
          70% { opacity: 0; transform: scale(1.015); }
          100% { opacity: 0; transform: scale(1.015); }
        }

        .live-dot {
          width: 6px; height: 6px; border-radius: 999px; background: #6FE39A; display: inline-block;
          animation: pulse-soft 1.6s ease-in-out infinite;
          box-shadow: 0 0 0 3px rgba(111,227,154,0.18);
        }

        .hero-node {
          opacity: 0;
          animation: node-in 0.6s cubic-bezier(.16,1,.3,1) forwards;
          transform-origin: center;
        }
        @keyframes node-in {
          from { opacity: 0; transform: scale(0.2); }
          to { opacity: 1; transform: scale(1); }
        }
        .node-pulse {
          animation: node-ring 2.2s ease-out infinite;
          transform-origin: center;
        }
        @keyframes node-ring {
          0% { opacity: 0.7; transform: scale(0.7); }
          100% { opacity: 0; transform: scale(1.9); }
        }
        .hero-link {
          stroke-dasharray: 4 4;
          animation: link-drift 6s linear infinite;
        }
        @keyframes link-drift { to { stroke-dashoffset: -80; } }

        .hero-grain {
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 14px 14px;
        }

        @keyframes glow-sweep {
          0% { transform: translateX(-30%); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateX(130%); opacity: 0; }
        }
        .ai-scan {
          position: absolute; top: 0; bottom: 0; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: glow-sweep 3.6s ease-in-out infinite;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .si-hero-flex { flex-direction: column; align-items: flex-start !important; }
          .si-spotlight-flex { flex-direction: column !important; }
          .si-spotlight-flex > div { width: 100% !important; }
        }
      `}</style>

      <div className="si-root max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* ---------------- HERO ---------------- */}
        <div className="si-hero-flex flex flex-row items-center justify-between gap-10 mb-16">
          <Reveal>
            <div style={{ maxWidth: 560 }}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
                style={{ background: C.emeraldSoft, color: C.forestMid }}
              >
                <Sparkles size={12} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  AI STORAGE INTELLIGENCE
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(30px, 4vw, 44px)",
                  lineHeight: 1.08,
                  color: C.ink,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Every storage zone,
                <br />
                <span style={{ color: C.forestMid, fontStyle: "italic" }}>intelligently protected.</span>
              </h1>
              <p style={{ marginTop: 16, fontSize: 15.5, color: C.inkSoft, lineHeight: 1.6, maxWidth: 480 }}>
                Monitor temperature, humidity, inventory conditions and spoilage risk
                across every cold-storage zone.
              </p>

              <div className="flex items-center gap-8 mt-9 flex-wrap">
                {[
                  { value: summary.activeZones ?? 6, label: "Active Zones", decimals: 0, suffix: "" },
                  { value: 18.4, label: "Inventory Protected", decimals: 1, suffix: "T" },
                  { value: summary.highRiskZonesCount ?? 2, label: "High-Risk Zones", decimals: 0, suffix: "" },
                ].map((m, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 26,
                        fontWeight: 700,
                        color: C.ink,
                      }}
                    >
                      <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} start={mounted} />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col items-end gap-6">
            <Reveal delay={150}>
              <HeroVisual start={mounted} activeZonesCount={summary.activeZones} />
            </Reveal>

            {/* ADD ZONE TRIGGER BUTTON */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition-transform hover:-translate-y-0.5 shadow-md"
              style={{ background: C.forest, color: "#FFFFFF" }}
            >
              <Plus size={16} strokeWidth={2.4} /> Add Storage Zone
            </button>
          </div>
        </div>

        {/* ---------------- ZONE OVERVIEW ---------------- */}
        <section className="mb-16">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 26,
                fontWeight: 600,
                color: C.ink,
              }}
            >
              Storage health, zone by zone.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            {zonesList.map((z, i) => (
              <ZoneCard zone={z} index={i} key={z.zoneId || i} />
            ))}
          </div>
        </section>

        {/* ---------------- AI SPOTLIGHT ---------------- */}
        <section className="mb-16" ref={gaugeRef}>
          <Reveal>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 20,
              }}
            >
              AI detected elevated spoilage risk.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div
              className="si-spotlight-flex relative overflow-hidden rounded-3xl flex flex-row"
              style={{
                background: `linear-gradient(120deg, ${C.forest} 0%, ${C.forestMid} 60%, #1E4530 100%)`,
                boxShadow: "0 24px 60px rgba(23,52,37,0.3)",
              }}
            >
              <div className="ai-scan" />
              {/* Risk score */}
              <div
                className="flex flex-col items-center justify-center gap-3 p-8"
                style={{ minWidth: 220 }}
              >
                <RiskGauge value={alertZone.spoilageRisk} animate={gaugeInView} />
                <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <ShieldAlert size={13} />
                  <span style={{ fontSize: 11.5 }}>{alertZone.zoneId}</span>
                </div>
              </div>

              {/* Factors */}
              <div
                className="flex-1 p-8 flex flex-col justify-center gap-3.5"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 600,
                  }}
                >
                  KEY FACTORS
                </span>
                {[
                  { label: "Temperature", value: `${alertZone.temperature}°C` },
                  { label: "Humidity", value: `${alertZone.humidity}%` },
                  { label: "Exposure", value: alertZone.exposureTime || "2h 18m" },
                  { label: "Product Sensitivity", value: alertZone.productSensitivity || "High" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)" }}>{f.label}</span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13.5,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="flex-1 p-8 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Radar size={14} color="#F3C98B" />
                  <span style={{ fontSize: 12.5, color: "#F3C98B", fontWeight: 700, letterSpacing: "0.02em" }}>
                    Immediate action recommended
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, maxWidth: 280 }}>
                  {alertZone.recommendedAction}
                </p>
                <button
                  className="inline-flex items-center gap-2 rounded-full mt-1 self-start"
                  style={{
                    background: "#fff",
                    color: C.forest,
                    padding: "10px 18px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                >
                  Review {alertZone.zoneId} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------------- TEMPERATURE INSIGHTS ---------------- */}
        <section className="mb-16">
          <Reveal>
            <div
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                boxShadow: "0 1px 2px rgba(23,52,37,0.04), 0 8px 22px rgba(23,52,37,0.05)",
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  Storage temperature trend
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <Legend swatch={C.emerald} label="Safe range" area />
                  <Legend swatch={C.red} label="Critical threshold" dashed />
                </div>
              </div>

              <div style={{ width: "100%", height: 260, marginTop: 18 }}>
                <ResponsiveContainer>
                  <AreaChart data={tempSeries} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.forestLine} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={C.forestLine} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(23,52,37,0.06)" />
                    <XAxis
                      dataKey="t"
                      tick={{ fontSize: 11, fill: C.muted, fontFamily: "JetBrains Mono, monospace" }}
                      axisLine={{ stroke: "rgba(23,52,37,0.08)" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 11, fill: C.muted, fontFamily: "JetBrains Mono, monospace" }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <ReferenceLine y={2} stroke="transparent" />
                    <ReferenceLine
                      y={9}
                      stroke={C.red}
                      strokeDasharray="5 5"
                      strokeWidth={1.5}
                      label={{
                        value: "Critical 9°C",
                        position: "insideTopRight",
                        fill: C.red,
                        fontSize: 11,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={C.forestLine}
                      strokeWidth={2.5}
                      fill="url(#tempFill)"
                      isAnimationActive={true}
                      animationDuration={1600}
                      animationEasing="ease-out"
                      dot={false}
                      activeDot={{ r: 5, fill: C.forestLine, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div
                className="flex items-center gap-6 flex-wrap mt-4 pt-5"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                <div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>Average temperature</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.ink,
                      marginTop: 2,
                    }}
                  >
                    3.8°C
                  </div>
                </div>
                <div style={{ width: 1, height: 30, background: C.border }} />
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: C.emerald,
                      display: "inline-block",
                    }}
                    className="dot-pulse"
                  />
                  <span style={{ fontSize: 13.5, color: C.inkSoft }}>
                    System status: <strong style={{ color: C.ink }}>Mostly stable</strong>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------------- RECENT EVENTS ---------------- */}
        <section>
          <Reveal>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 18,
              }}
            >
              Recent storage events
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                boxShadow: "0 1px 2px rgba(23,52,37,0.04), 0 8px 22px rgba(23,52,37,0.05)",
              }}
            >
              {events.map((ev, i) => {
                const toneColor =
                  ev.tone === "red" ? C.red : ev.tone === "amber" ? C.amber : ev.tone === "emerald" ? C.emerald : C.muted;
                const toneBg =
                  ev.tone === "red" ? C.redSoft : ev.tone === "amber" ? C.amberSoft : ev.tone === "emerald" ? C.emeraldSoft : "rgba(23,52,37,0.05)";
                const Icon = ev.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-4"
                    style={{
                      borderBottom: i < events.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 34, height: 34, borderRadius: 999, background: toneBg }}
                    >
                      <Icon size={15} color={toneColor} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{ev.title}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{ev.detail}</div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11.5,
                        color: C.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      </div>

      {/* ---------------- ADD STORAGE ZONE MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-3xl p-8 relative shadow-2xl"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X size={20} />
            </button>

            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                color: C.ink,
                fontWeight: 600,
              }}
            >
              Add New Storage Zone
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Create a new monitored zone card in your telemetry system.
            </p>

            <form onSubmit={handleCreateZone} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Zone Name</label>
                <input
                  type="text"
                  placeholder="e.g. Storage Zone G"
                  required
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Category / Cargo</label>
                <input
                  type="text"
                  placeholder="e.g. Exotic Fruits"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    required
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    placeholder="70"
                    required
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Product Sensitivity</label>
                <select
                  value={formData.productSensitivity}
                  onChange={(e) => setFormData({ ...formData, productSensitivity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-xl mt-4 text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: C.forest }}
              >
                Save Storage Zone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ swatch, label, dashed, area }) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <svg width="14" height="2">
          <line x1="0" y1="1" x2="14" y2="1" stroke={swatch} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      ) : (
        <span
          style={{
            width: 10,
            height: area ? 6 : 10,
            borderRadius: area ? 2 : 999,
            background: swatch,
            opacity: area ? 0.35 : 1,
            display: "inline-block",
          }}
        />
      )}
      <span style={{ fontSize: 11.5, color: "#8A9184" }}>{label}</span>
    </div>
  );
}