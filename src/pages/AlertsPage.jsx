import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Thermometer,
  Droplets,
  Navigation2,
  Activity,
  Cpu,
  WifiOff,
  Search,
  ChevronDown,
  CheckCheck,
  ArrowRight,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  X,
  Radio,
  UserPlus,
  ArrowUpCircle,
  History,
  ShieldCheck,
  ChevronRight,
  Users,
  Info,
} from "lucide-react";

/* ============================================================================
   MOCK DATA
   Kept isolated from UI logic — swap this block for a live API / websocket
   feed later without touching any component below.
============================================================================ */

const SENSOR_META = {
  temperature: { label: "Temperature", icon: Thermometer },
  humidity: { label: "Humidity", icon: Droplets },
  gps: { label: "GPS", icon: Navigation2 },
  motion: { label: "Motion", icon: Activity },
  aiRisk: { label: "AI Risk", icon: Cpu },
  sensor: { label: "Sensor", icon: WifiOff },
};

const SEVERITY_META = {
  critical: { label: "Critical", color: "#C6392F", bg: "#FBE7E4", ring: "#F3C9C4" },
  high: { label: "High", color: "#C77A1F", bg: "#FBF1DF", ring: "#F0D9A8" },
  medium: { label: "Medium", color: "#B8922E", bg: "#F8F1DF", ring: "#EBDDAF" },
  resolved: { label: "Resolved", color: "#1F7A4D", bg: "#E4EFE6", ring: "#C9E0CE" },
};

const MOCK_ALERTS = [
  {
    id: "AL-9081",
    severity: "critical",
    sensor: "temperature",
    type: "Temperature threshold breached",
    shipmentId: "CC-2048",
    route: "Mumbai → Pune",
    value: "11.8°C",
    detail: "3.8°C above safe ceiling",
    minutesAgo: 2,
    aiRisk: "High",
  },
  {
    id: "AL-9077",
    severity: "critical",
    sensor: "sensor",
    type: "Sensor offline — heartbeat lost",
    shipmentId: "CC-2011",
    route: "Chennai → Bengaluru",
    value: "No signal",
    detail: "Last seen 9 min ago",
    minutesAgo: 34,
    aiRisk: "High",
  },
  {
    id: "AL-9080",
    severity: "high",
    sensor: "humidity",
    type: "Humidity approaching upper limit",
    shipmentId: "CC-2031",
    route: "Indore → Delhi",
    value: "81% RH",
    detail: "Condensation risk on dairy crates",
    minutesAgo: 6,
    aiRisk: "Medium",
  },
  {
    id: "AL-9075",
    severity: "high",
    sensor: "motion",
    type: "Motion anomaly detected",
    shipmentId: "CC-2044",
    route: "Delhi → Kolkata",
    value: "4.2G spike",
    detail: "Sudden impact during transit",
    minutesAgo: 24,
    aiRisk: "Medium",
  },
  {
    id: "AL-9070",
    severity: "high",
    sensor: "gps",
    type: "Route deviation detected",
    shipmentId: "CC-2002",
    route: "Kolkata → Delhi",
    value: "3.4 km off route",
    detail: "Vehicle drifted from planned corridor",
    minutesAgo: 46,
    aiRisk: "Medium",
  },
  {
    id: "AL-9065",
    severity: "high",
    sensor: "aiRisk",
    type: "AI risk score elevated",
    shipmentId: "CC-1962",
    route: "Pune → Mumbai",
    value: "71 / 100",
    detail: "Trending upward over last hour",
    minutesAgo: 65,
    aiRisk: "High",
  },
  {
    id: "AL-9078",
    severity: "medium",
    sensor: "gps",
    type: "GPS signal degraded",
    shipmentId: "CC-2019",
    route: "Bhopal → Jaipur",
    value: "Weak signal",
    detail: "Signal lost for 4 min, now intermittent",
    minutesAgo: 11,
    aiRisk: "Low",
  },
  {
    id: "AL-9069",
    severity: "medium",
    sensor: "aiRisk",
    type: "AI risk trending upward",
    shipmentId: "CC-1998",
    route: "Pune → Nagpur",
    value: "58 / 100",
    detail: "Monitor over next monitoring cycle",
    minutesAgo: 31,
    aiRisk: "Medium",
  },
  {
    id: "AL-9060",
    severity: "medium",
    sensor: "temperature",
    type: "Temperature drifting toward limit",
    shipmentId: "CC-1975",
    route: "Bhopal → Indore",
    value: "7.6°C",
    detail: "0.4°C from safe ceiling",
    minutesAgo: 52,
    aiRisk: "Low",
  },
  {
    id: "AL-9055",
    severity: "medium",
    sensor: "humidity",
    type: "Humidity fluctuation detected",
    shipmentId: "CC-2065",
    route: "Nagpur → Raipur",
    value: "74% RH",
    detail: "Oscillating outside stable band",
    minutesAgo: 72,
    aiRisk: "Low",
  },
  {
    id: "AL-9050",
    severity: "medium",
    sensor: "motion",
    type: "Motion detected during transit stop",
    shipmentId: "CC-2009",
    route: "Jaipur → Udaipur",
    value: "1.8G",
    detail: "Unexpected handling at rest stop",
    minutesAgo: 80,
    aiRisk: "Low",
  },
  {
    id: "AL-9040",
    severity: "resolved",
    sensor: "temperature",
    type: "Temperature returned to safe range",
    shipmentId: "CC-2007",
    route: "Jaipur → Indore",
    value: "6.2°C",
    detail: "Back inside 2–8°C safe band",
    minutesAgo: 18,
    aiRisk: "—",
  },
  {
    id: "AL-9033",
    severity: "resolved",
    sensor: "humidity",
    type: "Humidity normalized",
    shipmentId: "CC-1987",
    route: "Nagpur → Bhopal",
    value: "62% RH",
    detail: "Stable within expected range",
    minutesAgo: 41,
    aiRisk: "—",
  },
  {
    id: "AL-9028",
    severity: "resolved",
    sensor: "gps",
    type: "GPS signal restored",
    shipmentId: "CC-2056",
    route: "Indore → Mumbai",
    value: "Signal stable",
    detail: "Full connectivity re-established",
    minutesAgo: 58,
    aiRisk: "—",
  },
];

const NAV_LINKS = ["Overview", "Shipments", "Live Tracking", "Analytics", "AI Insights", "Alerts", "Devices"];

const SENSOR_FILTERS = ["all", "temperature", "humidity", "gps", "motion", "aiRisk", "sensor"];

// Reference device / threshold copy shown in the Alert Detail Panel, keyed by sensor type.
const SENSOR_DETAIL_META = {
  temperature: { device: "SHT40 Sensor", safeRange: "2°C – 8°C", threshold: "10°C" },
  humidity: { device: "SHT40 Sensor", safeRange: "40% – 75% RH", threshold: "80% RH" },
  gps: { device: "u-blox GPS Module", safeRange: "Continuous signal", threshold: "Loss > 3 min" },
  motion: { device: "MPU6050 IMU", safeRange: "Below 2.5G", threshold: "2.5G impact" },
  aiRisk: { device: "AI Risk Engine", safeRange: "Below 50 / 100", threshold: "65 / 100" },
  sensor: { device: "ESP32 Gateway", safeRange: "Heartbeat < 5 min", threshold: "Heartbeat > 5 min" },
};

// Assignable operators for the Action Center's "Assign" flow.
const TEAM_MEMBERS = [
  { id: "t1", name: "Aditi Rao", role: "Cold Chain Ops" },
  { id: "t2", name: "Karan Mehta", role: "Logistics Response" },
  { id: "t3", name: "Priya Nair", role: "Fleet Coordination" },
  { id: "t4", name: "Rohan Desai", role: "Quality Assurance" },
];

// Static resolution history — independent of the live/open alerts above.
const ALERT_HISTORY = [
  { id: "H1", type: "Temperature excursion", shipmentId: "CC-2012", durationMin: 24, resolvedAgoMin: 52 },
  { id: "H2", type: "GPS signal loss", shipmentId: "CC-1998", durationMin: 8, resolvedAgoMin: 70 },
  { id: "H3", type: "Humidity anomaly", shipmentId: "CC-1984", durationMin: 17, resolvedAgoMin: 95 },
  { id: "H4", type: "Motion anomaly", shipmentId: "CC-1970", durationMin: 6, resolvedAgoMin: 125 },
  { id: "H5", type: "Sensor reconnect", shipmentId: "CC-1955", durationMin: 12, resolvedAgoMin: 160 },
];

