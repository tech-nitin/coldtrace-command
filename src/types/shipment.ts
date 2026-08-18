export type ShipmentStatus =
  | "in-transit"
  | "at-risk"
  | "critical"
  | "delayed"
  | "delivered";

export type RiskLevel =
  | "low"
  | "medium"
  | "high";

export type SensorState =
  | "normal"
  | "warn"
  | "critical";

export interface SensorEvent {
  time: string;
  label: string;
  tone: SensorState;
}

export interface Shipment {
  id: string;
  cargoType: string;
  origin: string;
  destination: string;

  status: ShipmentStatus;

  temperature: number;
  temperatureState: SensorState;
  tempHistory: number[];

  safeMaxTemp: number;
  criticalTemp: number;

  humidity: number;
  health: number;

  aiRisk: RiskLevel;
  riskReason?: string;

  eta: string;
  lastUpdateMinutesAgo: number;
  progress: number;

  sensorOnline: boolean;

  recentEvents: SensorEvent[];

  aiRecommendation: string;
}

export type FilterKey =
  | "all"
  | "active"
  | "at-risk"
  | "critical"
  | "delayed"
  | "delivered";

export type SortKey =
  | "recent"
  | "health-asc"
  | "risk-desc"
  | "eta";

export type ViewMode =
  | "grid"
  | "list";

export interface SummaryMetric {
  key:
    | "total"
    | "in-transit"
    | "at-risk"
    | "critical"
    | "delayed";

  label: string;
  value: number;

  tone:
    | "neutral"
    | "amber"
    | "red"
    | "green";

  trendLabel: string;

  trendTone:
    | "up"
    | "down"
    | "flat";

  filter: FilterKey;
}