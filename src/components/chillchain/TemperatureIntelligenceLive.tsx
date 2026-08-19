import { TemperatureIntelligence } from "./TemperatureIntelligence";
import { useTelemetrySimulation } from "@/hooks/useTelemetrySimulation";

export function TemperatureIntelligenceLive() {
  const { history } = useTelemetrySimulation({
    shipmentId: "CHL-001",
    enabled: true,
    interval: 3000,
    historySize: 30,
  });

  return (
    <TemperatureIntelligence
      liveData={history}
      liveShipmentId="CHL-001"
    />
  );
}