const SEVERITY_ESCALATION = { medium: "high", high: "critical", critical: "critical", resolved: "resolved" };

/* ============================================================================
   HELPERS
============================================================================ */

function formatAgo(minutesAgo, tickSeconds) {
  const totalSeconds = minutesAgo * 60 + tickSeconds;
  if (totalSeconds < 60) return `${totalSeconds}s ago`;
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return `${h}h ${remM}m ago`;
}

function useCountUp(target, { duration = 1100, decimals = 0, start = true } = {}) {
  const [value, setValue] = useState(decimals > 0 ? Number(target).toFixed(decimals) : 0);
  const raf = useRef(null);
  useEffect(() => {
    if (!start) return;
    let startTs = null;
    const from = 0;
    const animate = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setValue(decimals > 0 ? current.toFixed(decimals) : Math.round(current));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, start, duration, decimals]);
  return value;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Small deterministic hash so per-alert "AI confidence" / "potential loss" figures
// stay stable across re-renders instead of re-randomizing on every tick.
function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function aiConfidence(alert) {
  if (alert.id === "AL-9081") return 91;
  return 74 + (hashId(alert.id) % 20); // 74–93%
}

function potentialLoss(alert) {
  if (alert.id === "AL-9081") return 18500;
  const base = { critical: 15000, high: 6500, medium: 2200, resolved: 0 }[alert.severity] ?? 0;
  return base + (hashId(alert.id) % 3200);
}

function formatRupees(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Reference "now" clock (14:42) so the CC-2048 example timeline matches the brief exactly.
const REF_NOW_MIN = 14 * 60 + 42;

function formatClock(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = ((totalMin % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function buildTimeline(alert) {
  if (alert.id === "AL-9081") {
    return [
      { time: "14:02", label: "Temperature begins rising" },
      { time: "14:12", label: "Safe threshold crossed" },
      { time: "14:20", label: "Critical threshold crossed" },
      { time: "14:40", label: "Alert generated" },
    ];
  }
  const generatedAt = REF_NOW_MIN - alert.minutesAgo;
  const sensorLabel = SENSOR_META[alert.sensor].label;
  return [
    { time: formatClock(generatedAt - 18), label: `${sensorLabel} reading begins drifting` },
    { time: formatClock(generatedAt - 7), label: "Safe threshold crossed" },
    { time: formatClock(generatedAt), label: alert.severity === "resolved" ? "Reading returned to normal" : "Alert generated" },
  ];
}

function whyTriggeredText(alert) {
  if (alert.id === "AL-9081") return "Temperature remained above the critical threshold for more than 15 minutes.";
  const sensorLabel = SENSOR_META[alert.sensor].label.toLowerCase();
  return `${sensorLabel[0].toUpperCase()}${sensorLabel.slice(1)} crossed the safe operating threshold and has not yet returned to normal.`;
}

function whyMattersText(alert) {
  if (alert.id === "AL-9081")
    return "Temperature has remained above the critical threshold for 38 minutes. Based on historical shipment behavior, continued exposure could significantly increase spoilage probability.";
  return `${alert.type} has been active for ${formatDuration(alert.minutesAgo)}. Based on historical shipment behavior, continued exposure could affect product quality if left unaddressed.`;
}

const RECOMMENDED_ACTION_MAP = {
  temperature: "Inspect refrigeration performance.",
  humidity: "Check seal integrity and ventilation.",
  gps: "Contact driver to confirm current location.",
  motion: "Review handling footage and contact driver.",
  aiRisk: "Increase monitoring frequency on this shipment.",
  sensor: "Dispatch a technician to verify gateway connectivity.",
};

function recommendedActionText(alert) {
  if (alert.id === "AL-9081") return "Inspect refrigeration system immediately.";
  return RECOMMENDED_ACTION_MAP[alert.sensor] || "Review shipment telemetry.";
}

/* ============================================================================
   SHARED PIECES
============================================================================ */

function SeverityDot({ severity, size = 8 }) {
  const meta = SEVERITY_META[severity];
  return (
    <span
      className="cc-dot"
      style={{
        width: size,
        height: size,
        background: meta.color,
        boxShadow: severity === "critical" ? `0 0 0 4px ${meta.ring}` : "none",
      }}
    />
  );
}

function TrendIndicator({ trend, label }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "#C6392F" : trend === "down" ? "#1F7A4D" : "#9B9A8D";
  return (
    <span className="cc-trend" style={{ color }}>
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  );
}

/* ============================================================================
   HERO
============================================================================ */

function Hero({ mounted }) {
  const activeShipments = useCountUp(24, { start: mounted });
  const openAlerts = useCountUp(8, { start: mounted });
  const criticalCount = useCountUp(2, { start: mounted });

  return (
    <section className="cc-hero">
      <div className="cc-hero-bg" />
      <div className="cc-hero-inner">
        <div className={"cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "0ms" }}>
          <span className="cc-eyebrow-pill">
            <span className="cc-eyebrow-dot" />
            OPERATIONAL ALERTS
          </span>
        </div>

        <h1 className={"cc-hero-heading cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "70ms" }}>
          Know what needs
          <br />
          <span className="cc-heading-accent">your attention.</span>
        </h1>

        <p className={"cc-hero-sub cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "140ms" }}>
          Monitor critical cold-chain events, sensor anomalies and shipment risks before
          they become costly failures.
        </p>

        <div className={"cc-hero-status cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "200ms" }}>
          <span className="cc-status-chip">
            <span className="cc-live-dot" />
            ALERT ENGINE ONLINE
          </span>
        </div>

        <div className={"cc-hero-stats cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "260ms" }}>
          <div className="cc-hero-stat">
            <span className="cc-hero-stat-value">{activeShipments}</span>
            <span className="cc-hero-stat-label">active shipments</span>
          </div>
          <div className="cc-hero-stat-divider" />
          <div className="cc-hero-stat">
            <span className="cc-hero-stat-value">{openAlerts}</span>
            <span className="cc-hero-stat-label">open alerts</span>
          </div>
          <div className="cc-hero-stat-divider" />
          <div className="cc-hero-stat">
            <span className="cc-hero-stat-value cc-hero-stat-critical">{criticalCount}</span>
            <span className="cc-hero-stat-label">critical</span>
          </div>
        </div>
      </div>

      <div className={"cc-hero-radar cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "220ms" }}>
        <div className="cc-radar-ring cc-radar-ring-1" />
        <div className="cc-radar-ring cc-radar-ring-2" />
        <div className="cc-radar-ring cc-radar-ring-3" />
        <div className="cc-radar-core">
          <Radio size={20} strokeWidth={2} color="#EAF3EA" />
        </div>
        <span className="cc-radar-caption">SCANNING SHIPMENTS</span>
      </div>
    </section>
  );
}

/* ============================================================================
   ALERT SUMMARY
============================================================================ */

function MetricCard({ metric, index, mounted, isActive, onSelect }) {
  const meta = SEVERITY_META[metric.key];
  const countValue = useCountUp(metric.value, { start: mounted, duration: 1000 + index * 120 });
  return (
    <button
      className={"cc-metric-card" + (isActive ? " cc-metric-card-active" : "") + (mounted ? " cc-reveal-in" : " cc-reveal")}
      style={{
        transitionDelay: `${index * 60}ms`,
        borderColor: isActive ? meta.color : undefined,
      }}
      onClick={() => onSelect(isActive ? "all" : metric.key)}
    >
      <div className="cc-metric-top">
        <span className="cc-metric-label" style={{ color: meta.color }}>
          {metric.label.toUpperCase()}
        </span>
        <SeverityDot severity={metric.key} size={7} />
      </div>
      <div className="cc-metric-value">{countValue}</div>
      <TrendIndicator trend={metric.trend} label={metric.trendLabel} />
    </button>
  );
}

function AlertSummary({ mounted, metrics, activeFilter, onSelect }) {
  return (
    <section className="cc-section">
      <div className="cc-summary-grid">
        {metrics.map((metric, i) => (
          <MetricCard
            key={metric.key}
            metric={metric}
            index={i}
            mounted={mounted}
            isActive={activeFilter === metric.key}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   PRIORITY ALERT
============================================================================ */

function PriorityAlert({ mounted, priority, onAcknowledge, onViewShipment, onViewDetails }) {
  const acknowledged = priority.acknowledged;
  const temp = useCountUp(11.8, { start: mounted, duration: 1400, decimals: 1 });

  return (
    <section className="cc-section">
      <div className={"cc-section-heading-row cc-reveal" + (mounted ? " cc-reveal-in" : "")}>
        <span className="cc-section-eyebrow">PRIORITY ALERT</span>
      </div>

      <div className={"cc-priority-card cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "60ms" }}>
        <div className="cc-priority-glow" />
        <div className="cc-priority-top">
          <div className="cc-priority-badge-row">
            <span className="cc-badge cc-badge-critical">
              <span className="cc-badge-pulse" />
              CRITICAL
            </span>
            <span className="cc-priority-shipment">
              {priority.shipmentId} <span className="cc-priority-route">· {priority.route}</span>
            </span>
            {acknowledged && (
              <span className="cc-tag cc-tag-ack">
                <CheckCircle2 size={11} strokeWidth={2.6} /> Acknowledged
              </span>
            )}
          </div>
          <span className="cc-priority-time">{priority.minutesAgo} min ago</span>
        </div>

        <h3 className="cc-priority-title">{priority.type}</h3>

        <div className="cc-priority-grid">
          <div className="cc-priority-metric cc-priority-metric-critical">
            <span className="cc-priority-metric-label">CURRENT TEMPERATURE</span>
            <span className="cc-priority-metric-value">{temp}°C</span>
          </div>
          <div className="cc-priority-metric">
            <span className="cc-priority-metric-label">SAFE RANGE</span>
            <span className="cc-priority-metric-value cc-priority-metric-value-sm">2°C – 8°C</span>
          </div>
          <div className="cc-priority-metric">
            <span className="cc-priority-metric-label">DURATION</span>
            <ElapsedDuration baseMinutes={38} />
          </div>
          <div className="cc-priority-metric">
            <span className="cc-priority-metric-label">AI RISK</span>
            <span className="cc-priority-metric-value cc-priority-metric-value-sm cc-priority-risk">{priority.aiRisk}</span>
          </div>
        </div>

        <div className="cc-priority-impact">
          <span className="cc-priority-impact-label">POTENTIAL IMPACT</span>
          <p className="cc-priority-impact-text">Elevated spoilage probability if refrigeration is not restored promptly.</p>
        </div>

        <div className="cc-priority-action">
          <AlertTriangle size={16} strokeWidth={2.2} color="#8A5A16" />
          <div>
            <span className="cc-priority-action-label">RECOMMENDED ACTION</span>
            <p className="cc-priority-action-text">Inspect refrigeration system immediately.</p>
          </div>
        </div>

        <div className="cc-priority-buttons">
          <button className="cc-btn cc-btn-primary" onClick={() => onViewShipment(priority)}>
            View Shipment <ArrowRight size={15} strokeWidth={2.3} />
          </button>
          <button
            className={"cc-btn cc-btn-outline" + (acknowledged ? " cc-btn-outline-done" : "")}
            onClick={() => onAcknowledge(priority.id)}
            disabled={acknowledged}
          >
            {acknowledged ? (
              <>
                <CheckCircle2 size={15} strokeWidth={2.3} /> Acknowledged
              </>
            ) : (
              "Acknowledge Alert"
            )}
          </button>
        </div>

        <button className="cc-priority-details-link" onClick={() => onViewDetails(priority.id)}>
          View full intelligence & actions <ChevronRight size={14} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  );
}

function ElapsedDuration({ baseMinutes }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const totalSeconds = baseMinutes * 60 + seconds;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return (
    <span className="cc-priority-metric-value cc-priority-metric-value-sm">
      {m}m {String(s).padStart(2, "0")}s
    </span>
  );
}

/* ============================================================================
   TOOLBAR
============================================================================ */

function Toolbar({ search, setSearch, severityFilter, setSeverityFilter, sensorFilter, setSensorFilter, sort, setSort, onMarkAllRead, unreadCount, severityCounts }) {
  return (
    <div className="cc-toolbar">
      <div className="cc-toolbar-row">
        <div className="cc-search">
          <Search size={15} strokeWidth={2.2} color="#9B9A8D" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts, shipments, routes..."
          />
          {search && (
            <button className="cc-search-clear" onClick={() => setSearch("")}>
              <X size={13} strokeWidth={2.4} />
            </button>
          )}
        </div>

        <div className="cc-toolbar-controls">
          <div className="cc-select-wrap">
            <select value={sensorFilter} onChange={(e) => setSensorFilter(e.target.value)}>
              <option value="all">All sensor types</option>
              {SENSOR_FILTERS.filter((s) => s !== "all").map((s) => (
                <option key={s} value={s}>
                  {SENSOR_META[s].label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} strokeWidth={2.3} className="cc-select-chevron" />
          </div>

          <div className="cc-select-wrap">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="severity">Sort: Severity</option>
            </select>
            <ChevronDown size={13} strokeWidth={2.3} className="cc-select-chevron" />
          </div>

          <button className="cc-mark-read" onClick={onMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={15} strokeWidth={2.2} />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="cc-chip-row">
        {["all", "critical", "high", "medium", "resolved"].map((key) => {
          const isActive = severityFilter === key;
          const meta = key === "all" ? null : SEVERITY_META[key];
          return (
            <button
              key={key}
              className={"cc-chip" + (isActive ? " cc-chip-active" : "")}
              style={isActive && meta ? { background: meta.bg, borderColor: meta.ring, color: meta.color } : undefined}
              onClick={() => setSeverityFilter(key)}
            >
              {key === "all" ? "All" : meta.label}
              <span className="cc-chip-count">{severityCounts[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   LIVE ALERT FEED
============================================================================ */

function FeedSkeleton() {
  return (
    <div className="cc-feed-list">
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="cc-skeleton-row" key={i}>
          <div className="cc-skeleton cc-skeleton-dot" />
          <div className="cc-skeleton-lines">
            <div className="cc-skeleton cc-skeleton-line" style={{ width: "38%" }} />
            <div className="cc-skeleton cc-skeleton-line" style={{ width: "62%" }} />
          </div>
          <div className="cc-skeleton cc-skeleton-time" />
        </div>
      ))}
    </div>
  );
}

function AlertRow({ alert, index, isRead, isSelected, onSelect, tickSeconds }) {
  const meta = SEVERITY_META[alert.severity];
  const SensorIcon = SENSOR_META[alert.sensor].icon;
  const handled = alert.acknowledged || alert.assignee;

  return (
    <button
      className={"cc-feed-row cc-reveal-in" + (isSelected ? " cc-feed-row-selected" : "") + (alert.acknowledged ? " cc-feed-row-handled" : "")}
      style={{ transitionDelay: `${Math.min(index, 8) * 45}ms`, borderLeftColor: meta.color }}
      onClick={() => onSelect(alert.id)}
    >
      <div className="cc-feed-icon" style={{ background: meta.bg, color: meta.color }}>
        <SensorIcon size={16} strokeWidth={2.1} />
      </div>

      <div className="cc-feed-main">
        <div className="cc-feed-top-line">
          <span className="cc-feed-severity" style={{ color: meta.color }}>
            {meta.label.toUpperCase()}
          </span>
          {alert.escalated && (
            <span className="cc-mini-tag cc-mini-tag-escalated">
              <ArrowUpCircle size={10} strokeWidth={2.6} /> Escalated
            </span>
          )}
          {alert.acknowledged && (
            <span className="cc-mini-tag cc-mini-tag-ack">
              <CheckCircle2 size={10} strokeWidth={2.6} /> Acknowledged
            </span>
          )}
          {alert.assignee && <span className="cc-mini-tag cc-mini-tag-assigned">{alert.assignee}</span>}
          {!isRead && !handled && <span className="cc-unread-dot" />}
        </div>
        <p className="cc-feed-type">{alert.type}</p>
        <div className="cc-feed-meta">
          <span>{alert.route}</span>
          <span className="cc-feed-meta-sep">·</span>
          <span>{alert.shipmentId}</span>
          <span className="cc-feed-meta-sep">·</span>
          <span>{alert.value}</span>
        </div>
      </div>

      <span className="cc-feed-time">{formatAgo(alert.minutesAgo, tickSeconds)}</span>
    </button>
  );
}

function LiveAlertFeed({ alerts, loading, readIds, selectedId, onSelect, tickSeconds }) {
  return (
    <section className="cc-section">
      <div className="cc-feed-header">
        <div>
          <span className="cc-section-eyebrow">LIVE ALERT FEED</span>
          <h3 className="cc-feed-title">Continuously updating operational stream</h3>
        </div>
        <span className="cc-feed-updated">
          <span className="cc-live-dot cc-live-dot-sm" />
          Updated {tickSeconds % 60}s ago
        </span>
      </div>

      <div className="cc-feed-card">
        {loading ? (
          <FeedSkeleton />
        ) : alerts.length === 0 ? (
          <div className="cc-feed-empty">
            <AlertTriangle size={22} strokeWidth={1.8} color="#9B9A8D" />
            <p>No alerts match your filters.</p>
            <span>Try adjusting search, severity or sensor type.</span>
          </div>
        ) : (
          <div className="cc-feed-list">
            {alerts.map((alert, i) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                index={i}
                isRead={readIds.has(alert.id)}
                isSelected={selectedId === alert.id}
                onSelect={onSelect}
                tickSeconds={tickSeconds}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
   ALERT DETAIL PANEL
============================================================================ */

function AlertDetailPanel({ alert, onClose }) {
  const detailMeta = SENSOR_DETAIL_META[alert.sensor];
  const severityMeta = SEVERITY_META[alert.severity];
  const timeline = buildTimeline(alert);

  return (
    <div className="cc-panel cc-panel-detail">
      <div className="cc-panel-head">
        <div className="cc-panel-head-left">
          <span className="cc-badge" style={{ background: severityMeta.bg, color: severityMeta.color }}>
            {alert.severity === "critical" && <span className="cc-badge-pulse" style={{ background: severityMeta.color }} />}
            {severityMeta.label.toUpperCase()}
          </span>
          {alert.escalated && (
            <span className="cc-tag cc-tag-escalated">
              <ArrowUpCircle size={11} strokeWidth={2.6} /> Escalated
            </span>
          )}
          {alert.acknowledged && (
            <span className="cc-tag cc-tag-ack">
              <CheckCircle2 size={11} strokeWidth={2.6} /> Acknowledged
            </span>
          )}
        </div>
        <button className="cc-panel-close" onClick={onClose} aria-label="Close detail panel">
          <X size={16} strokeWidth={2.3} />
        </button>
      </div>

      <h3 className="cc-panel-title">{alert.type}</h3>

      <div className="cc-detail-grid">
        <div className="cc-detail-cell">
          <span className="cc-detail-label">SHIPMENT</span>
          <span className="cc-detail-value">{alert.shipmentId}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">ROUTE</span>
          <span className="cc-detail-value">{alert.route}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">SENSOR</span>
          <span className="cc-detail-value">{detailMeta.device}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">CURRENT VALUE</span>
          <span className="cc-detail-value">{alert.value}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">SAFE RANGE</span>
          <span className="cc-detail-value">{detailMeta.safeRange}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">THRESHOLD</span>
          <span className="cc-detail-value">{detailMeta.threshold}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">DURATION</span>
          <span className="cc-detail-value">{formatDuration(alert.minutesAgo)}</span>
        </div>
        <div className="cc-detail-cell">
          <span className="cc-detail-label">AI RISK</span>
          <span className="cc-detail-value" style={{ color: "var(--cc-amber)" }}>
            {alert.aiRisk}
          </span>
        </div>
      </div>

      <div className="cc-panel-subhead">
        <Info size={13} strokeWidth={2.3} />
        WHY THIS ALERT TRIGGERED
      </div>
      <p className="cc-panel-text">{whyTriggeredText(alert)}</p>

      <div className="cc-panel-subhead">
        <History size={13} strokeWidth={2.3} />
        EVENT TIMELINE
      </div>
      <div className="cc-timeline">
        {timeline.map((step, i) => (
          <div className="cc-timeline-step" key={i} style={{ animationDelay: `${140 + i * 160}ms` }}>
            <div className="cc-timeline-marker">
              <span className="cc-timeline-dot" />
              {i < timeline.length - 1 && <span className="cc-timeline-line" />}
            </div>
            <div className="cc-timeline-body">
              <span className="cc-timeline-time">{step.time}</span>
              <span className="cc-timeline-label">{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   ALERT INTELLIGENCE
============================================================================ */

function AlertIntelligence({ alert }) {
  const confidence = aiConfidence(alert);
  const loss = potentialLoss(alert);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setBarWidth(0);
    const t = setTimeout(() => setBarWidth(confidence), 120);
    return () => clearTimeout(t);
  }, [alert.id, confidence]);

  return (
    <div className="cc-panel cc-panel-intel">
      <div className="cc-panel-subhead cc-panel-subhead-alt">
        <ShieldCheck size={13} strokeWidth={2.3} />
        WHY THIS MATTERS
      </div>
      <p className="cc-panel-text">{whyMattersText(alert)}</p>

      <div className="cc-intel-stats">
        <div className="cc-intel-stat">
          <span className="cc-intel-stat-label">RISK</span>
          <span className="cc-intel-stat-value" style={{ color: SEVERITY_META[alert.severity]?.color || "var(--cc-text)" }}>
            {alert.aiRisk === "—" ? "Low" : alert.aiRisk.toUpperCase()}
          </span>
        </div>
        <div className="cc-intel-stat">
          <span className="cc-intel-stat-label">CONFIDENCE</span>
          <span className="cc-intel-stat-value">{confidence}%</span>
          <div className="cc-confidence-track">
            <div className="cc-confidence-fill" style={{ width: `${barWidth}%` }} />
          </div>
        </div>
        <div className="cc-intel-stat">
          <span className="cc-intel-stat-label">POTENTIAL LOSS</span>
          <span className="cc-intel-stat-value">{formatRupees(loss)}</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ACTION CENTER
============================================================================ */

function ActionCenter({ alert, onAcknowledge, onEscalate, onAssign, onViewShipment }) {
  const [openPopover, setOpenPopover] = useState(null); // 'escalate' | 'assign' | null
  const [toast, setToast] = useState("");

  const canEscalate = alert.severity !== "critical" && alert.severity !== "resolved";
  const nextSeverity = SEVERITY_ESCALATION[alert.severity];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="cc-panel cc-panel-actions">
      <div className="cc-panel-subhead cc-panel-subhead-alt">RECOMMENDED ACTION</div>
      <p className="cc-panel-action-text">{recommendedActionText(alert)}</p>

      <div className="cc-action-buttons">
        <button
          className={"cc-btn cc-btn-primary cc-btn-sm" + (alert.acknowledged ? " cc-btn-outline-done" : "")}
          onClick={() => {
            onAcknowledge(alert.id);
            showToast("Alert acknowledged.");
          }}
          disabled={alert.acknowledged}
        >
          {alert.acknowledged ? (
            <>
              <CheckCircle2 size={14} strokeWidth={2.3} /> Acknowledged
            </>
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={2.3} /> Acknowledge
            </>
          )}
        </button>

        <div className="cc-popover-wrap">
          <button
            className="cc-btn cc-btn-outline cc-btn-sm"
            onClick={() => setOpenPopover(openPopover === "escalate" ? null : "escalate")}
            disabled={!canEscalate}
          >
            <ArrowUpCircle size={14} strokeWidth={2.3} />
            {alert.severity === "critical" ? "Already Critical" : "Escalate"}
          </button>
          {openPopover === "escalate" && canEscalate && (
            <div className="cc-popover">
              <p className="cc-popover-text">
                Escalate to <strong>{SEVERITY_META[nextSeverity].label}</strong>? The on-call team will be notified.
              </p>
              <div className="cc-popover-buttons">
                <button className="cc-btn cc-btn-outline cc-btn-xs" onClick={() => setOpenPopover(null)}>
                  Cancel
                </button>
                <button
                  className="cc-btn cc-btn-primary cc-btn-xs"
                  onClick={() => {
                    onEscalate(alert.id);
                    setOpenPopover(null);
                    showToast(`Escalated to ${SEVERITY_META[nextSeverity].label}.`);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cc-popover-wrap">
          <button className="cc-btn cc-btn-outline cc-btn-sm" onClick={() => setOpenPopover(openPopover === "assign" ? null : "assign")}>
            <UserPlus size={14} strokeWidth={2.3} />
            {alert.assignee ? alert.assignee : "Assign"}
          </button>
          {openPopover === "assign" && (
            <div className="cc-popover cc-popover-wide">
              <p className="cc-popover-text cc-popover-text-strong">
                <Users size={13} strokeWidth={2.3} /> Assign this alert to
              </p>
              <div className="cc-team-list">
                {TEAM_MEMBERS.map((m) => (
                  <button
                    key={m.id}
                    className={"cc-team-option" + (alert.assignee === m.name ? " cc-team-option-active" : "")}
                    onClick={() => {
                      onAssign(alert.id, m.name);
                      setOpenPopover(null);
                      showToast(`Assigned to ${m.name}.`);
                    }}
                  >
                    <span className="cc-team-avatar">{m.name.charAt(0)}</span>
                    <span className="cc-team-info">
                      <span className="cc-team-name">{m.name}</span>
                      <span className="cc-team-role">{m.role}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="cc-btn cc-btn-outline cc-btn-sm"
          onClick={() => {
            onViewShipment(alert);
            showToast(`Opening ${alert.shipmentId} in Shipments →`);
          }}
        >
          View Shipment <ArrowRight size={14} strokeWidth={2.3} />
        </button>
      </div>

      {toast && (
        <div className="cc-toast">
          <CheckCircle2 size={13} strokeWidth={2.4} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   ALERT HISTORY
============================================================================ */

function AlertHistory({ mounted }) {
  return (
    <section className="cc-section">
      <div className={"cc-section-heading-row cc-reveal" + (mounted ? " cc-reveal-in" : "")}>
        <span className="cc-section-eyebrow">ALERT HISTORY</span>
        <h3 className="cc-feed-title">Recent Resolution History</h3>
      </div>

      <div className={"cc-history-card cc-reveal" + (mounted ? " cc-reveal-in" : "")} style={{ transitionDelay: "60ms" }}>
        {ALERT_HISTORY.map((item, i) => (
          <div className="cc-history-row" key={item.id} style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="cc-history-marker">
              <span className="cc-history-dot">
                <CheckCircle2 size={11} strokeWidth={2.6} />
              </span>
              {i < ALERT_HISTORY.length - 1 && <span className="cc-history-line" />}
            </div>
            <div className="cc-history-body">
              <span className="cc-history-type">{item.type}</span>
              <span className="cc-history-meta">
                {item.shipmentId} · Resolved in {item.durationMin} min
              </span>
            </div>
            <span className="cc-history-time">{formatAgo(item.resolvedAgoMin, 0)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   ROOT PAGE
============================================================================ */

export default function AlertsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickSeconds, setTickSeconds] = useState(0);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sensorFilter, setSensorFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [readIds, setReadIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  // Live, mutable copy of the mock alerts — this is what Acknowledge / Escalate /
  // Assign actually update. Swap the initializer for a fetched feed later.
  const [alertsState, setAlertsState] = useState(() =>
    MOCK_ALERTS.map((a) => ({ ...a, acknowledged: false, escalated: false, assignee: null }))
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    const l = setTimeout(() => setLoading(false), 650);
    return () => {
      clearTimeout(t);
      clearTimeout(l);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTickSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const filteredAlerts = useMemo(() => {
    let result = [...alertsState];

    if (severityFilter !== "all") {
      result = result.filter((a) => a.severity === severityFilter);
    }
    if (sensorFilter !== "all") {
      result = result.filter((a) => a.sensor === sensorFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.type.toLowerCase().includes(q) ||
          a.shipmentId.toLowerCase().includes(q) ||
          a.route.toLowerCase().includes(q) ||
          SENSOR_META[a.sensor].label.toLowerCase().includes(q)
      );
    }

    const severityRank = { critical: 0, high: 1, medium: 2, resolved: 3 };
    if (sort === "newest") {
      result.sort((a, b) => a.minutesAgo - b.minutesAgo);
    } else if (sort === "oldest") {
      result.sort((a, b) => b.minutesAgo - a.minutesAgo);
    } else if (sort === "severity") {
      result.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || a.minutesAgo - b.minutesAgo);
    }

    return result;
  }, [alertsState, severityFilter, sensorFilter, search, sort]);

  const severityCounts = useMemo(
    () => ({
      all: alertsState.length,
      critical: alertsState.filter((a) => a.severity === "critical").length,
      high: alertsState.filter((a) => a.severity === "high").length,
      medium: alertsState.filter((a) => a.severity === "medium").length,
      resolved: alertsState.filter((a) => a.severity === "resolved").length,
    }),
    [alertsState]
  );

  // "Resolved Today" combines resolutions logged elsewhere today (not shown in this
  // feed) with whatever is currently marked resolved in the live list — so the
  // hero/summary numbers move if the operator resolves something in this session.
  const summaryMetrics = useMemo(
    () => [
      { key: "critical", label: "Critical", value: severityCounts.critical, trend: "up", trendLabel: "1 since yesterday" },
      { key: "high", label: "High", value: severityCounts.high, trend: "down", trendLabel: "2 since yesterday" },
      { key: "medium", label: "Medium", value: severityCounts.medium, trend: "flat", trendLabel: "steady" },
      { key: "resolved", label: "Resolved Today", value: 14 + severityCounts.resolved, trend: "up", trendLabel: "6 since yesterday" },
    ],
    [severityCounts]
  );

  const unreadCount = alertsState.filter((a) => !readIds.has(a.id)).length;
  const priorityAlert = alertsState.find((a) => a.id === "AL-9081") || alertsState[0];
  const selectedAlert = alertsState.find((a) => a.id === selectedId) || null;

  const handleRead = (id) => setReadIds((prev) => new Set(prev).add(id));
  const handleMarkAllRead = () => setReadIds(new Set(alertsState.map((a) => a.id)));

  const handleSelect = (id) => {
    setSelectedId(id);
    handleRead(id);
  };
  const handleCloseDetail = () => setSelectedId(null);

  const handleAcknowledge = (id) => {
    setAlertsState((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    handleRead(id);
  };
  const handleEscalate = (id) => {
    setAlertsState((prev) =>
      prev.map((a) => (a.id === id ? { ...a, severity: SEVERITY_ESCALATION[a.severity], escalated: true } : a))
    );
  };
  const handleAssign = (id, name) => {
    setAlertsState((prev) => prev.map((a) => (a.id === id ? { ...a, assignee: name } : a)));
  };
  // Replace with your router, e.g. navigate(`/shipments/${alert.shipmentId}`)
  const handleViewShipment = (alert) => {
    // No-op placeholder — wire to the existing Shipments route in the real app.
  };

  return (
    <div className="cc-shell">
      <style>{CSS}</style>
      <Hero mounted={mounted} />

      <main className="cc-main">
        <AlertSummary
          mounted={mounted}
          metrics={summaryMetrics}
          activeFilter={severityFilter}
          onSelect={setSeverityFilter}
        />
        <PriorityAlert
          mounted={mounted}
          priority={priorityAlert}
          onAcknowledge={handleAcknowledge}
          onViewShipment={handleViewShipment}
          onViewDetails={handleSelect}
        />

        <section className="cc-section">
          <div className="cc-command-grid">
            <div className="cc-command-left">
              <Toolbar
                search={search}
                setSearch={setSearch}
                severityFilter={severityFilter}
                setSeverityFilter={setSeverityFilter}
                sensorFilter={sensorFilter}
                setSensorFilter={setSensorFilter}
                sort={sort}
                setSort={setSort}
                onMarkAllRead={handleMarkAllRead}
                unreadCount={unreadCount}
                severityCounts={severityCounts}
              />
              <LiveAlertFeed
                alerts={filteredAlerts}
                loading={loading}
                readIds={readIds}
                selectedId={selectedId}
                onSelect={handleSelect}
                tickSeconds={tickSeconds}
              />
            </div>

            <div className="cc-command-right">
              {selectedAlert ? (
                <div className="cc-detail-stack" key={selectedAlert.id}>
                  <AlertDetailPanel alert={selectedAlert} onClose={handleCloseDetail} />
                  <AlertIntelligence alert={selectedAlert} />
                  <ActionCenter
                    alert={selectedAlert}
                    onAcknowledge={handleAcknowledge}
                    onEscalate={handleEscalate}
                    onAssign={handleAssign}
                    onViewShipment={handleViewShipment}
                  />
                </div>
              ) : (
                <div className="cc-detail-placeholder">
                  <AlertTriangle size={22} strokeWidth={1.7} color="#9B9A8D" />
                  <p>Select an alert</p>
                  <span>Choose any alert from the feed to see full detail, AI intelligence and recommended actions.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <AlertHistory mounted={mounted} />

        <footer className="cc-footer">ChillChain AI · SHT40 + ESP32 · AI Risk Engine — hackathon build</footer>
      </main>
    </div>
  );
}

/* ============================================================================
   STYLES — matches Dashboard design tokens (cream / forest green / mint / amber / red)
============================================================================ */

const CSS = `
  .cc-shell {
    --cc-bg: #F7F4EC;
    --cc-bg-alt: #F1EEE2;
    --cc-forest: #14342A;
    --cc-forest-2: #1B4234;
    --cc-emerald: #1F7A4D;
    --cc-emerald-light: #2F9463;
    --cc-mint: #E4EFE6;
    --cc-mint-2: #EDF4EE;
    --cc-amber: #C77A1F;
    --cc-amber-bg: #FBF1DF;
    --cc-red: #C6392F;
    --cc-red-bg: #FBE7E4;
    --cc-border: #E6E2D3;
    --cc-text: #1C1B17;
    --cc-text-soft: #6B6A5F;
    --cc-text-faint: #9B9A8D;
    --cc-white: #FFFFFF;

    background: var(--cc-bg);
    color: var(--cc-text);
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .cc-shell * { box-sizing: border-box; }
  .cc-shell button { font-family: inherit; cursor: pointer; }
  .cc-shell select { font-family: inherit; }
  .cc-shell input { font-family: inherit; }

  /* ---------- Navbar ---------- */
  .cc-navbar { background: var(--cc-white); border-bottom: 1px solid var(--cc-border); position: sticky; top: 0; z-index: 40; }
  .cc-navbar-inner { max-width: 1280px; margin: 0 auto; padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .cc-brand { display: flex; align-items: center; gap: 10px; }
  .cc-brand-mark { width: 30px; height: 30px; border-radius: 8px; background: var(--cc-forest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cc-brand-text { display: flex; flex-direction: column; line-height: 1.15; }
  .cc-brand-name { font-weight: 700; font-size: 14.5px; letter-spacing: -0.01em; }
  .cc-brand-sub { font-size: 9px; letter-spacing: 0.08em; color: var(--cc-text-faint); font-weight: 600; }
  .cc-nav-links { display: flex; align-items: center; gap: 26px; }
  .cc-nav-link { font-size: 13.5px; color: var(--cc-text-soft); text-decoration: none; font-weight: 500; padding: 6px 2px; border-bottom: 2px solid transparent; transition: color 0.15s ease, border-color 0.15s ease; }
  .cc-nav-link:hover { color: var(--cc-text); }
  .cc-nav-link-active { color: var(--cc-emerald); font-weight: 600; border-bottom-color: var(--cc-emerald); }
  .cc-navbar-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .cc-sensor-pill { display: flex; align-items: center; gap: 6px; background: var(--cc-mint); color: var(--cc-forest-2); font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; padding: 6px 11px; border-radius: 100px; white-space: nowrap; }
  .cc-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--cc-forest); color: var(--cc-mint-2); display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; }

  .cc-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cc-emerald); animation: cc-pulse 2s ease-in-out infinite; flex-shrink: 0; }
  .cc-live-dot-sm { width: 5px; height: 5px; }

  /* ---------- Layout ---------- */
  .cc-main { max-width: 1280px; margin: 0 auto; padding: 0 32px 80px; }
  .cc-section { padding-top: 44px; }
  .cc-section-heading-row { margin-bottom: 14px; }
  .cc-section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--cc-text-faint); text-transform: uppercase; }

  /* ---------- Hero ---------- */
  .cc-hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--cc-border); }
  .cc-hero-bg { position: absolute; inset: 0; background: linear-gradient(180deg, #E9F1E8 0%, #F7F4EC 78%); z-index: 0; }
  .cc-hero-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 68px 32px 56px; max-width: 760px; }
  .cc-eyebrow-pill { display: inline-flex; align-items: center; gap: 7px; background: var(--cc-mint); color: var(--cc-forest-2); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; padding: 7px 13px; border-radius: 100px; }
  .cc-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cc-emerald); }
  .cc-hero-heading { font-size: 46px; line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 20px 0 16px; color: var(--cc-text); }
  .cc-heading-accent { color: var(--cc-emerald); }
  .cc-hero-sub { font-size: 16px; line-height: 1.55; color: var(--cc-text-soft); max-width: 520px; margin: 0 0 26px; }
  .cc-hero-status { margin-bottom: 30px; }
  .cc-status-chip { display: inline-flex; align-items: center; gap: 8px; background: var(--cc-forest); color: var(--cc-mint-2); font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; padding: 9px 16px; border-radius: 100px; }
  .cc-hero-stats { display: flex; align-items: center; gap: 20px; }
  .cc-hero-stat { display: flex; flex-direction: column; gap: 2px; }
  .cc-hero-stat-value { font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
  .cc-hero-stat-critical { color: var(--cc-red); }
  .cc-hero-stat-label { font-size: 11px; color: var(--cc-text-faint); font-weight: 600; letter-spacing: 0.02em; }
  .cc-hero-stat-divider { width: 1px; height: 26px; background: var(--cc-border); }

  .cc-hero-radar { position: absolute; right: 64px; top: 50%; transform: translateY(-50%); width: 160px; height: 160px; display: none; align-items: center; justify-content: center; z-index: 1; }
  .cc-radar-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(31,122,77,0.28); }
  .cc-radar-ring-1 { width: 60px; height: 60px; }
  .cc-radar-ring-2 { width: 106px; height: 106px; animation: cc-radar-expand 3s ease-out infinite; }
  .cc-radar-ring-3 { width: 106px; height: 106px; animation: cc-radar-expand 3s ease-out infinite 1.5s; }
  .cc-radar-core { width: 44px; height: 44px; border-radius: 50%; background: var(--cc-forest); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(20,52,42,0.25); }
  .cc-radar-caption { position: absolute; bottom: -22px; font-size: 9px; letter-spacing: 0.1em; font-weight: 700; color: var(--cc-text-faint); white-space: nowrap; }
  @media (min-width: 1120px) { .cc-hero-radar { display: flex; } }

  /* ---------- Summary metrics ---------- */
  .cc-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .cc-metric-card { text-align: left; background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 16px; padding: 18px 18px 16px; display: flex; flex-direction: column; gap: 8px; transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
  .cc-metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(20,40,30,0.08); }
  .cc-metric-card-active { box-shadow: 0 10px 28px rgba(20,40,30,0.1); }
  .cc-metric-top { display: flex; align-items: center; justify-content: space-between; }
  .cc-metric-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; }
  .cc-metric-value { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: var(--cc-text); }
  .cc-trend { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 600; }
  .cc-dot { border-radius: 50%; display: inline-block; }

  /* ---------- Priority alert ---------- */
  .cc-priority-card { position: relative; background: var(--cc-white); border: 1px solid var(--cc-red-bg); border-radius: 22px; padding: 28px 30px 26px; overflow: hidden; box-shadow: 0 1px 0 rgba(0,0,0,0.02); }
  .cc-priority-glow { position: absolute; top: -80px; right: -80px; width: 260px; height: 260px; background: radial-gradient(circle, rgba(198,57,47,0.10) 0%, rgba(198,57,47,0) 70%); pointer-events: none; }
  .cc-priority-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .cc-priority-badge-row { display: flex; align-items: center; gap: 12px; }
  .cc-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; padding: 6px 12px; border-radius: 100px; }
  .cc-badge-critical { background: var(--cc-red-bg); color: var(--cc-red); }
  .cc-badge-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--cc-red); box-shadow: 0 0 0 3px rgba(198,57,47,0.22); animation: cc-pulse 1.8s ease-in-out infinite; }
  .cc-priority-shipment { font-size: 13.5px; font-weight: 700; color: var(--cc-text); }
  .cc-priority-route { font-weight: 500; color: var(--cc-text-soft); }
  .cc-priority-time { font-size: 12px; color: var(--cc-text-faint); font-weight: 600; }
  .cc-priority-title { font-size: 24px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 22px; }
  .cc-priority-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .cc-priority-metric { background: var(--cc-bg-alt); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
  .cc-priority-metric-critical { background: var(--cc-red-bg); }
  .cc-priority-metric-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; color: var(--cc-text-faint); }
  .cc-priority-metric-value { font-size: 24px; font-weight: 800; letter-spacing: -0.01em; color: var(--cc-red); }
  .cc-priority-metric-value-sm { font-size: 17px; color: var(--cc-text); }
  .cc-priority-risk { color: var(--cc-amber); }
  .cc-priority-impact { margin-bottom: 14px; }
  .cc-priority-impact-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; color: var(--cc-text-faint); }
  .cc-priority-impact-text { margin: 4px 0 0; font-size: 14px; color: var(--cc-text-soft); line-height: 1.5; }
  .cc-priority-action { display: flex; gap: 12px; background: var(--cc-amber-bg); border-radius: 14px; padding: 14px 16px; margin-bottom: 22px; }
  .cc-priority-action-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; color: #8A5A16; }
  .cc-priority-action-text { margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #6B4310; }
  .cc-priority-buttons { display: flex; gap: 10px; }

  /* ---------- Buttons ---------- */
  .cc-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; padding: 11px 20px; border-radius: 12px; border: 1px solid transparent; transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease; }
  .cc-btn-primary { background: var(--cc-forest); color: var(--cc-mint-2); }
  .cc-btn-primary:hover { background: var(--cc-forest-2); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(20,52,42,0.22); }
  .cc-btn-outline { background: var(--cc-white); color: var(--cc-text); border-color: var(--cc-border); }
  .cc-btn-outline:hover { border-color: var(--cc-text-faint); }
  .cc-btn-outline-done { color: var(--cc-emerald); border-color: var(--cc-mint); background: var(--cc-mint); cursor: default; }
  .cc-btn:disabled { cursor: default; }

  /* ---------- Toolbar ---------- */
  .cc-toolbar { display: flex; flex-direction: column; gap: 14px; }
  .cc-toolbar-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .cc-search { flex: 1; min-width: 220px; display: flex; align-items: center; gap: 9px; background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 12px; padding: 10px 14px; }
  .cc-search input { border: none; outline: none; background: transparent; font-size: 13.5px; flex: 1; color: var(--cc-text); }
  .cc-search input::placeholder { color: var(--cc-text-faint); }
  .cc-search-clear { display: flex; padding: 2px; border: none; background: none; color: var(--cc-text-faint); }
  .cc-toolbar-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .cc-select-wrap { position: relative; display: flex; align-items: center; }
  .cc-select-wrap select { appearance: none; -webkit-appearance: none; background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 12px; padding: 10px 30px 10px 14px; font-size: 13px; font-weight: 600; color: var(--cc-text); }
  .cc-select-chevron { position: absolute; right: 11px; pointer-events: none; color: var(--cc-text-faint); }
  .cc-mark-read { display: inline-flex; align-items: center; gap: 7px; background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 12px; padding: 10px 15px; font-size: 13px; font-weight: 700; color: var(--cc-forest-2); }
  .cc-mark-read:hover:not(:disabled) { border-color: var(--cc-emerald); }
  .cc-mark-read:disabled { opacity: 0.45; cursor: default; }

  .cc-chip-row { display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
  .cc-chip { display: inline-flex; align-items: center; gap: 7px; background: var(--cc-white); border: 1px solid var(--cc-border); color: var(--cc-text-soft); font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 100px; white-space: nowrap; transition: all 0.15s ease; }
  .cc-chip:hover { border-color: var(--cc-text-faint); }
  .cc-chip-active { border-width: 1px; }
  .cc-chip-count { font-size: 10.5px; font-weight: 700; background: rgba(0,0,0,0.06); padding: 1px 6px; border-radius: 100px; }

  /* ---------- Feed ---------- */
  .cc-feed-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }
  .cc-feed-title { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; margin: 4px 0 0; }
  .cc-feed-updated { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--cc-text-faint); font-weight: 600; }
  .cc-feed-card { background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 18px; overflow: hidden; }
  .cc-feed-list { display: flex; flex-direction: column; }
  .cc-feed-row { display: flex; align-items: flex-start; gap: 14px; width: 100%; text-align: left; background: none; border: none; border-left: 3px solid transparent; border-bottom: 1px solid var(--cc-border); padding: 16px 18px; opacity: 0; transform: translateY(6px); animation: cc-row-in 0.4s ease forwards; transition: background 0.15s ease; }
  .cc-feed-row:hover { background: var(--cc-bg-alt); }
  .cc-feed-row:last-child { border-bottom: none; }
  .cc-feed-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cc-feed-main { flex: 1; min-width: 0; }
  .cc-feed-top-line { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
  .cc-feed-severity { font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; }
  .cc-unread-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cc-emerald); }
  .cc-feed-type { font-size: 14.5px; font-weight: 700; margin: 0 0 4px; color: var(--cc-text); }
  .cc-feed-meta { font-size: 12.5px; color: var(--cc-text-faint); display: flex; gap: 6px; flex-wrap: wrap; }
  .cc-feed-meta-sep { color: var(--cc-border); }
  .cc-feed-time { font-size: 12px; color: var(--cc-text-faint); font-weight: 600; white-space: nowrap; flex-shrink: 0; padding-top: 2px; }

  .cc-feed-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 56px 20px; text-align: center; }
  .cc-feed-empty p { font-size: 14.5px; font-weight: 700; margin: 6px 0 0; }
  .cc-feed-empty span { font-size: 12.5px; color: var(--cc-text-faint); }

  /* ---------- Skeleton ---------- */
  .cc-skeleton-row { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-bottom: 1px solid var(--cc-border); }
  .cc-skeleton-row:last-child { border-bottom: none; }
  .cc-skeleton { background: linear-gradient(90deg, var(--cc-bg-alt) 25%, #fbfaf6 37%, var(--cc-bg-alt) 63%); background-size: 400% 100%; animation: cc-shimmer 1.4s ease infinite; border-radius: 8px; }
  .cc-skeleton-dot { width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; }
  .cc-skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .cc-skeleton-line { height: 11px; }
  .cc-skeleton-time { width: 52px; height: 11px; flex-shrink: 0; }

  /* ---------- Priority: inline tags + details link ---------- */
  .cc-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; padding: 4px 9px; border-radius: 100px; }
  .cc-tag-ack { background: var(--cc-mint); color: var(--cc-emerald); }
  .cc-tag-escalated { background: var(--cc-amber-bg); color: #8A5A16; }
  .cc-priority-details-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 14px; background: none; border: none; padding: 0; font-size: 12.5px; font-weight: 700; color: var(--cc-emerald); }
  .cc-priority-details-link:hover { text-decoration: underline; }

  /* ---------- Command grid (feed + detail rail) ---------- */
  .cc-command-grid { display: grid; grid-template-columns: 1.2fr 0.86fr; gap: 20px; align-items: start; }
  .cc-command-left { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
  .cc-command-right { position: sticky; top: 82px; min-width: 0; }
  .cc-detail-stack { display: flex; flex-direction: column; gap: 14px; animation: cc-panel-in 0.4s ease; }
  .cc-detail-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; text-align: center; background: var(--cc-white); border: 1px dashed var(--cc-border); border-radius: 18px; padding: 52px 26px; height: 100%; min-height: 260px; }
  .cc-detail-placeholder p { font-size: 14.5px; font-weight: 700; margin: 6px 0 0; }
  .cc-detail-placeholder span { font-size: 12.5px; color: var(--cc-text-faint); max-width: 240px; line-height: 1.5; }

  /* ---------- Shared panel shell ---------- */
  .cc-panel { background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 18px; padding: 20px 20px 18px; }
  .cc-panel-subhead { display: flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; color: var(--cc-text-faint); margin: 18px 0 8px; }
  .cc-panel-subhead:first-of-type { margin-top: 4px; }
  .cc-panel-subhead-alt { color: var(--cc-forest-2); }
  .cc-panel-text { font-size: 13.5px; line-height: 1.6; color: var(--cc-text-soft); margin: 0; }

  /* ---------- Detail panel ---------- */
  .cc-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .cc-panel-head-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cc-panel-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: var(--cc-bg-alt); border: none; color: var(--cc-text-soft); }
  .cc-panel-close:hover { background: var(--cc-border); }
  .cc-panel-title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 14px; }
  .cc-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cc-detail-cell { background: var(--cc-bg-alt); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
  .cc-detail-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em; color: var(--cc-text-faint); }
  .cc-detail-value { font-size: 13.5px; font-weight: 700; color: var(--cc-text); }

  /* ---------- Timeline ---------- */
  .cc-timeline { display: flex; flex-direction: column; }
  .cc-timeline-step { display: flex; gap: 12px; opacity: 0; animation: cc-timeline-in 0.4s ease forwards; }
  .cc-timeline-marker { display: flex; flex-direction: column; align-items: center; }
  .cc-timeline-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--cc-emerald); flex-shrink: 0; margin-top: 3px; }
  .cc-timeline-line { width: 1px; flex: 1; background: var(--cc-border); min-height: 22px; }
  .cc-timeline-body { padding-bottom: 16px; display: flex; flex-direction: column; gap: 1px; }
  .cc-timeline-time { font-size: 11px; font-weight: 700; color: var(--cc-text-faint); }
  .cc-timeline-label { font-size: 13px; font-weight: 600; color: var(--cc-text); }

  /* ---------- Intelligence panel ---------- */
  .cc-intel-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
  .cc-intel-stat { background: var(--cc-mint-2); border-radius: 12px; padding: 12px 12px 11px; display: flex; flex-direction: column; gap: 4px; }
  .cc-intel-stat-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em; color: var(--cc-forest-2); opacity: 0.7; }
  .cc-intel-stat-value { font-size: 16px; font-weight: 800; color: var(--cc-forest-2); letter-spacing: -0.01em; }
  .cc-confidence-track { height: 4px; border-radius: 100px; background: rgba(20,52,42,0.12); margin-top: 4px; overflow: hidden; }
  .cc-confidence-fill { height: 100%; background: var(--cc-emerald); border-radius: 100px; transition: width 0.8s ease; }

  /* ---------- Action center ---------- */
  .cc-panel-action-text { font-size: 14px; font-weight: 700; color: var(--cc-text); margin: 2px 0 14px; }
  .cc-action-buttons { display: flex; flex-wrap: wrap; gap: 8px; position: relative; }
  .cc-btn-sm { padding: 9px 14px; font-size: 12.5px; border-radius: 10px; }
  .cc-btn-xs { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

  .cc-popover-wrap { position: relative; }
  .cc-popover { position: absolute; top: calc(100% + 8px); left: 0; z-index: 20; background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 14px; padding: 14px; width: 240px; box-shadow: 0 14px 34px rgba(20,40,30,0.16); animation: cc-panel-in 0.18s ease; }
  .cc-popover-wide { width: 260px; }
  .cc-popover-text { font-size: 12.5px; line-height: 1.5; color: var(--cc-text-soft); margin: 0 0 10px; }
  .cc-popover-text-strong { display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--cc-text); }
  .cc-popover-buttons { display: flex; justify-content: flex-end; gap: 8px; }

  .cc-team-list { display: flex; flex-direction: column; gap: 4px; }
  .cc-team-option { display: flex; align-items: center; gap: 10px; background: none; border: 1px solid transparent; border-radius: 10px; padding: 7px 8px; text-align: left; }
  .cc-team-option:hover { background: var(--cc-bg-alt); }
  .cc-team-option-active { border-color: var(--cc-emerald); background: var(--cc-mint-2); }
  .cc-team-avatar { width: 26px; height: 26px; border-radius: 50%; background: var(--cc-forest); color: var(--cc-mint-2); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cc-team-info { display: flex; flex-direction: column; }
  .cc-team-name { font-size: 12.5px; font-weight: 700; color: var(--cc-text); }
  .cc-team-role { font-size: 11px; color: var(--cc-text-faint); }

  .cc-toast { display: flex; align-items: center; gap: 7px; margin-top: 14px; background: var(--cc-mint); color: var(--cc-forest-2); font-size: 12.5px; font-weight: 700; padding: 9px 13px; border-radius: 10px; animation: cc-toast-in 0.25s ease; }

  /* ---------- Feed selection / status states ---------- */
  .cc-feed-row-selected { background: var(--cc-mint-2); border-left-width: 4px; }
  .cc-feed-row-handled .cc-feed-type { color: var(--cc-text-soft); }
  .cc-mini-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 100px; background: var(--cc-bg-alt); color: var(--cc-text-soft); }
  .cc-mini-tag-ack { background: var(--cc-mint); color: var(--cc-emerald); }
  .cc-mini-tag-escalated { background: var(--cc-amber-bg); color: #8A5A16; }
  .cc-mini-tag-assigned { background: var(--cc-mint-2); color: var(--cc-forest-2); }

  /* ---------- Alert history ---------- */
  .cc-history-card { background: var(--cc-white); border: 1px solid var(--cc-border); border-radius: 18px; padding: 20px 22px 6px; }
  .cc-history-row { display: flex; align-items: flex-start; gap: 12px; }
  .cc-history-marker { display: flex; flex-direction: column; align-items: center; }
  .cc-history-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--cc-mint); color: var(--cc-emerald); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cc-history-line { width: 1px; flex: 1; background: var(--cc-border); min-height: 20px; }
  .cc-history-body { flex: 1; padding: 2px 0 18px; display: flex; flex-direction: column; gap: 2px; }
  .cc-history-type { font-size: 13.5px; font-weight: 700; color: var(--cc-text); }
  .cc-history-meta { font-size: 12px; color: var(--cc-text-faint); }
  .cc-history-time { font-size: 11.5px; color: var(--cc-text-faint); font-weight: 600; padding-top: 4px; white-space: nowrap; }

  .cc-footer { text-align: center; padding-top: 56px; font-size: 12px; color: var(--cc-text-faint); }

  /* ---------- Reveal animation ---------- */
  .cc-reveal { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .cc-reveal-in { opacity: 1; transform: translateY(0); }

  @keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
  @keyframes cc-radar-expand { 0% { transform: scale(0.4); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes cc-row-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cc-shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
  @keyframes cc-panel-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cc-timeline-in { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes cc-toast-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  /* ---------- Responsive ---------- */
  @media (max-width: 1180px) {
    .cc-command-grid { grid-template-columns: 1fr; }
    .cc-command-right { position: static; top: auto; }
  }
  @media (max-width: 1024px) {
    .cc-summary-grid { grid-template-columns: repeat(2, 1fr); }
    .cc-priority-grid { grid-template-columns: repeat(2, 1fr); }
    .cc-nav-links { display: none; }
  }
  @media (max-width: 640px) {
    .cc-navbar-inner { padding: 12px 18px; }
    .cc-main { padding: 0 18px 56px; }
    .cc-hero-inner { padding: 44px 18px 40px; }
    .cc-hero-heading { font-size: 32px; }
    .cc-hero-stats { flex-wrap: wrap; row-gap: 10px; }
    .cc-summary-grid { grid-template-columns: 1fr 1fr; }
    .cc-priority-card { padding: 22px 18px 20px; }
    .cc-priority-grid { grid-template-columns: 1fr 1fr; }
    .cc-priority-buttons { flex-direction: column; }
    .cc-priority-buttons .cc-btn { width: 100%; justify-content: center; }
    .cc-toolbar-row { flex-direction: column; align-items: stretch; }
    .cc-toolbar-controls { justify-content: flex-start; }
    .cc-feed-time { display: none; }
    .cc-detail-grid { grid-template-columns: 1fr 1fr; }
    .cc-intel-stats { grid-template-columns: 1fr; }
    .cc-action-buttons { flex-direction: column; align-items: stretch; }
    .cc-action-buttons .cc-btn { justify-content: center; }
    .cc-popover { width: 100%; left: 0; right: 0; }
    .cc-popover-wide { width: 100%; }
  }
`;
