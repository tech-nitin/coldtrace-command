/**
 * ColdTrace AI — mock data layer.
 *
 * Everything the dashboard renders flows through these types and functions.
 * When the real ESP32 -> backend -> AI risk engine pipeline is ready, swap the
 * bodies of the `fetch*` helpers for server functions / REST calls; component
 * code does not need to change.
 */

export type RiskLevel = "healthy" | "warning" | "critical";
export type ProductType = "Fruits" | "Vegetables" | "Dairy" | "Seafood" | "Vaccines";

export interface Shipment {
  id: string;
  product: ProductType;
  batch: string;
  origin: string;
  destination: string;
  temperature: number;
  humidity: number;
  health: number;
  risk: number;
  level: RiskLevel;
  status: string;
  updatedAgo: string;
}

export interface TempPoint {
  t: string;
  temp: number;
  safeLow: number;
  safeHigh: number;
  critical: number;
}

export interface AlertItem {
  id: string;
  level: RiskLevel;
  title: string;
  shipment: string;
  detail: string;
  time: string;
}

export const KPIS = [
  { label: "Total Shipments", value: 24, suffix: "", tone: "neutral" as const },
  { label: "In Transit", value: 18, suffix: "", tone: "healthy" as const },
  { label: "At Risk", value: 3, suffix: "", tone: "warning" as const },
  { label: "Critical Alert", value: 1, suffix: "", tone: "critical" as const },
  { label: "Average Health", value: 78, suffix: "/100", tone: "healthy" as const },
];

export const SHIPMENTS: Shipment[] = [
  {
    id: "CG-10458",
    product: "Fruits",
    batch: "Fresh Produce Batch 12C",
    origin: "Indore",
    destination: "Delhi",
    temperature: 11.8,
    humidity: 74,
    health: 28,
    risk: 72,
    level: "critical",
    status: "Threshold Breached",
    updatedAgo: "12s ago",
  },
  {
    id: "CG-10442",
    product: "Vegetables",
    batch: "Leafy Greens Batch 04A",
    origin: "Delhi",
    destination: "Indore",
    temperature: 5.2,
    humidity: 69,
    health: 88,
    risk: 14,
    level: "healthy",
    status: "In Transit",
    updatedAgo: "26s ago",
  },
  {
    id: "CG-10431",
    product: "Dairy",
    batch: "Chilled Dairy Batch 09",
    origin: "Mumbai",
    destination: "Bhopal",
    temperature: 7.6,
    humidity: 81,
    health: 61,
    risk: 43,
    level: "warning",
    status: "Humidity Warning",
    updatedAgo: "41s ago",
  },
  {
    id: "CG-10428",
    product: "Seafood",
    batch: "Coastal Catch Batch 21",
    origin: "Pune",
    destination: "Nagpur",
    temperature: 2.1,
    humidity: 88,
    health: 82,
    risk: 21,
    level: "healthy",
    status: "In Transit",
    updatedAgo: "58s ago",
  },
  {
    id: "CG-10417",
    product: "Vaccines",
    batch: "Cold Chain Pharma 03",
    origin: "Delhi",
    destination: "Kolkata",
    temperature: 4.4,
    humidity: 52,
    health: 94,
    risk: 6,
    level: "healthy",
    status: "Optimal",
    updatedAgo: "1m ago",
  },
  {
    id: "CG-10409",
    product: "Fruits",
    batch: "Mango Export Batch 07",
    origin: "Nashik",
    destination: "Ahmedabad",
    temperature: 9.3,
    humidity: 77,
    health: 54,
    risk: 49,
    level: "warning",
    status: "Route Deviation",
    updatedAgo: "2m ago",
  },
];

export const ALERTS: AlertItem[] = [
  {
    id: "AL-901",
    level: "critical",
    title: "Temperature Breach",
    shipment: "CG-10458",
    detail: "11.8°C recorded — 4.8°C above safe ceiling for 38 min.",
    time: "just now",
  },
  {
    id: "AL-898",
    level: "warning",
    title: "Humidity Warning",
    shipment: "CG-10431",
    detail: "Relative humidity at 81% — condensation risk on dairy crates.",
    time: "3 min ago",
  },
  {
    id: "AL-894",
    level: "warning",
    title: "Route Deviation",
    shipment: "CG-10409",
    detail: "Vehicle 18 km off planned corridor near Dhule bypass.",
    time: "11 min ago",
  },
  {
    id: "AL-889",
    level: "critical",
    title: "Sensor Offline",
    shipment: "CG-10376",
    detail: "SHT40 heartbeat lost — ESP32 last seen 6 min ago.",
    time: "18 min ago",
  },
  {
    id: "AL-885",
    level: "healthy",
    title: "Temperature Normalized",
    shipment: "CG-10442",
    detail: "Back inside 2–8°C safe band after compressor restart.",
    time: "24 min ago",
  },
];

export const AI_ASSESSMENT = {
  spoilageRisk: 72,
  health: 28,
  anomalyScore: 0.87,
  safeMinutes: 18,
  explanation:
    "Temperature has remained above the safe range for 38 minutes, indicating possible refrigeration degradation.",
  recommendation: "Inspect refrigeration and prioritize delivery.",
};

