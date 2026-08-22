import type {
  AIStorageRecommendation,
  SpoilageIntelligenceData,
  StorageEvent,
  StorageHeroMetric,
  StorageSummary,
  StorageZone,
  TemperatureTrendPoint,
} from "@/types/storage";

/* ---------------------------------
   HERO METRICS
---------------------------------- */

export const STORAGE_HERO_METRICS: StorageHeroMetric[] = [
  {
    label: "Active Storage Zones",
    value: "6",
    trend: "+2 today",
    status: "normal",
  },
  {
    label: "Inventory Protected",
    value: "18.4T",
    trend: "Across all zones",
    status: "normal",
  },
  {
    label: "Average Temperature",
    value: "3.8°C",
    trend: "Within target range",
    status: "normal",
  },
  {
    label: "High-Risk Inventory",
    value: "2",
    trend: "Requires attention",
    status: "critical",
  },
];

/* ---------------------------------
   SUMMARY
---------------------------------- */

export const STORAGE_SUMMARY: StorageSummary = {
  totalZones: 6,
  healthyZones: 4,
  warningZones: 1,
  criticalZones: 1,
  averageTemperature: 3.8,
  averageHumidity: 76,
  protectedInventory: "18.4T",
};

/* ---------------------------------
   STORAGE ZONES
---------------------------------- */

export const STORAGE_ZONES: StorageZone[] = [
  {
    id: "zone-a",
    name: "Storage Zone A",
    product: "Fresh Vegetables",
    temperature: 3.2,
    humidity: 78,
    status: "normal",
    spoilageRisk: 12,
    trend: [3.0, 3.1, 3.2, 3.1, 3.3, 3.2, 3.2],
    lastUpdated: "Just now",
  },
  {
    id: "zone-b",
    name: "Storage Zone B",
    product: "Dairy Products",
    temperature: 4.1,
    humidity: 81,
    status: "normal",
    spoilageRisk: 18,
    trend: [3.8, 3.9, 4.0, 4.2, 4.1, 4.0, 4.1],
    lastUpdated: "1 min ago",
  },
  {
    id: "zone-c",
    name: "Storage Zone C",
    product: "Frozen Food",
    temperature: -15.8,
    humidity: 64,
    status: "warning",
    spoilageRisk: 42,
    trend: [-16.8, -16.5, -16.2, -16.0, -15.9, -15.8, -15.8],
    lastUpdated: "2 mins ago",
  },
  {
    id: "zone-d",
    name: "Storage Zone D",
    product: "Fresh Fruits",
    temperature: 7.6,
    humidity: 89,
    status: "critical",
    spoilageRisk: 82,
    trend: [4.2, 4.8, 5.6, 6.2, 6.8, 7.2, 7.6],
    lastUpdated: "Just now",
  },
  {
    id: "zone-e",
    name: "Storage Zone E",
    product: "Meat & Poultry",
    temperature: 2.4,
    humidity: 73,
    status: "normal",
    spoilageRisk: 15,
    trend: [2.1, 2.2, 2.3, 2.4, 2.5, 2.4, 2.4],
    lastUpdated: "3 mins ago",
  },
  {
    id: "zone-f",
    name: "Storage Zone F",
    product: "Pharmaceuticals",
    temperature: 5.2,
    humidity: 69,
    status: "warning",
    spoilageRisk: 36,
    trend: [4.4, 4.5, 4.7, 4.9, 5.0, 5.1, 5.2],
    lastUpdated: "1 min ago",
  },
];

/* ---------------------------------
   SPOILAGE INTELLIGENCE
---------------------------------- */

export const SPOILAGE_INTELLIGENCE: SpoilageIntelligenceData = {
  riskScore: 68,

  factors: [
    {
      label: "Temperature",
      value: "7.6°C",
    },
    {
      label: "Humidity",
      value: "89%",
    },
    {
      label: "Exposure",
      value: "2h 18m",
    },
    {
      label: "Product Sensitivity",
      value: "High",
    },
  ],

  insights: [
    {
      title: "Temperature above safe range",
      detail:
        "Storage Zone D is operating above the recommended temperature threshold.",
      tag: "Critical",
    },
    {
      title: "Humidity is increasing",
      detail: "High humidity may accelerate product degradation.",
      tag: "Warning",
    },
    {
      title: "Move sensitive inventory",
      detail:
        "Prioritize relocating high-value and perishable products.",
      tag: "Suggested",
    },
  ],
};

/* ---------------------------------
   TEMPERATURE TREND
---------------------------------- */

export const TEMPERATURE_TREND: TemperatureTrendPoint[] = [
  {
    time: "00:00",
    temperature: 3.2,
    humidity: 74,
  },
  {
    time: "04:00",
    temperature: 3.4,
    humidity: 75,
  },
  {
    time: "08:00",
    temperature: 3.8,
    humidity: 77,
  },
  {
    time: "12:00",
    temperature: 4.3,
    humidity: 80,
  },
  {
    time: "16:00",
    temperature: 4.8,
    humidity: 82,
  },
  {
    time: "20:00",
    temperature: 4.1,
    humidity: 78,
  },
  {
    time: "Now",
    temperature: 3.8,
    humidity: 76,
  },
];

/* ---------------------------------
   STORAGE EVENTS
---------------------------------- */

export const STORAGE_EVENTS: StorageEvent[] = [
  {
    id: "event-1",
    title: "Temperature alert detected",
    description:
      "Storage Zone D exceeded the recommended temperature range.",
    time: "2 mins ago",
    status: "critical",
  },
  {
    id: "event-2",
    title: "Humidity increased",
    description:
      "Storage Zone C humidity crossed the configured threshold.",
    time: "18 mins ago",
    status: "warning",
  },
  {
    id: "event-3",
    title: "Sensor data synchronized",
    description:
      "All storage sensors successfully reported live telemetry.",
    time: "32 mins ago",
    status: "normal",
  },
  {
    id: "event-4",
    title: "Cooling system stabilized",
    description:
      "Storage Zone B returned to its optimal temperature range.",
    time: "1 hour ago",
    status: "normal",
  },
];

/* ---------------------------------
   AI RECOMMENDATION
---------------------------------- */

export const AI_STORAGE_RECOMMENDATION: AIStorageRecommendation = {
  title: "Immediate action recommended",
  description:
    "Move sensitive inventory away from Storage Zone D and inspect its cooling system. The current temperature trend indicates a high spoilage risk.",
  priority: "high",
  action: "Review Zone D",
};