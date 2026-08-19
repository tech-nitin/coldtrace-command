import { useEffect, useState } from "react";

import type { TelemetryFrame } from "@/types/telemetry";
import {
  generateLiveTelemetry,
  generateMockTelemetry,
} from "@/lib/telemetry-simulator";

interface UseTelemetrySimulationOptions {
  shipmentId?: string;
  enabled?: boolean;
  interval?: number;
  historySize?: number;
}

export function useTelemetrySimulation({
  shipmentId = "CHL-001",
  enabled = true,
  interval = 3000,
  historySize = 30,
}: UseTelemetrySimulationOptions = {}) {
  const [history, setHistory] = useState<TelemetryFrame[]>(() =>
    generateMockTelemetry(shipmentId, historySize),
  );

  const [latest, setLatest] = useState<TelemetryFrame>(() => {
    const initialData = generateMockTelemetry(shipmentId, 1);

    return initialData[0]!;
  });

  useEffect(() => {
    if (!enabled) return;

    const timer = window.setInterval(() => {
      setHistory((currentHistory) => {
        const previous =
          currentHistory[currentHistory.length - 1] ?? null;

        const next = generateLiveTelemetry(
          previous,
          shipmentId,
        );

        setLatest(next);

        return [
          ...currentHistory.slice(
            Math.max(0, currentHistory.length - historySize + 1),
          ),
          next,
        ];
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [enabled, interval, shipmentId, historySize]);

  return {
    latest,
    history,
  };
}