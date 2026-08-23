import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import { io } from "socket.io-client";
import { TemperatureIntelligence } from "./TemperatureIntelligence";

type TelemetryPoint = {
  time: string;
  temperature: number;
  humidity: number;
};

type TelemetryUpdate = {
  shipmentId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
};

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SHIPMENT_ID = "CG-10490";

export function TemperatureIntelligenceLive() {
  const [history, setHistory] = useState<TelemetryPoint[]>([]);

  useEffect(() => {
    // const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("telemetry_update", (data: TelemetryUpdate) => {
      // Only show data for this shipment
      if (data.shipmentId !== SHIPMENT_ID) return;

      const newPoint: TelemetryPoint = {
        time: new Date(data.timestamp || Date.now()).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        ),
        temperature: data.temperature,
        humidity: data.humidity,
      };

      setHistory((previous) => {
        const updatedHistory = [...previous, newPoint];

        // Keep only the latest 30 readings
        return updatedHistory.slice(-30);
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <TemperatureIntelligence
      liveData={history}
      liveShipmentId={SHIPMENT_ID}
    />
  );
}