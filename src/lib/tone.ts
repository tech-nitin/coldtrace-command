export type Tone = "normal" | "healthy" | "warning" | "critical";

export const severityLabel = {
  normal: "Normal",
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
} as const;

export const toneStyles = {
  normal: {
    solid: "#16a34a",
    glow: "rgba(22, 163, 74, 0.25)",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-700",
  },

  healthy: {
    solid: "#16a34a",
    glow: "rgba(22, 163, 74, 0.25)",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-700",
  },

  warning: {
    solid: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.25)",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },

  critical: {
    solid: "#ef4444",
    glow: "rgba(239, 68, 68, 0.25)",
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
  },
} as const;