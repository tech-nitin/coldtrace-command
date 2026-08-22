export type StorageStatus = "normal" | "warning" | "critical";

export interface StorageHeroMetric {
  label: string;
  value: string;
  trend: string;
  status: StorageStatus;
}

export interface StorageSummary {
  totalZones: number;
  healthyZones: number;
  warningZones: number;
  criticalZones: number;
  averageTemperature: number;
  averageHumidity: number;
  protectedInventory: string;
}

export interface StorageZone {
  id: string;
  name: string;
  product: string;
  temperature: number;
  humidity: number;
  status: StorageStatus;
  spoilageRisk: number;
  trend: number[];
  lastUpdated: string;
}

/* ---------------------------------
   SPOILAGE INTELLIGENCE
---------------------------------- */

export type InsightTag = "Critical" | "Warning" | "Suggested";

export interface SpoilageFactor {
  label: string;
  value: string;
}

export interface SpoilageInsight {
  title: string;
  detail: string;
  tag: InsightTag;
}

export interface SpoilageIntelligenceData {
  riskScore: number;
  factors: SpoilageFactor[];
  insights: SpoilageInsight[];
}

/* ---------------------------------
   TEMPERATURE TREND
---------------------------------- */

export interface TemperatureTrendPoint {
  time: string;
  temperature: number;
  humidity: number;
}

/* ---------------------------------
   STORAGE EVENTS
---------------------------------- */

export interface StorageEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  status: StorageStatus;
}

/* ---------------------------------
   AI RECOMMENDATION
---------------------------------- */

export interface AIStorageRecommendation {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  action: string;
}