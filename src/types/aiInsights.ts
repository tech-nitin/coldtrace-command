export interface AIActivity {
  id: string;
  message: string;
  timestamp: string;
}

export interface AIConfidence {
  score: number;
  level: string;
  label: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  shipmentId: string;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: "low" | "medium" | "high";
}

export interface ExplainabilityFactor {
  label: string;
  value: number;
}

export interface PredictiveRiskData {
  currentRisk: number;
  predictedRisk: number;
  trend: "up" | "down" | "stable";
}