export const PASSPORT = {
  id: "CG-10458",
  batch: "Fresh Produce Batch 12C",
  route: "Indore → Delhi",
  health: 28,
  risk: 72,
  maxTemp: 11.8,
  unsafeExposure: 47,
  excursions: 3,
  timeline: [
    { label: "Loaded & sealed", place: "Indore Hub", time: "06:12", state: "healthy" as RiskLevel },
    { label: "Pre-cool verified", place: "Indore Hub", time: "06:40", state: "healthy" as RiskLevel },
    { label: "Humidity drift", place: "Dewas", time: "09:05", state: "warning" as RiskLevel },
    { label: "First excursion", place: "Guna", time: "11:22", state: "warning" as RiskLevel },
    { label: "Threshold breach", place: "Gwalior", time: "13:48", state: "critical" as RiskLevel },
    { label: "In transit to Delhi", place: "Agra Bypass", time: "15:30", state: "critical" as RiskLevel },
  ],
};

export type Range = "24H" | "7D" | "30D";

const SAFE_LOW = 2;
const SAFE_HIGH = 8;
const CRITICAL = 10;

function seeded(i: number, seed: number) {
  return Math.sin(i * 1.37 + seed) * Math.cos(i * 0.53 + seed * 1.7);
}

export function temperatureSeries(range: Range, seed = 3): TempPoint[] {
  const count = range === "24H" ? 24 : range === "7D" ? 28 : 30;
  return Array.from({ length: count }, (_, i) => {
    const label =
      range === "24H"
        ? `${String(i).padStart(2, "0")}:00`
        : range === "7D"
          ? `D${Math.floor(i / 4) + 1}.${(i % 4) * 6}h`
          : `Day ${i + 1}`;
    const drift = i / count;
    const base = 4.4 + seeded(i, seed) * 1.1 + drift * drift * 8.2;
    return {
      t: label,
      temp: Number(Math.min(12.4, Math.max(1.4, base)).toFixed(1)),
      safeLow: SAFE_LOW,
      safeHigh: SAFE_HIGH,
      critical: CRITICAL,
    };
  });
}

export function humiditySeries(range: Range) {
  return temperatureSeries(range, 8).map((p, i) => ({
    t: p.t,
    humidity: Number((62 + seeded(i, 5) * 7 + i * 0.4).toFixed(1)),
    dew: Number((52 + seeded(i, 9) * 5).toFixed(1)),
  }));
}

export const RISK_DISTRIBUTION = [
  { name: "Healthy", value: 18, key: "healthy" },
  { name: "Warning", value: 5, key: "warning" },
  { name: "Critical", value: 1, key: "critical" },
];

export const EXCURSIONS = [
  { name: "Mon", excursions: 2, unsafe: 12 },
  { name: "Tue", excursions: 1, unsafe: 6 },
  { name: "Wed", excursions: 4, unsafe: 28 },
  { name: "Thu", excursions: 3, unsafe: 19 },
  { name: "Fri", excursions: 5, unsafe: 41 },
  { name: "Sat", excursions: 2, unsafe: 15 },
  { name: "Sun", excursions: 3, unsafe: 47 },
];

export const HEALTH_TREND = [
  { name: "W1", health: 71, fleet: 64 },
  { name: "W2", health: 74, fleet: 66 },
  { name: "W3", health: 69, fleet: 63 },
  { name: "W4", health: 78, fleet: 70 },
  { name: "W5", health: 83, fleet: 72 },
  { name: "W6", health: 78, fleet: 74 },
];

export interface RouteDef {
  id: string;
  from: string;
  to: string;
  level: RiskLevel;
  a: { x: number; y: number };
  b: { x: number; y: number };
  bend: number;
}

/** Coordinates are percentages inside the stylised India map viewbox. */
export const ROUTES: RouteDef[] = [
  {
    id: "CG-10458",
    from: "Indore",
    to: "Delhi",
    level: "critical",
    a: { x: 33, y: 47 },
    b: { x: 36, y: 27 },
    bend: -18,
  },
  {
    id: "CG-10431",
    from: "Mumbai",
    to: "Bhopal",
    level: "warning",
    a: { x: 24, y: 60 },
    b: { x: 39, y: 45 },
    bend: 22,
  },
  {
    id: "CG-10428",
    from: "Pune",
    to: "Nagpur",
    level: "healthy",
    a: { x: 27, y: 65 },
    b: { x: 44, y: 54 },
    bend: -16,
  },
  {
    id: "CG-10417",
    from: "Delhi",
    to: "Kolkata",
    level: "healthy",
    a: { x: 36, y: 27 },
    b: { x: 62, y: 47 },
    bend: 24,
  },
];

export const PIPELINE = [
  { key: "SHT40", label: "SHT40", note: "Temp + humidity sensor", metric: "1 Hz sampling" },
  { key: "ESP32", label: "ESP32", note: "Edge controller", metric: "Firmware v2.4" },
  { key: "WIFI", label: "Wi-Fi", note: "MQTT uplink", metric: "-58 dBm" },
  { key: "BACKEND", label: "Backend", note: "Ingest + timeseries", metric: "42 ms p95" },
  { key: "AI", label: "AI Risk Engine", note: "Anomaly + spoilage model", metric: "0.94 AUC" },
  { key: "DASH", label: "ColdTrace Dashboard", note: "Command center", metric: "Live" },
];
