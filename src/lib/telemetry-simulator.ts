import type { TelemetryFrame } from "@/types/telemetry";

function getRiskLevel(
  temp: number,
): TelemetryFrame["level"] {
  if (temp >= 10) return "critical";
  if (temp >= 8) return "warning";
  return "healthy";
}

/**
 * Generates historical mock telemetry.
 * Used to fill the initial temperature graph.
 */
export function generateMockTelemetry(
  shipmentId: string,
  historySize: number = 30,
): TelemetryFrame[] {
  const now = Date.now();
  const data: TelemetryFrame[] = [];

  for (let i = 0; i < historySize; i++) {
    const temp =
      4 +
      Math.sin(i / 4) * 1.5 +
      (Math.random() - 0.5) * 0.8;

    data.push({
      shipmentId,
      temp: Number(temp.toFixed(1)),
      humidity: Number(
        (65 + (Math.random() - 0.5) * 10).toFixed(1),
      ),
      risk: Math.max(
        0,
        Math.min(
          100,
          Math.round((temp - 4) * 12 + Math.random() * 10),
        ),
      ),
      level: getRiskLevel(temp),

      // Existing TempPoint compatibility
      time: new Date(
        now - (historySize - i) * 60_000,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      safeLow: 2,
      safeHigh: 8,
      critical: 10,

      timestamp: new Date(
        now - (historySize - i) * 60_000,
      ).toISOString(),
    });
  }

  return data;
}

/**
 * Generates the next live telemetry reading.
 * Later this can be replaced with ESP8266 data.
 */
export function generateLiveTelemetry(
  previous: TelemetryFrame | null,
  shipmentId: string,
): TelemetryFrame {
  const baseTemperature = previous?.temp ?? 4;

  // Smooth temperature movement
  const change = (Math.random() - 0.5) * 1.2;

  const temp = Math.max(
    0,
    Math.min(15, baseTemperature + change),
  );

  const humidity = Math.max(
    40,
    Math.min(
      90,
      (previous?.humidity ?? 65) +
        (Math.random() - 0.5) * 4,
    ),
  );

  const risk = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Math.max(0, temp - 4) * 15 +
          Math.random() * 10,
      ),
    ),
  );

  return {
    shipmentId,
    temp: Number(temp.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    risk,
    level: getRiskLevel(temp),

    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    safeLow: 2,
    safeHigh: 8,
    critical: 10,

    timestamp: new Date().toISOString(),
  };
}