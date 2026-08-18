import { RiskLevel, SensorState, ShipmentStatus } from "../../types/shipment";

/**
 * Design tokens for the ChillChain AI "Shipments" surface.
 * Mirrors the existing dashboard's palette: warm off-white base, deep
 * forest-green typography, emerald accents, soft cream cards.
 *
 * If these already exist as Tailwind theme colors in the host project,
 * swap the arbitrary hex values below (bg-[#...]) for the theme tokens
 * (e.g. bg-forest-900) to stay in sync with the design system.
 */
export const tokens = {
  bg: "#F7F5EC",
  bgGradient: "linear-gradient(180deg, #F9F7EF 0%, #F1F5EE 100%)",
  card: "#FFFFFF",
  cardMuted: "#FDFCF7",
  border: "#E4E1D4",
  borderSoft: "#EAE7DA",
  forest900: "#122A1F",
  forest700: "#1E3D2C",
  forest500: "#33604A",
  textMuted: "#647065",
  emerald: "#2E9E68",
  emeraldSoft: "#E7F5EC",
  amber: "#C68A2E",
  amberSoft: "#FBF1DD",
  red: "#C1443A",
  redSoft: "#FBEAE8",
};

export const statusConfig: Record<
  ShipmentStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  "in-transit": {
    label: "In Transit",
    text: "text-[#1E3D2C]",
    bg: "bg-[#E7F5EC]",
    dot: "bg-[#2E9E68]",
  },
  "at-risk": {
    label: "At Risk",
    text: "text-[#8A5D1B]",
    bg: "bg-[#FBF1DD]",
    dot: "bg-[#C68A2E]",
  },
  critical: {
    label: "Critical",
    text: "text-[#8C2D25]",
    bg: "bg-[#FBEAE8]",
    dot: "bg-[#C1443A]",
  },
  delayed: {
    label: "Delayed",
    text: "text-[#8A5D1B]",
    bg: "bg-[#FBF1DD]",
    dot: "bg-[#C68A2E]",
  },
  delivered: {
    label: "Delivered",
    text: "text-[#5B6B60]",
    bg: "bg-[#EFEEE6]",
    dot: "bg-[#9AA79F]",
  },
};

export const riskConfig: Record<
  RiskLevel,
  { label: string; text: string; dot: string }
> = {
  low: { label: "Low", text: "text-[#1E3D2C]", dot: "bg-[#2E9E68]" },
  medium: { label: "Medium", text: "text-[#8A5D1B]", dot: "bg-[#C68A2E]" },
  high: { label: "High", text: "text-[#8C2D25]", dot: "bg-[#C1443A]" },
};

export const sensorStateConfig: Record<
  SensorState,
  { text: string; ring: string }
> = {
  normal: { text: "text-[#1E3D2C]", ring: "stroke-[#2E9E68]" },
  warn: { text: "text-[#8A5D1B]", ring: "stroke-[#C68A2E]" },
  critical: { text: "text-[#8C2D25]", ring: "stroke-[#C1443A]" },
};

export function healthTone(health: number) {
  if (health >= 85) return "#2E9E68";
  if (health >= 60) return "#C68A2E";
  return "#C1443A";
}
