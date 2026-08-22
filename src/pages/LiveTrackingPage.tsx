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
import { io, Socket } from "socket.io-client";

const API_BASE_URL = "http://localhost:5000";

/* ------------------------------------------------------------------ */
/*  GLOBAL MOTION + TYPE STYLES                                       */
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
    @keyframes gridBreathe {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.55; }
    }

    .route-flow { animation: routeFlow 1.6s linear infinite; }
    .radar-ring { transform-origin: center; transform-box: fill-box; animation: radarPulse 2.6s ease-out infinite; }
    .radar-ring-critical { transform-origin: center; transform-box: fill-box; animation: radarPulseCritical 1.4s ease-out infinite; }
    .marker-float { transform-box: fill-box; transform-origin: center; animation: softFloat 3.2s ease-in-out infinite; }
    .grid-breathe { animation: gridBreathe 7s ease-in-out infinite; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  STATIC COORDINATES & MAP TOKEN STYLES                            */
/* ------------------------------------------------------------------ */

// Expanded city coordinates to prevent undefined positions on new shipments
const CITIES: Record<string, { x: number; y: number }> = {
  Delhi: { x: 300, y: 48 },
  Jaipur: { x: 228, y: 128 },
  Indore: { x: 268, y: 268 },
  Bhopal: { x: 350, y: 266 },
  Nagpur: { x: 432, y: 328 },
  Mumbai: { x: 168, y: 390 },
  Pune: { x: 230, y: 430 },
  Raipur: { x: 490, y: 280 },
};

const STATUS: Record<string, any> = {
  healthy: {
    label: "Healthy",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hex: "#10b981",
    weight: 1,
  },
  warning: {
    label: "At Risk",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hex: "#d97706",
    weight: 2,
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    hex: "#dc2626",
    weight: 3,
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
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

function normalizeStatus(statusStr: string): string {
  if (!statusStr) return "healthy";
  const s = statusStr.toUpperCase();
  if (s === "CRITICAL") return "critical";
  if (s === "AT_RISK" || s === "WARNING") return "warning";
  return "healthy";
}

function pointOnRoute(from: string, to: string, t: number) {
  const a = CITIES[from] || CITIES["Mumbai"];
  const b = CITIES[to] || CITIES["Pune"];
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.08;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.08;
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
  const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
  return { x, y };
}

function curvePath(from: string, to: string) {
  const a = CITIES[from] || CITIES["Mumbai"];
  const b = CITIES[to] || CITIES["Pune"];
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.08;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.08;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function formatAgo(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 2) return "just now";
  if (s < 60) return `${s} sec ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
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

function Reveal({ children, delay = 0, y = 12, className = "" }: any) {
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

function HealthRing({ value = 100, hex, size = 40, stroke = 4 }: any) {
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
/*  HERO COMPONENT                                                    */
/* ------------------------------------------------------------------ */

function TrackingHero({ activeCount }: { activeCount: number }) {
  const count = useCountUp(activeCount);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const metrics = [
    { label: "Active Shipments", value: Math.round(count), icon: null },
    {
      label: "Live Sync",
      value: "Streaming",
      sub: secondsAgo < 3 ? "Updated just now" : `Updated ${secondsAgo}s ago`,
      icon: Radio,
      live: true,
    },
    { label: "Sensor Network", value: "Active", icon: Wifi },
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
/*  SHIPMENT MARKER                                                   */
/* ------------------------------------------------------------------ */

function ShipmentMarker({ shipment, selected, hovered, dimmed, onSelect, onHover }: any) {
  const pos = pointOnRoute(shipment.from, shipment.to, shipment.progress ?? 0.5);
  const s = STATUS[shipment.status] || STATUS["healthy"];
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
      <g className="marker-float">
        <circle r={emphasized ? 7 : 5.5} fill="white" stroke={s.hex} strokeWidth={2.4} />
        <circle r={2.4} fill={s.hex} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  MAP & OVERLAYS                                                    */
/* ------------------------------------------------------------------ */

function MapControls({ setZoom, onRecenter, live, setLive }: any) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 active:scale-90";
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm p-1">
        <button className={btn} onClick={() => setZoom((z: number) => Math.min(1.7, z + 0.15))}>
          <Plus size={15} />
        </button>
        <div className="h-px bg-stone-200 mx-1" />
        <button className={btn} onClick={() => setZoom((z: number) => Math.max(0.7, z - 0.15))}>
          <Minus size={15} />
        </button>
      </div>
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm p-1">
        <button className={btn} onClick={onRecenter}>
          <Crosshair size={15} />
        </button>
      </div>
      <button
        onClick={() => setLive((l: boolean) => !l)}
        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${
          live ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-stone-200 bg-white/95 text-stone-400"
        }`}
      >
        <Radio size={12} className={live ? "animate-pulse" : ""} />
        {live ? "Live" : "Paused"}
      </button>
    </div>
  );
}

function SelectedShipmentPanel({ shipment, onClose }: any) {
  if (!shipment) return null;
  const s = STATUS[shipment.status] || STATUS["healthy"];
  const isCritical = shipment.status === "critical";
  const temp = (shipment.temp ?? 0).toFixed(1);
  const humidity = (shipment.humidity ?? 0).toFixed(0);

  return (
    <div className="absolute right-4 top-20 z-20 w-[300px] rounded-[1.75rem] border bg-white/97 backdrop-blur-md p-5 border-stone-200 shadow-xl">
      <button onClick={onClose} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600">
        <X size={16} />
      </button>
      <div className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
        {shipment.product || "Perishable Cargo"}
      </div>
      <div className="mt-1 text-xl font-[800] text-emerald-950">{shipment.id}</div>
      <div className="text-[13px] text-stone-500">{shipment.from} → {shipment.to}</div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-stone-50 p-3.5 border border-stone-100">
        <HealthRing value={shipment.health ?? 90} hex={s.hex} />
        <div className="flex-1 grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <div className="text-stone-400 text-[10px]">Temp</div>
            <div className={`font-bold ${isCritical ? "text-red-600" : "text-emerald-950"}`}>
              {temp}°C
            </div>
          </div>
          <div>
            <div className="text-stone-400 text-[10px]">Humidity</div>
            <div className="font-bold text-emerald-950">{humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingMap({ shipments, selectedId, onSelect, hoveredId, onHover, live, setLive }: any) {
  const [zoom, setZoom] = useState(1);
  const selected = shipments.find((s: any) => s.id === selectedId);

  return (
    <div className="relative rounded-[2rem] border border-stone-200 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50/80 shadow-md overflow-hidden">
      <div className="relative h-[440px] sm:h-[500px] lg:h-[600px]">
        <svg
          viewBox="0 0 600 500"
          className="h-full w-full"
          style={{ transform: `scale(${zoom})`, transition: "transform 0.4s ease" }}
        >
          <rect x="0" y="0" width="600" height="500" fill="#faf9f5" />
          
          {/* Dynamically draw paths for active shipment routes */}
          {shipments.map((sh: any) => (
            <path
              key={`route-${sh.id}`}
              d={curvePath(sh.from, sh.to)}
              fill="none"
              stroke="#bcd6c2"
              strokeWidth="1.6"
            />
          ))}

          {shipments.map((sh: any) => (
            <ShipmentMarker
              key={sh.id}
              shipment={sh}
              selected={sh.id === selectedId}
              hovered={sh.id === hoveredId}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </svg>
        <MapControls setZoom={setZoom} onRecenter={() => setZoom(1)} live={live} setLive={setLive} />
        {selected && <SelectedShipmentPanel shipment={selected} onClose={() => onSelect(null)} />}
      </div>
    </div>
  );
}

function LiveActivity({ events }: { events: any[] }) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white shadow-sm overflow-hidden p-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
        <span className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase">
          Live Telemetry Feed
        </span>
        <span className="text-[10.5px] font-bold text-emerald-600">WEBSOCKET ONLINE</span>
      </div>
      <div className="space-y-3 max-h-[220px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-xs text-stone-400 py-2">Listening for incoming telemetry pings...</div>
        ) : (
          events.map((e, idx) => (
            <div key={idx} className="flex items-center justify-between text-[12px] border-b border-stone-50 pb-2">
              <div>
                <span className="font-semibold text-emerald-950">{e.shipmentId}</span>: {e.text}
              </div>
              <span className="text-[10px] text-stone-400">{formatAgo(Date.now() - e.at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE CONTAINER                                               */
/* ------------------------------------------------------------------ */

export default function LiveTrackingPage() {
  const [liveShipments, setLiveShipments] = useState<any[]>(INITIAL_SHIPMENTS);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [live, setLive] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>("CG-10490");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 1. Fetch initial shipment list from Express REST API
  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/shipments`);
      const resData = await res.json();
      const rawData = resData.data || resData;

      if (Array.isArray(rawData) && rawData.length > 0) {
        const mapped = rawData.map((sh: any) => ({
          id: sh.shipmentId || sh.id,
          product: sh.cargoType || "Perishables",
          from: sh.origin || "Mumbai",
          to: sh.destination || "Pune",
          status: normalizeStatus(sh.status),
          temp: Number(sh.currentTemp ?? sh.temperature ?? 0),
          humidity: Number(sh.currentHumidity ?? sh.humidity ?? 0),
          health: Number(sh.healthIndex ?? sh.health ?? 90),
          risk: (sh.aiRiskLevel || sh.aiRisk || "LOW").toUpperCase(),
          eta: typeof sh.eta === "string" ? sh.eta : "2h 10m",
          progress: (sh.routeProgress ?? 50) / 100,
        }));

        setLiveShipments(mapped);
        if (!selectedId && mapped.length > 0) {
          setSelectedId(mapped[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching shipments for live tracking:", err);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // 2. Connect Socket.io for live telemetry pings
  useEffect(() => {
    if (!live) return;

    const socket: Socket = io(API_BASE_URL);

    socket.on("telemetry_update", (payload: any) => {
      const { shipmentId, temperature, humidity, healthIndex, status, aiRiskLevel } = payload;

      setLiveShipments((prev) =>
        prev.map((sh) => {
          if (sh.id === shipmentId) {
            return {
              ...sh,
              temp: Number(temperature ?? sh.temp),
              humidity: Number(humidity ?? sh.humidity),
              health: Number(healthIndex ?? sh.health),
              status: normalizeStatus(status || sh.status),
              risk: (aiRiskLevel || sh.risk || "LOW").toUpperCase(),
            };
          }
          return sh;
        })
      );

      setLiveEvents((prev) => [
        {
          shipmentId,
          text: `Temp ${Number(temperature ?? 0).toFixed(1)}°C · Health ${healthIndex ?? 90}%`,
          status: normalizeStatus(status),
          at: Date.now(),
        },
        ...prev.slice(0, 9),
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [live]);

  return (
    <div className="cc-root min-h-screen bg-stone-50 text-stone-800 overflow-x-hidden">
      <MotionStyles />

      <div className="mx-auto px-6 py-10" style={{ maxWidth: 1480 }}>
        <TrackingHero activeCount={liveShipments.length} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
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

            <LiveActivity events={liveEvents} />
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-emerald-950 mb-3">Active Shipments</div>
            <div className="space-y-3 max-h-[620px] overflow-y-auto">
              {liveShipments.map((sh) => (
                <div
                  key={sh.id}
                  onClick={() => setSelectedId(sh.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                    sh.id === selectedId ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-stone-100 hover:border-stone-200"
                  }`}
                >
                  <div className="flex justify-between font-bold text-[13px]">
                    <span>{sh.id}</span>
                    <span className={sh.status === "critical" ? "text-red-600" : "text-emerald-700"}>
                      {(sh.temp ?? 0).toFixed(1)}°C
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">{sh.from} → {sh.to}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <CheckCircle2 size={12} />
          ChillChain AI · WebSocket Engine Online
        </div>
      </div>
    </div>
  );
}