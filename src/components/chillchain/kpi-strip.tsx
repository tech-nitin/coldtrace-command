import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

import { KPIS } from "@/lib/ChillChain-data";
import { Counter } from "./primitives";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const SHIPMENT_ID = "CG-10490";

const tone = {
  neutral: {
    bar: "bg-border-strong",
    text: "text-foreground",
  },
  healthy: {
    bar: "bg-success",
    text: "text-success",
  },
  warning: {
    bar: "bg-warning",
    text: "text-warning-foreground",
  },
  critical: {
    bar: "bg-destructive",
    text: "text-destructive",
  },
} as const;

type KpiTone = keyof typeof tone;

type TelemetryUpdate = {
  shipmentId: string;
  temperature: number;
  humidity: number;
  healthIndex: number;
  status: string;
  aiRiskLevel: string;
};

function getRiskTone(status: string): KpiTone {
  if (status === "CRITICAL") return "critical";

  if (
    status === "AT_RISK" ||
    status === "WARNING"
  ) {
    return "warning";
  }

  return "healthy";
}

export function KpiStrip() {
  const [liveData, setLiveData] =
    useState<TelemetryUpdate | null>(null);

  useEffect(() => {
    // const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log(
        "KPI socket connected:",
        socket.id
      );
    });

    socket.on(
      "telemetry_update",
      (data: TelemetryUpdate) => {
        // Only update dashboard KPI for main shipment
        if (data.shipmentId !== SHIPMENT_ID) {
          return;
        }

        setLiveData(data);
      }
    );

    socket.on("disconnect", () => {
      console.log("KPI socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Start with existing static KPI data
  // and replace important values with live telemetry
  const liveKpis = KPIS.map((kpi) => {
    const label = kpi.label.toLowerCase();

    if (!liveData) return kpi;

    // Temperature KPI
    if (label.includes("temperature")) {
      return {
        ...kpi,
        value: Number(liveData.temperature.toFixed(1)),
        suffix: "°C",
        tone: getRiskTone(liveData.status),
      };
    }

    // Humidity KPI
    if (label.includes("humidity")) {
      return {
        ...kpi,
        value: Math.round(liveData.humidity),
        suffix: "%",
        tone: "neutral" as KpiTone,
      };
    }

    // Health KPI
    if (
      label.includes("health") ||
      label.includes("cargo")
    ) {
      return {
        ...kpi,
        value: Math.round(liveData.healthIndex),
        suffix: "%",
        tone: getRiskTone(liveData.status),
      };
    }

    // Risk KPI
    if (label.includes("risk")) {
      return {
        ...kpi,
        value:
          liveData.aiRiskLevel === "HIGH"
            ? 85
            : liveData.aiRiskLevel === "MEDIUM"
              ? 50
              : 15,
        suffix: "%",
        tone: getRiskTone(liveData.status),
      };
    }

    return kpi;
  });

  return (
    <div className="border-y border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 md:grid-cols-3 lg:grid-cols-5">
        {liveKpis.map((kpi, i) => {
          const t =
            tone[kpi.tone as KpiTone];

          return (
            <motion.div
              key={kpi.label}
              initial={{
                opacity: 0,
                y: 22,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative px-2 py-8 lg:px-6"
            >
              <span
                className={`absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 ${t.bar} opacity-30 lg:block`}
              />

              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {kpi.label}
              </p>

              <motion.p
                key={`${kpi.label}-${kpi.value}`}
                initial={{
                  scale: 1.08,
                  opacity: 0.65,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.35,
                }}
                className={`mt-3 font-display text-4xl font-bold tracking-tight ${t.text}`}
              >
                <Counter
                  to={kpi.value}
                  suffix={kpi.suffix}
                />
              </motion.p>

              <span
                className={`mt-4 block h-1 w-10 origin-left rounded-full ${t.bar} transition-transform duration-500 group-hover:scale-x-[2.4]`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}