/**
 * ChillChain AI — shared live telemetry types.
 *
 * `TelemetryFrame` is the shape any live data source (the upcoming shipment
 * simulation, and later the real ESP8266 -> backend pipeline) must produce.
 * It deliberately extends `TempPoint` so a stream of frames can be handed
 * straight to the existing Recharts implementation with no remapping, while
 * still carrying the extra fields (humidity, risk, level, shipment identity,
 * timestamp) that other telemetry-aware UI needs.
 *
 * Components should never depend on *how* a TelemetryFrame was produced —
 * only on this shape. Swap the source (mock generator -> simulation engine
 * -> real backend) without touching consumers.
 */

import type { Range, RiskLevel, TempPoint } from "@/lib/ChillChain-data";

export interface TelemetryFrame extends TempPoint {
  /** Shipment this frame belongs to, e.g. "CHL-001". */
  shipmentId: string;
  /** Relative humidity, percent. */
  humidity: number;
  /** AI-computed spoilage/anomaly risk score, 0-100. */
  risk: number;
  /** Coarse health level — drives badge/pill color (matches existing RiskLevel). */
  level: RiskLevel;
  /** Optional fine-grained phase label (e.g. "MONITORING", "RECOVERED") for
   *  UI that wants more nuance than `level` alone provides. Not required. */
  status?: string;
  /** ISO timestamp (or any Date-parseable string) for this sample. Enables
   *  genuine elapsed-time calculations (e.g. unsafe exposure duration)
   *  instead of estimates. */
  timestamp?: string;
}

/**
 * Approximate minutes represented by one sample in each mock range. Used
 * ONLY as a fallback when individual samples don't carry real timestamps —
 * i.e. the historical mock series, never live telemetry (which carries real
 * timestamps and needs no estimate).
 */
export const RANGE_INTERVAL_MINUTES: Record<Range, number> = {
  "24H": 60,
  "7D": 360,
  "30D": 1440,
};

interface TemperatureLike {
  temp: number;
  safeLow?: number;
  safeHigh: number;
  critical: number;
  timestamp?: string;
}

export interface TemperatureStats {
  current: number;
  previous: number;
  average: number;
  peak: number;
  excursions: number;
  unsafeExposureMinutes: number;
  aboveSafe: number;
  trend: "rising" | "falling" | "stable";
  level: RiskLevel;
  safeLow: number;
  safeHigh: number;
  critical: number;
}

/** Pure derivation: is a temperature reading healthy, warning or critical,
 *  given the safe/critical thresholds carried by that sample. */
export function deriveTemperatureLevel(
  temp: number,
  safeHigh: number,
  critical: number,
): RiskLevel {
  if (temp >= critical) return "critical";
  if (temp >= safeHigh) return "warning";
  return "healthy";
}

/**
 * Derives every headline Temperature Intelligence metric from a single
 * dataset — mock or live, it doesn't matter which. Returns null when there
 * is genuinely no data, so callers can render an explicit empty state
 * instead of inventing numbers.
 */
export function computeTemperatureStats(
  points: TemperatureLike[],
  fallbackIntervalMinutes: number,
): TemperatureStats | null {
  if (!points.length) return null;

  const temps = points.map((p) => p.temp);
  const last = points[points.length - 1]!;
  const prevPoint = points.length > 1 ? points[points.length - 2]! : last;

  const current = last.temp;
  const previous = prevPoint.temp;
  const average = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  const peak = Math.max(...temps);

  const breachedPoints = points.filter((p) => p.temp >= p.critical);
  const excursions = breachedPoints.length;

  const hasTimestamps = points.every((p) => Boolean(p.timestamp));
  let unsafeExposureMinutes = 0;

  if (hasTimestamps) {
    // Real elapsed time between consecutive samples while breached — used
    // whenever samples carry genuine timestamps (live telemetry).
    for (let i = 1; i < points.length; i++) {
      const point = points[i]!;
      if (point.temp >= point.critical) {
        const prevTime = new Date(points[i - 1]!.timestamp!).getTime();
        const currTime = new Date(point.timestamp!).getTime();
        const deltaMinutes = Math.max(0, (currTime - prevTime) / 60000);
        unsafeExposureMinutes += deltaMinutes;
      }
    }
  } else {
    // No per-sample timestamps (historical mock ranges) — approximate using
    // the known spacing between samples for the active range.
    unsafeExposureMinutes = excursions * fallbackIntervalMinutes;
  }

  const trend: TemperatureStats["trend"] =
    current > previous ? "rising" : current < previous ? "falling" : "stable";

  const safeHigh = last.safeHigh;
  const critical = last.critical;
  const safeLow = last.safeLow ?? 0;
  const aboveSafe = Math.max(0, current - safeHigh);
  const level = deriveTemperatureLevel(current, safeHigh, critical);

  return {
    current,
    previous,
    average,
    peak,
    excursions,
    unsafeExposureMinutes,
    aboveSafe,
    trend,
    level,
    safeLow,
    safeHigh,
    critical,
  };
}
