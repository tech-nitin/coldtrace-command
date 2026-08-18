import { RiskLevel, SensorState, ShipmentStatus } from "../../types/shipment";

/**
 * Design tokens for ChillChain AI, matched to the existing Dashboard page.
 * Warm cream base, near-black/emerald two-tone headings, cream-white cards,
 * thin borders, restrained amber/red used only where risk is real.
 *
 * If these already exist as Tailwind theme colors in the host project,
 * swap the arbitrary hex values below (bg-[#...]) for the theme tokens to
 * stay in sync with the design system.
 */
export const tokens = {
  pageGradient: "linear-gradient(180deg, #F6F4EA 0%, #EFF3EC 45%, #F6F4EA 100%)",
  heroGradient: "linear-gradient(135deg, #E9F1EA 0%, #F6F4EA 60%)",
  card: "#FFFFFF",
  cardMuted: "#FCFBF6",
  border: "#E7E3D4",
  borderSoft: "#EEEADC",
  ink: "#14231B", // near-black headline color
  emerald: "#1E8F55", // vivid headline / accent emerald
  emeraldDeep: "#123423", // dark filled-button green
  emeraldSoft: "#E6F3EA",
  textMuted: "#6B7568",
  textFaint: "#98A093",
  amber: "#C1852B",
  amberSoft: "#FBF0DC",
  red: "#C0473C",
  redSoft: "#FBEAE7",
};

export const statusConfig: Record<
  ShipmentStatus,
  { label: string; text: string; bg: string; dot: string; border: string }
> = {
  "in-transit": {
    label: "In Transit",
    text: "text-[#1B4B33]",
    bg: "bg-[#E6F3EA]",
    dot: "bg-[#1E8F55]",
    border: "border-[#CFE6D8]",
  },
  "at-risk": {
    label: "At Risk",
    text: "text-[#8A5A16]",
    bg: "bg-[#FBF0DC]",
    dot: "bg-[#C1852B]",
    border: "border-[#F0DEB8]",
  },
  critical: {
    label: "Critical",
    text: "text-[#8A2E24]",
    bg: "bg-[#FBEAE7]",
    dot: "bg-[#C0473C]",
    border: "border-[#F0C9C2]",
  },
  delayed: {
    label: "Delayed",
    text: "text-[#8A5A16]",
    bg: "bg-[#FBF0DC]",
    dot: "bg-[#C1852B]",
    border: "border-[#F0DEB8]",
  },
  delivered: {
    label: "Delivered",
    text: "text-[#5E6B60]",
    bg: "bg-[#EEEDE4]",
    dot: "bg-[#9BA79E]",
    border: "border-[#E4E1D4]",
  },
};

export const riskConfig: Record<
  RiskLevel,
  { label: string; text: string; dot: string }
> = {
  low: { label: "Low", text: "text-[#1B4B33]", dot: "bg-[#1E8F55]" },
  medium: { label: "Medium", text: "text-[#8A5A16]", dot: "bg-[#C1852B]" },
  high: { label: "High", text: "text-[#8A2E24]", dot: "bg-[#C0473C]" },
};

export const sensorStateConfig: Record<
  SensorState,
  { line: string; fillFrom: string; fillTo: string; text: string }
> = {
  normal: { line: "#1E8F55", fillFrom: "#1E8F55", fillTo: "transparent", text: "text-[#1B4B33]" },
  warn: { line: "#C1852B", fillFrom: "#C1852B", fillTo: "transparent", text: "text-[#8A5A16]" },
  critical: { line: "#C0473C", fillFrom: "#C0473C", fillTo: "transparent", text: "text-[#8A2E24]" },
};

export function healthTone(health: number) {
  if (health >= 85) return "#1E8F55";
  if (health >= 60) return "#C1852B";
  return "#C0473C";
}

// Hover-only glow shadows, kept subtle and status-colored.
export const glowShadow: Record<"neutral" | "green" | "amber" | "red", string> = {
  neutral: "0 10px 26px rgba(20,35,27,0.08)",
  green: "0 10px 26px rgba(30,143,85,0.14)",
  amber: "0 10px 26px rgba(193,133,43,0.16)",
  red: "0 10px 26px rgba(192,71,60,0.18)",
};
