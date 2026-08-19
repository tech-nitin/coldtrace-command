import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  Crosshair,
  Maximize2,
  Satellite,
  Map as MapIcon,
  Radio,
  Thermometer,
  Droplets,
  Activity,
  Clock,
  AlertTriangle,
  Wrench,
  ChevronRight,
  X,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Route as RouteIcon,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Wifi,
  Sparkles,
  Signal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  GLOBAL MOTION + TYPE STYLES (CSS-driven, Framer-Motion-equivalent)  */
/* ------------------------------------------------------------------ */

const MotionStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

    .cc-root { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }

    @keyframes routeFlow { to { stroke-dashoffset: -24; } }
    @keyframes radarPulse {
      0%   { transform: scale(0.6); opacity: 0.5; }
      70%  { opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
    @keyframes radarPulseCritical {
      0%   { transform: scale(0.55); opacity: 0.6; }
      60%  { opacity: 0.15; }
      100% { transform: scale(1.25); opacity: 0; }
    }
    @keyframes softFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    @keyframes routeBreathe {
      0%, 100% { opacity: 0.55; }
      50% { opacity: 0.95; }
    }
    @keyframes gridBreathe {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.55; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ringDraw {
      from { stroke-dashoffset: var(--ring-from); }
      to { stroke-dashoffset: var(--ring-to); }
    }

    .route-flow { animation: routeFlow 1.6s linear infinite; }
    .route-breathe { animation: routeBreathe 2.2s ease-in-out infinite; }
    .radar-ring { transform-origin: center; transform-box: fill-box; animation: radarPulse 2.6s ease-out infinite; }
    .radar-ring-critical { transform-origin: center; transform-box: fill-box; animation: radarPulseCritical 1.4s ease-out infinite; }
    .marker-float { transform-box: fill-box; transform-origin: center; animation: softFloat 3.2s ease-in-out infinite; }
    .grid-breathe { animation: gridBreathe 7s ease-in-out infinite; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  MOCK DATA (unchanged shape — swap for API later)                    */
/* ------------------------------------------------------------------ */

const CITIES = {
  Delhi: { x: 300, y: 48 },
  Jaipur: { x: 228, y: 128 },
  Indore: { x: 268, y: 268 },
  Bhopal: { x: 350, y: 266 },
  Nagpur: { x: 432, y: 328 },
  Mumbai: { x: 168, y: 390 },
  Pune: { x: 230, y: 430 },
};

const ROUTES = [
  { id: "r1", from: "Indore", to: "Bhopal" },
  { id: "r2", from: "Indore", to: "Delhi" },
  { id: "r3", from: "Mumbai", to: "Pune" },
  { id: "r4", from: "Bhopal", to: "Jaipur" },
  { id: "r5", from: "Jaipur", to: "Indore" },
  { id: "r6", from: "Bhopal", to: "Nagpur" },
];

const STATUS = {
  healthy: {
    label: "Healthy",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hex: "#10b981",
    weight: 1,
    flowDuration: "2.2s",
  },
  warning: {
    label: "At Risk",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hex: "#d97706",
    weight: 2,
    flowDuration: "1.3s",
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    hex: "#dc2626",
    weight: 3,
    flowDuration: "0.8s",
  },
};

const INITIAL_SHIPMENTS = [
  {
    id: "CG-10458",
    product: "Fruits",
    from: "Indore",
    to: "Bhopal",
    status: "healthy",
    temp: 6.8,
    humidity: 72,
    health: 92,
    risk: "LOW",
    eta: "2h 40m",
    progress: 0.55,
  },
  {
    id: "CG-10490",
    product: "Dairy",
    from: "Mumbai",
    to: "Pune",
    status: "critical",
    temp: 14.6,
    humidity: 84,
    health: 41,
    risk: "HIGH",
    eta: "1h 10m",
    progress: 0.3,
  },
  {
    id: "CG-10431",
    product: "Vegetables",
    from: "Bhopal",
    to: "Jaipur",
    status: "warning",
    temp: 9.2,
    humidity: 78,
    health: 68,
    risk: "MEDIUM",
    eta: "3h 05m",
    progress: 0.4,
  },
  {
    id: "CG-10422",
    product: "Meat",
    from: "Jaipur",
    to: "Indore",
    status: "healthy",
    temp: 4.1,
    humidity: 65,
    health: 95,
    risk: "LOW",
    eta: "4h 20m",
    progress: 0.2,
  },
  {
    id: "CG-10405",
    product: "Dairy",
    from: "Indore",
    to: "Delhi",
    status: "healthy",
    temp: 5.5,
    humidity: 70,
    health: 88,
    risk: "LOW",
    eta: "5h 50m",
    progress: 0.7,
  },
  {
    id: "CG-10467",
    product: "Fruits",
    from: "Pune",
    to: "Mumbai",
    status: "healthy",
    temp: 7.0,
    humidity: 69,
    health: 90,
    risk: "LOW",
    eta: "1h 05m",
    progress: 0.8,
  },
  {
    id: "CG-10478",
    product: "Vegetables",
    from: "Bhopal",
    to: "Nagpur",
    status: "warning",
    temp: 10.1,
    humidity: 75,
    health: 62,
    risk: "MEDIUM",
    eta: "2h 15m",
    progress: 0.5,
  },
];

const TREND = [
  { v: 78 }, { v: 81 }, { v: 79 }, { v: 84 }, { v: 82 }, { v: 86 }, { v: 86 },
];

const ACTIVITY_TEMPLATES = [
  { status: "healthy", text: "Temperature stabilized" },
  { status: "healthy", text: "Sensor heartbeat normal" },
  { status: "healthy", text: "Route progressing on schedule" },
  { status: "warning", text: "Humidity drifting above safe band" },
  { status: "warning", text: "Route delay +12 min" },
  { status: "warning", text: "Temperature trending upward" },
  { status: "critical", text: "Temperature excursion detected" },
  { status: "critical", text: "AI risk score increased" },
];

const INITIAL_ACTIVITY = [
  { id: "a1", shipmentId: "CG-10458", status: "healthy", text: "Temperature stabilized", at: Date.now() - 2000 },
  { id: "a2", shipmentId: "CG-10490", status: "critical", text: "Temperature excursion detected", at: Date.now() - 8000 },
  { id: "a3", shipmentId: "CG-10431", status: "warning", text: "Route delay +12 min", at: Date.now() - 14000 },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */

function pointOnRoute(from, to, t) {
  const a = CITIES[from];
  const b = CITIES[to];
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.08;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.08;
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
  const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
  return { x, y };
}

function curvePath(from, to) {
  const a = CITIES[from];
  const b = CITIES[to];
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.08;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.08;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function routeKey(from, to) {
  return [from, to].sort().join("__");
}

function formatAgo(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 2) return "just now";
  if (s < 60) return `${s} sec ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/** Framer-Motion-equivalent reveal: fade + slight rise, custom easing, staggerable via delay. */
function Reveal({ children, delay = 0, y = 12, className = "" }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px)" : `translateY(${y}px)`,
        transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Small animated radial health ring — draws in on mount / value change. */
function HealthRing({ value, hex, size = 40, stroke = 4 }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 40);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, shown)) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eee9e0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={hex}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="700"
        fill="#0f3d2e"
      >
        {value}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TRACKING HERO                                                       */
/* ------------------------------------------------------------------ */

function TrackingHero({ activeCount }) {
  const count = useCountUp(activeCount);
  const [secondsAgo, setSecondsAgo] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const metrics = [
    {
      label: "Active Shipments",
      value: Math.round(count),
      icon: null,
    },
    {
      label: "Live Sync",
      value: "Streaming",
      sub: secondsAgo < 3 ? "Updated just now" : `Updated ${secondsAgo}s ago`,
      icon: Radio,
      live: true,
    },
    {
      label: "Sensor Network",
      value: "6 / 6 online",
      icon: Wifi,
    },
  ];

  return (
    <div className="mb-10">
      <Reveal delay={0}>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-700 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Live Tracking
        </div>
      </Reveal>

      <div className="mt-5 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <Reveal delay={90}>
            <h1 className="text-[2.75rem] sm:text-[3.4rem] font-[800] tracking-[-0.03em] text-emerald-950 leading-[1.02]">
              Every route.
              <br />
              <span className="text-emerald-600">Watched in motion.</span>
            </h1>
          </Reveal>
          <Reveal delay={190}>
            <p className="mt-4 max-w-lg text-stone-500 text-[15.5px] leading-relaxed">
              Monitor shipment locations, route progress and cold-chain
              conditions across your entire network in real time.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-wrap gap-3">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={260 + i * 90} y={14}>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 shadow-[0_1px_2px_rgba(15,61,46,0.04),0_8px_24px_-14px_rgba(15,61,46,0.18)] min-w-[150px]">
                {m.icon && (
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      m.live ? "bg-emerald-50 text-emerald-600" : "bg-stone-50 text-stone-500"
                    }`}
                  >
                    {m.live ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    ) : (
                      <m.icon size={15} />
                    )}
                  </span>
                )}
                <div>
                  <div className="text-[15px] font-bold text-emerald-950 tabular-nums leading-tight">
                    {m.value}
                  </div>
                  <div className="text-[10.5px] uppercase tracking-wide text-stone-400">
                    {m.sub || m.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SHIPMENT MARKER                                                     */
/* ------------------------------------------------------------------ */

function ShipmentMarker({ shipment, selected, hovered, dimmed, onSelect, onHover }) {
  const pos = pointOnRoute(shipment.from, shipment.to, shipment.progress);
  const s = STATUS[shipment.status];
  const isCritical = shipment.status === "critical";
  const emphasized = selected || hovered;

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      onClick={() => onSelect(shipment.id)}
      onMouseEnter={() => onHover(shipment.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
      style={{ opacity: dimmed ? 0.32 : 1, transition: "opacity 0.35s ease" }}
    >
      <circle
        r={isCritical ? 9 : 7.5}
        fill={s.hex}
        className={isCritical ? "radar-ring-critical" : "radar-ring"}
        opacity={0.5}
      />
      {(isCritical || emphasized) && (
        <circle
          r={isCritical ? 9 : 7.5}
          fill={s.hex}
          className={isCritical ? "radar-ring-critical" : "radar-ring"}
          opacity={0.35}
          style={{ animationDelay: "0.7s" }}
        />
      )}

      {selected && (
        <>
          <circle r={17} fill={s.hex} opacity={0.08} />
          <circle r={13} fill="none" stroke={s.hex} strokeWidth={1.4} opacity={0.55} />
        </>
      )}
      {hovered && !selected && (
        <circle r={11} fill="none" stroke={s.hex} strokeWidth={1.2} opacity={0.4} />
      )}

      <g className="marker-float">
        <circle r={emphasized ? 7 : 5.5} fill="white" stroke={s.hex} strokeWidth={2.4} />
        <circle r={2.4} fill={s.hex} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  MAP CONTROLS                                                        */
/* ------------------------------------------------------------------ */

function MapControls({ setZoom, onRecenter, onFitAll, view, setView, live, setLive }) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 active:scale-90";
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm p-1">
        <button className={btn} onClick={() => setZoom((z) => Math.min(1.7, z + 0.15))} title="Zoom in">
          <Plus size={15} />
        </button>
        <div className="h-px bg-stone-200 mx-1" />
        <button className={btn} onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} title="Zoom out">
          <Minus size={15} />
        </button>
      </div>
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm p-1">
        <button className={btn} onClick={onRecenter} title="Recenter">
          <Crosshair size={15} />
        </button>
        <div className="h-px bg-stone-200 mx-1" />
        <button className={btn} onClick={onFitAll} title="Fit all shipments">
          <Maximize2 size={15} />
        </button>
      </div>
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm p-1">
        <button
          className={btn}
          onClick={() => setView(view === "map" ? "satellite" : "map")}
          title="Toggle map / satellite"
        >
          {view === "map" ? <Satellite size={15} /> : <MapIcon size={15} />}
        </button>
      </div>
      <button
        onClick={() => setLive((l) => !l)}
        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm transition-all duration-200 active:scale-95 ${
          live
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-stone-200 bg-white/95 text-stone-400"
        }`}
      >
        <Radio size={12} className={live ? "animate-pulse" : ""} />
        {live ? "Live" : "Paused"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAP OVERLAYS — command-center corners                               */
/* ------------------------------------------------------------------ */

function MapCornerOverlays({ liveCount, hoveredShipment }) {
  return (
    <>
      {/* top-left: network label */}
      <div className="absolute left-4 top-4 z-10 rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-stone-400 uppercase">
          <Sparkles size={11} className="text-emerald-500" />
          Live Network
        </div>
        <div className="mt-0.5 text-[13px] font-bold text-emerald-950">
          {liveCount} active shipments
        </div>
      </div>

      {/* bottom-right: network status */}
      <div className="absolute right-4 bottom-4 z-10 rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-stone-400 uppercase">
          <Signal size={11} className="text-emerald-500" />
          Network Status
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-950">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Stable · 8/8 routes online
        </div>
      </div>

      {/* transient hover readout, next to the legend */}
      {hoveredShipment && (
        <div className="absolute left-4 bottom-[4.75rem] z-10 rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm px-3.5 py-2 animate-[fadeIn_0.2s_ease]">
          <div className="text-[12px] font-semibold text-emerald-950">{hoveredShipment.id}</div>
          <div className="text-[11px] text-stone-400">
            {hoveredShipment.from} → {hoveredShipment.to} · {hoveredShipment.temp.toFixed(1)}°C
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MAP LEGEND                                                          */
/* ------------------------------------------------------------------ */

function MapLegend() {
  return (
    <div className="absolute left-4 bottom-4 z-10 rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3">
      <div className="flex items-center gap-4 text-[12px]">
        {Object.entries(STATUS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5 text-stone-600">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SELECTED SHIPMENT PANEL — premium AI intelligence card              */
/* ------------------------------------------------------------------ */

function aiInterpretation(shipment) {
  const SAFE_MAX = 10;
  if (shipment.status === "critical") {
    const delta = Math.max(0, Math.round((shipment.temp - SAFE_MAX) * 10) / 10);
    return {
      lines: [
        `Temperature is ${delta}°C above the recommended range.`,
        "Estimated spoilage risk is increasing.",
      ],
      action: "Inspect refrigeration system",
    };
  }
  if (shipment.status === "warning") {
    return {
      lines: [
        "Conditions are drifting outside the optimal band.",
        "Continued monitoring is recommended.",
      ],
      action: null,
    };
  }
  return {
    lines: ["Conditions are within the optimal range.", "No action required."],
    action: null,
  };
}

function useTrendSeries(temp) {
  const [series, setSeries] = useState(() => {
    const base = temp;
    return Array.from({ length: 8 }, (_, i) => ({
      v: Math.round((base + Math.sin(i / 1.4) * 0.35 - 0.6 + i * 0.09) * 10) / 10,
    }));
  });
  useEffect(() => {
    setSeries((prev) => [...prev.slice(1), { v: temp }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temp]);
  return series;
}

function SelectedShipmentPanel({ shipment, onClose, mobile }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(false);
    const t = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(t);
  }, [shipment && shipment.id]);

  const trend = useTrendSeries(shipment ? shipment.temp : 0);

  if (!shipment) return null;
  const s = STATUS[shipment.status];
  const isCritical = shipment.status === "critical";
  const ai = aiInterpretation(shipment);

  return (
    <>
      {!mobile && (
        <svg
          viewBox="0 0 600 500"
          className="absolute inset-0 h-full w-full pointer-events-none z-[15]"
          style={{ opacity: shown ? 1 : 0, transition: "opacity 0.35s ease" }}
        >
          <line
            x1={pointOnRoute(shipment.from, shipment.to, shipment.progress).x}
            y1={pointOnRoute(shipment.from, shipment.to, shipment.progress).y}
            x2={560}
            y2={56}
            stroke={s.hex}
            strokeWidth={1.2}
            strokeDasharray="3 4"
            opacity={0.55}
          />
          <circle cx={560} cy={56} r={3} fill={s.hex} opacity={0.7} />
        </svg>
      )}

      <div
        className={
          mobile
            ? "relative w-full rounded-[1.75rem] border bg-white/97 backdrop-blur-md shadow-[0_20px_50px_-15px_rgba(15,61,46,0.2)] p-5"
            : "absolute right-4 top-20 z-20 w-[300px] rounded-[1.75rem] border bg-white/97 backdrop-blur-md shadow-[0_20px_50px_-15px_rgba(15,61,46,0.25)] p-5"
        }
        style={{
          borderColor: isCritical ? "#fecaca" : "#e7e5e4",
          opacity: shown ? 1 : 0,
          transform: shown
            ? "translateX(0) scale(1)"
            : mobile
            ? "translateY(10px) scale(0.98)"
            : "translateX(14px) scale(0.96)",
          transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-300 hover:text-stone-500 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: s.hex }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: s.hex }} />
          </span>
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-stone-400">
            Live signal · {shipment.product}
          </span>
        </div>

        <div className="mt-2 text-xl font-[800] tracking-tight text-emerald-950">{shipment.id}</div>
        <div className="text-[13px] text-stone-500">
          {shipment.from} → {shipment.to}
        </div>

        <div
          className={`mt-2.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${s.bg} ${s.text} border ${s.border}`}
        >
          {shipment.status === "critical" ? "CRITICAL" : "IN TRANSIT"}
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-stone-50 border border-stone-100 p-3.5">
          <HealthRing value={shipment.health} hex={s.hex} />
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
            <div>
              <div className="flex items-center gap-1 text-stone-400 text-[10.5px]">
                <Thermometer size={11} /> Temp
              </div>
              <div className={`font-bold tabular-nums ${isCritical ? "text-red-600" : "text-emerald-950"}`}>
                {shipment.temp.toFixed(1)}°C
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-stone-400 text-[10.5px]">
                <Droplets size={11} /> Humidity
              </div>
              <div className="font-bold text-emerald-950">{shipment.humidity}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-stone-400 text-[10.5px]">
                <ShieldAlert size={11} /> AI Risk
              </div>
              <div className={`font-bold ${s.text}`}>{shipment.risk}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-stone-400 text-[10.5px]">
                <Clock size={11} /> ETA
              </div>
              <div className="font-bold text-emerald-950">{shipment.eta}</div>
            </div>
          </div>
        </div>

        {/* mini live sensor trend */}
        <div className="mt-3 rounded-2xl border border-stone-100 bg-white p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10.5px] font-semibold tracking-wide text-stone-400 uppercase">
              Temperature Trend
            </span>
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              live
            </span>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={s.hex}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI interpretation */}
        <div
          className={`mt-3 rounded-2xl border p-3.5 ${
            isCritical ? "border-red-200 bg-red-50" : "border-stone-100 bg-stone-50"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[10.5px] font-semibold tracking-wide uppercase ${
              isCritical ? "text-red-700" : "text-stone-400"
            }`}
          >
            <Sparkles size={11} />
            AI Interpretation
          </div>
          {ai.lines.map((line) => (
            <div
              key={line}
              className={`mt-1 text-[12px] leading-snug ${isCritical ? "text-red-700" : "text-stone-600"}`}
            >
              {line}
            </div>
          ))}
          {ai.action && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-red-700">
              <Wrench size={12} />
              {ai.action}
            </div>
          )}
        </div>

        <button className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-950 py-2.5 text-[13px] font-semibold text-white hover:bg-emerald-900 transition-all duration-200 active:scale-[0.98]">
          View Shipment Details <ChevronRight size={14} />
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TRACKING MAP  (presentational — live data owned by the page)        */
/* ------------------------------------------------------------------ */

function TrackingMap({ shipments, selectedId, onSelect, hoveredId, onHover, live, setLive }) {
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState("map");

  const selected = shipments.find((s) => s.id === selectedId);
  const hovered = shipments.find((s) => s.id === hoveredId);

  const routeStatus = useMemo(() => {
    const map = {};
    shipments.forEach((sh) => {
      const key = routeKey(sh.from, sh.to);
      const w = STATUS[sh.status].weight;
      if (!map[key] || w > map[key].weight) map[key] = { status: sh.status, weight: w };
    });
    return map;
  }, [shipments]);

  const selectedRouteKey = selected ? routeKey(selected.from, selected.to) : null;

  return (
    <div className="relative rounded-[2rem] border border-stone-200 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50/80 shadow-[0_1px_2px_rgba(15,61,46,0.04),0_20px_60px_-24px_rgba(15,61,46,0.18)] overflow-hidden">
      <div className="relative h-[440px] sm:h-[500px] lg:h-[600px]">
        <svg
          viewBox="0 0 600 500"
          className="h-full w-full"
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transformOrigin: "center",
          }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="32%" r="72%">
              <stop offset="0%" stopColor={view === "map" ? "#f0faf4" : "#082f21"} />
              <stop offset="100%" stopColor={view === "map" ? "#faf9f5" : "#04150f"} />
            </radialGradient>
            <pattern id="dotGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill={view === "map" ? "#0f3d2e" : "#eafff2"} opacity="0.16" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="600" height="500" fill="url(#mapGlow)" />
          <rect x="0" y="0" width="600" height="500" fill="url(#dotGrid)" className="grid-breathe" />

          {/* abstract India-like landmass */}
          <path
            d="M 300 20 L 360 40 L 400 90 L 430 150 L 470 210 L 460 270 L 420 320 L 440 360 L 400 420 L 340 460 L 260 470 L 200 440 L 160 400 L 130 350 L 110 290 L 130 220 L 150 160 L 190 100 L 240 50 Z"
            fill={view === "map" ? "#eaf4ec" : "#0b3826"}
            stroke={view === "map" ? "#d3e5d7" : "#155a3f"}
            strokeWidth="1.5"
            opacity={view === "map" ? 1 : 0.9}
          />

          {/* base + animated flow lines, colored by worst status on that corridor */}
          {ROUTES.map((r) => {
            const key = routeKey(r.from, r.to);
            const rs = routeStatus[key] || { status: "healthy" };
            const sInfo = STATUS[rs.status];
            const isSelectedRoute = selectedRouteKey === key;
            const dimmed = selectedRouteKey && !isSelectedRoute;
            const isHoveredRoute = hovered && routeKey(hovered.from, hovered.to) === key;
            return (
              <g
                key={r.id}
                style={{ opacity: dimmed ? 0.28 : 1, transition: "opacity 0.35s ease" }}
                onMouseEnter={() => {
                  const sh = shipments.find((s2) => routeKey(s2.from, s2.to) === key);
                  if (sh) onHover(sh.id);
                }}
                onMouseLeave={() => onHover(null)}
                className="cursor-pointer"
              >
                <path
                  d={curvePath(r.from, r.to)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                />
                <path
                  d={curvePath(r.from, r.to)}
                  fill="none"
                  stroke={view === "map" ? "#bcd6c2" : "#2f7a55"}
                  strokeWidth={isSelectedRoute || isHoveredRoute ? 2.2 : 1.6}
                  opacity="0.7"
                  style={{ transition: "stroke-width 0.25s ease" }}
                />
                <path
                  d={curvePath(r.from, r.to)}
                  fill="none"
                  stroke={sInfo.hex}
                  strokeWidth={isSelectedRoute || isHoveredRoute ? 2 : 1.6}
                  strokeDasharray="1 7"
                  strokeLinecap="round"
                  className={`route-flow ${rs.status === "critical" ? "route-breathe" : ""}`}
                  style={{ animationDuration: sInfo.flowDuration }}
                  opacity={isSelectedRoute || isHoveredRoute ? 1 : 0.85}
                />
              </g>
            );
          })}

          {/* colored progress overlay per shipment — brighter when selected/hovered */}
          {shipments.map((sh) => {
            const emphasized = sh.id === selectedId || sh.id === hoveredId;
            const dimmed = selectedId && sh.id !== selectedId && routeKey(sh.from, sh.to) !== selectedRouteKey;
            return (
              <path
                key={"progress-" + sh.id}
                d={curvePath(sh.from, sh.to)}
                fill="none"
                stroke={STATUS[sh.status].hex}
                strokeWidth={emphasized ? 3.6 : 2.4}
                strokeLinecap="round"
                opacity={dimmed ? 0.15 : emphasized ? 0.9 : 0.5}
                pathLength="1"
                strokeDasharray={`${sh.progress} 1`}
                style={{ transition: "stroke-width 0.25s ease, opacity 0.25s ease" }}
              />
            );
          })}

          {/* city nodes */}
          {Object.entries(CITIES).map(([name, p]) => {
            const isEmphasizedCity =
              (selected && (selected.from === name || selected.to === name)) ||
              (hovered && (hovered.from === name || hovered.to === name));
            return (
              <g key={name} transform={`translate(${p.x}, ${p.y})`} style={{ transition: "all 0.25s ease" }}>
                <circle
                  r={isEmphasizedCity ? 4.4 : 3.2}
                  fill={view === "map" ? "#0f3d2e" : "#eafff2"}
                  style={{ transition: "r 0.25s ease" }}
                />
                <text
                  x="7.5"
                  y="3.5"
                  fontSize={isEmphasizedCity ? "11.5" : "10.5"}
                  fontWeight={isEmphasizedCity ? "800" : "600"}
                  fill={view === "map" ? "#3f5a4c" : "#c8ede0"}
                >
                  {name}
                </text>
              </g>
            );
          })}

          {/* shipment markers */}
          {shipments.map((sh) => {
            const dimmed = selectedId && sh.id !== selectedId && routeKey(sh.from, sh.to) !== selectedRouteKey;
            return (
              <ShipmentMarker
                key={sh.id}
                shipment={sh}
                selected={sh.id === selectedId}
                hovered={sh.id === hoveredId}
                dimmed={dimmed}
                onSelect={onSelect}
                onHover={onHover}
              />
            );
          })}
        </svg>

        <MapCornerOverlays liveCount={shipments.length} hoveredShipment={!selected ? hovered : null} />
        <MapControls
          setZoom={setZoom}
          onRecenter={() => setZoom(1)}
          onFitAll={() => setZoom(0.85)}
          view={view}
          setView={setView}
          live={live}
          setLive={setLive}
        />
        <MapLegend />
        {selected && (
          <SelectedShipmentPanel shipment={selected} onClose={() => onSelect(null)} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE ACTIVITY                                                       */
/* ------------------------------------------------------------------ */

function ActivityRow({ event, isFirst }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(t);
  }, []);
  const s = STATUS[event.status];
  const [, tick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const isCritical = event.status === "critical";

  return (
    <div
      className={`relative flex items-start gap-2.5 px-4 py-2.5 ${isFirst ? "" : "border-t border-stone-100"} ${
        isCritical ? "bg-red-50/40" : ""
      }`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px) scale(1)" : "translateY(-6px) scale(0.98)",
        transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {isCritical && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-500" />}
      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.dot} ${isCritical ? "animate-pulse" : ""}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[12.5px] font-semibold ${isCritical ? "text-red-700" : "text-emerald-950"}`}>
            {event.shipmentId}
          </span>
          <span className="shrink-0 text-[10.5px] text-stone-400 tabular-nums">
            {formatAgo(Date.now() - event.at)}
          </span>
        </div>
        <div className={`text-[12px] ${isCritical ? "text-red-600 font-medium" : "text-stone-500"}`}>
          {event.text}
        </div>
      </div>
    </div>
  );
}

function LiveActivity({ live }) {
  const [events, setEvents] = useState(INITIAL_ACTIVITY);

  useEffect(() => {
    if (!live) return;
    const schedule = () => 8000 + Math.random() * 6000;
    let timeoutId;
    const spawn = () => {
      const shipment = INITIAL_SHIPMENTS[Math.floor(Math.random() * INITIAL_SHIPMENTS.length)];
      const pool = ACTIVITY_TEMPLATES.filter((t) => t.status === shipment.status);
      const template = pool[Math.floor(Math.random() * pool.length)] || ACTIVITY_TEMPLATES[0];
      setEvents((prev) => [
        { id: `a-${Date.now()}`, shipmentId: shipment.id, status: template.status, text: template.text, at: Date.now() },
        ...prev,
      ].slice(0, 6));
      timeoutId = setTimeout(spawn, schedule());
    };
    timeoutId = setTimeout(spawn, schedule());
    return () => clearTimeout(timeoutId);
  }, [live]);

  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_1px_2px_rgba(15,61,46,0.04),0_16px_40px_-20px_rgba(15,61,46,0.15)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-stone-400 uppercase">
          <Zap size={13} className="text-emerald-500" />
          Live Activity
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wide text-emerald-600">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          LIVE
        </div>
      </div>
      <div>
        {events.map((e, i) => (
          <ActivityRow key={e.id} event={e} isFirst={i === 0} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TRACKING FILTERS                                                    */
/* ------------------------------------------------------------------ */

function TrackingFilters({ filter, setFilter, query, setQuery }) {
  const options = [
    { key: "all", label: "All" },
    { key: "healthy", label: "Healthy" },
    { key: "warning", label: "At Risk" },
    { key: "critical", label: "Critical" },
  ];
  const activeIndex = Math.max(0, options.findIndex((o) => o.key === filter));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div className="relative inline-grid grid-cols-4 rounded-full bg-stone-100 p-1">
        <div
          className="absolute inset-y-1 rounded-full bg-emerald-950 shadow-sm"
          style={{
            width: `calc(25% - 2px)`,
            left: 4,
            transform: `translateX(calc(${activeIndex} * 100%))`,
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => setFilter(o.key)}
            className={`relative z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-200 active:scale-95 ${
              filter === o.key ? "text-white" : "text-stone-500 hover:text-emerald-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="relative flex-1 sm:max-w-[220px] sm:focus-within:max-w-[260px] sm:ml-auto transition-[max-width] duration-300 ease-out">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors peer-focus:text-emerald-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ID or route"
          className="peer w-full rounded-full border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-[12px] text-stone-600 placeholder:text-stone-400 outline-none transition-all duration-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:shadow-[0_4px_16px_-8px_rgba(16,185,129,0.35)]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACTIVE SHIPMENTS LIST (fleet)                                       */
/* ------------------------------------------------------------------ */

function ActiveShipmentsList({ shipments, selectedId, onSelect, hoveredId, onHover }) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_1px_2px_rgba(15,61,46,0.04),0_16px_40px_-20px_rgba(15,61,46,0.15)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="text-sm font-semibold text-emerald-950">Live Fleet</div>
        <div className="text-[11px] text-stone-400">{shipments.length} shown</div>
      </div>
      <div className="max-h-[460px] overflow-y-auto divide-y divide-stone-100">
        {shipments.map((sh) => {
          const s = STATUS[sh.status];
          const active = sh.id === selectedId;
          const isCritical = sh.status === "critical";
          return (
            <button
              key={sh.id}
              onClick={() => onSelect(active ? null : sh.id)}
              onMouseEnter={() => onHover(sh.id)}
              onMouseLeave={() => onHover(null)}
              className={`group relative w-full text-left px-5 py-3.5 transition-all duration-200 ${
                active
                  ? "bg-emerald-50/70"
                  : isCritical
                  ? "bg-red-50/40 hover:bg-red-50/70"
                  : "hover:bg-stone-50"
              }`}
              style={{ transform: "translateX(0px)" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateX(0px)")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${s.dot} ${isCritical ? "animate-pulse" : ""}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-emerald-950">{sh.id}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                      {sh.risk}
                    </span>
                  </div>
                  <div className="text-[12px] text-stone-400 truncate">
                    {sh.from} → {sh.to}
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-stone-500">
                    <span
                      className={`flex items-center gap-1 tabular-nums ${
                        isCritical ? "text-red-600 font-medium" : ""
                      }`}
                    >
                      <Thermometer size={11} /> {sh.temp.toFixed(1)}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={11} /> {sh.health} health
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> ETA {sh.eta}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`shrink-0 transition-all duration-200 ${
                    active
                      ? "text-emerald-500 opacity-100 translate-x-0"
                      : "text-stone-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </div>
            </button>
          );
        })}
        {shipments.length === 0 && (
          <div className="px-5 py-10 text-center text-[13px] text-stone-400">
            No shipments match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROUTE INTELLIGENCE                                                  */
/* ------------------------------------------------------------------ */

function RouteIntelligence() {
  const stats = [
    { label: "Active routes", value: 8 },
    { label: "Routes at risk", value: 2 },
    {
      label: "Critical shipment",
      value: 1,
      accent: "text-red-600",
      trend: { icon: TrendingDown, text: "1 critical", tone: "text-emerald-600" },
    },
    {
      label: "Avg. route health",
      value: "86/100",
      accent: "text-emerald-700",
      trend: { icon: TrendingUp, text: "4.2%", tone: "text-emerald-600" },
    },
  ];
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_1px_2px_rgba(15,61,46,0.04),0_16px_40px_-20px_rgba(15,61,46,0.15)] p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-4">
        <RouteIcon size={13} className="text-emerald-600" />
        Route Intelligence
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className={`text-xl font-bold tabular-nums ${s.accent || "text-emerald-950"}`}>
              {s.value}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">{s.label}</div>
            {s.trend && (
              <div className={`mt-1 inline-flex items-center gap-1 text-[10.5px] font-medium ${s.trend.tone}`}>
                <s.trend.icon size={11} />
                {s.trend.text}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="h-14 mt-4 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TREND} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE — owns the single live-data source shared by map/list/activity */
/* ------------------------------------------------------------------ */

export default function LiveTrackingPage() {
  const [liveShipments, setLiveShipments] = useState(INITIAL_SHIPMENTS);
  const [live, setLive] = useState(true);
  const [selectedId, setSelectedId] = useState("CG-10490");
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  // single interval driving route progress + tiny sensor jitter —
  // this is the one place to swap in a real API poll later
  useEffect(() => {
    if (!live) return;
    const iv = setInterval(() => {
      setLiveShipments((prev) =>
        prev.map((s) => {
          const nextProgress = (s.progress + 0.0018) % 1;
          let temp = s.temp;
          if (Math.random() < 0.006) {
            temp = Math.round((s.temp + (Math.random() - 0.5) * 0.2) * 10) / 10;
          }
          return { ...s, progress: nextProgress, temp };
        })
      );
    }, 60);
    return () => clearInterval(iv);
  }, [live]);

  const filtered = useMemo(() => {
    return liveShipments.filter((s) => {
      const matchesFilter = filter === "all" || s.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.id.toLowerCase().includes(q) ||
        s.from.toLowerCase().includes(q) ||
        s.to.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [liveShipments, filter, query]);

  const selectedShipment = liveShipments.find((s) => s.id === selectedId) || null;

  return (
    <div className="cc-root min-h-screen bg-stone-50 text-stone-800 overflow-x-hidden">
      <MotionStyles />

      <div className="mx-auto px-6 py-10" style={{ maxWidth: 1480 }}>
        <TrackingHero activeCount={24} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <Reveal delay={300} y={20}>
            <div className="flex flex-col gap-6">
              <TrackingMap
                shipments={liveShipments}
                selectedId={selectedId}
                onSelect={setSelectedId}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                live={live}
                setLive={setLive}
              />

              {/* mobile-only: selected shipment stacks right below the map, before the fleet list */}
              {selectedShipment && (
                <div className="block xl:hidden">
                  <SelectedShipmentPanel shipment={selectedShipment} onClose={() => setSelectedId(null)} mobile />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiveActivity live={live} />
                <RouteIntelligence />
              </div>
            </div>
          </Reveal>

          <Reveal delay={380} y={20}>
            <div>
              <TrackingFilters filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} />
              <ActiveShipmentsList
                shipments={filtered}
                selectedId={selectedId}
                onSelect={setSelectedId}
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <CheckCircle2 size={12} />
          ChillChain AI · SHT40 + ESP32 · AI Risk Engine · Hackathon build
        </div>
      </div>
    </div>
  );
}