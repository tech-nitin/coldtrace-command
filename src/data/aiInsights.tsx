import type {
  AIActivity,
  AIConfidence,
  AIInsight,
  AIRecommendation,
  ExplainabilityFactor,
  PredictiveRiskData,
  RootCause,
} from "@/types/aiInsights";

export const aiInsights: AIInsight[] = [
  {
    id: "INS-001",
    title: "Temperature rising faster than expected",
    description:
      "Temperature has increased continuously during the latest monitoring window.",
    severity: "critical",
    confidence: 94,
    shipmentId: "CHL-001",
    timestamp: "Just now",
  },
  {
    id: "INS-002",
    title: "Humidity remains within safe range",
    description:
      "Humidity levels are stable and are not currently contributing significantly to risk.",
    severity: "healthy",
    confidence: 91,
    shipmentId: "CHL-001",
    timestamp: "2 min ago",
  },
  {
    id: "INS-003",
    title: "Cooling efficiency may be degrading",
    description:
      "The temperature recovery pattern is weaker than expected.",
    severity: "warning",
    confidence: 87,
    shipmentId: "CHL-001",
    timestamp: "5 min ago",
  },
];

export const predictiveRisk: PredictiveRiskData = {
  currentRisk: 78,
  predictedRisk: 91,
  level: "critical",
  forecastMinutes: 30,
  summary:
    "If the current temperature trend continues, the shipment is likely to enter a critical risk state within the next 30 minutes.",
};

export const rootCauses: RootCause[] = [
  {
    id: "RC-001",
    cause: "Cooling system anomaly",
    probability: 68,
    description:
      "Temperature recovery is slower than expected for normal refrigeration operation.",
  },
  {
    id: "RC-002",
    cause: "Frequent container exposure",
    probability: 21,
    description:
      "The temperature pattern could indicate repeated door openings.",
  },
  {
    id: "RC-003",
    cause: "External heat exposure",
    probability: 11,
    description:
      "External environmental conditions may be contributing to the rise.",
  },
];

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "REC-001",
    priority: "critical",
    title: "Verify refrigeration system",
    description:
      "Ask the driver to immediately verify compressor operation and power supply.",
  },
  {
    id: "REC-002",
    priority: "warning",
    title: "Increase telemetry sampling",
    description:
      "Reduce the sampling interval to capture temperature changes more closely.",
  },
];

export const confidenceData: AIConfidence = {
  overall: 94,
  signals: [
    {
      label: "Temperature trend",
      confidence: 98,
      description: "Strong and consistent upward trajectory detected.",
    },
    {
      label: "Historical patterns",
      confidence: 91,
      description:
        "Current behavior matches previous high-risk temperature excursions.",
    },
    {
      label: "Sensor consistency",
      confidence: 94,
      description:
        "Telemetry readings show stable and reliable sensor behavior.",
    },
  ],
};

export const aiActivity: AIActivity[] = [
  {
    id: "ACT-001",
    time: "Just now",
    title: "Risk prediction updated",
    description:
      "AI recalculated the spoilage probability using the latest telemetry.",
    type: "prediction",
  },
  {
    id: "ACT-002",
    time: "2 min ago",
    title: "Temperature anomaly detected",
    description:
      "A sustained temperature rise was detected above the recommended range.",
    type: "warning",
  },
  {
    id: "ACT-003",
    time: "4 min ago",
    title: "Root cause confidence increased",
    description:
      "The cooling-system anomaly hypothesis is now supported by more signals.",
    type: "analysis",
  },
  {
    id: "ACT-004",
    time: "7 min ago",
    title: "Operator intervention recommended",
    description:
      "AI generated a prioritized action to verify the refrigeration unit.",
    type: "critical",
  },
];

export const explainabilityFactors: ExplainabilityFactor[] = [
  {
    title: "Temperature is rising",
    contribution: 42,
    impact: "High impact",
    description:
      "Recent telemetry shows a sustained upward temperature trend approaching the critical threshold.",
  },
  {
    title: "Risk trend is accelerating",
    contribution: 31,
    impact: "Medium impact",
    description:
      "The AI risk score has increased consistently across the latest monitoring window.",
  },
  {
    title: "Historical pattern match",
    contribution: 18,
    impact: "Medium impact",
    description:
      "Current shipment behavior matches patterns observed during previous cold-chain excursions.",
  },
  {
    title: "Sensor confidence is strong",
    contribution: 9,
    impact: "Supporting signal",
    description:
      "The telemetry is internally consistent, increasing confidence in the prediction.",
  },
];