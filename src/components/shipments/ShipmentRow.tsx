import { motion } from "framer-motion";
import { Clock, MapPin, WifiOff } from "lucide-react";
import { Shipment, ViewMode } from "../../types/shipment";
import { healthTone, riskConfig, statusConfig } from "./statusStyles";

interface ShipmentRowProps {
  shipment: Shipment;
  view: ViewMode;
  isSelected: boolean;
  onSelect: (shipment: Shipment) => void;
}

function MiniProgress({ progress }: { progress: number }) {
  return (
    <div className="relative h-1 w-full max-w-[140px] rounded-full bg-[#EEEADC]">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-[#1E8F55]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function ShipmentRow({ shipment, view, isSelected, onSelect }: ShipmentRowProps) {
  const status = statusConfig[shipment.status];
  const risk = riskConfig[shipment.aiRisk];
  const isCritical = shipment.status === "critical";
  const tempColor =
    shipment.temperatureState === "critical"
      ? "text-[#C0473C]"
      : shipment.temperatureState === "warn"
      ? "text-[#C1852B]"
      : "text-[#1B4B33]";

  return (
    <motion.button
      layout
      onClick={() => onSelect(shipment)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.995 }}
      transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className={`group relative flex w-full text-left transition-colors ${
        view === "grid" ? "flex-col gap-3" : "flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
      } rounded-xl border px-4 py-3.5 ${
        isSelected
          ? "border-[#1E8F55] bg-[#F3FAF5]"
          : isCritical
          ? "border-[#F0C9C2] bg-white hover:border-[#E7B8B0]"
          : "border-transparent bg-white hover:border-[#E7E3D4] hover:bg-[#FBFAF4]"
      }`}
    >
      {isSelected && (
        <motion.span
          layoutId="row-selected-accent"
          className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#1E8F55]"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      {isCritical && !isSelected && (
        <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#C0473C]" />
      )}

      {/* ID + route */}
      <div className={view === "grid" ? "" : "sm:w-64 sm:shrink-0"}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#14231B]">{shipment.id}</span>
          {shipment.sensorOnline ? (
            <span className="relative flex h-1.5 w-1.5" title="Sensor connected">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E8F55] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1E8F55]" />
            </span>
          ) : (
            <span title="Sensor offline" className="flex">
              <WifiOff className="h-3 w-3 text-[#C9D2CB]" />
            </span>
          )}
          <span className="text-xs text-[#98A093]">· {shipment.cargoType}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7568]">
          <MapPin className="h-3 w-3 text-[#98A093]" />
          {shipment.origin}
          <span className="text-[#C9D2CB]">→</span>
          {shipment.destination}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <MiniProgress progress={shipment.progress} />
          <span className="text-[11px] font-medium text-[#98A093]">{shipment.progress}%</span>
        </div>
      </div>

      {/* Metrics */}
      <div
        className={`flex items-center gap-4 text-xs ${
          view === "grid" ? "justify-between" : "sm:w-56 sm:shrink-0"
        }`}
      >
        <span className={`font-semibold tabular-nums ${tempColor}`}>
          {shipment.temperature.toFixed(1)}°C
        </span>
        <span className="font-semibold tabular-nums text-[#1B4B33]">{shipment.humidity}% RH</span>
        <span
          className="font-semibold tabular-nums"
          style={{ color: healthTone(shipment.health) }}
        >
          Health {shipment.health}
        </span>
      </div>

      {/* ETA + status */}
      <div
        className={`flex items-center gap-2 text-[11px] text-[#98A093] ${
          view === "grid" ? "justify-between" : "sm:w-40 sm:shrink-0"
        }`}
      >
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {shipment.eta}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* AI risk */}
      <div
        className={`flex items-center gap-1.5 text-xs font-semibold ${risk.text} ${
          view === "grid" ? "justify-between border-t border-[#EEEADC] pt-2.5" : "sm:w-28 sm:shrink-0 sm:justify-end"
        }`}
      >
        {view === "grid" && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-[#98A093]">
            AI Risk
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${risk.dot} ${
              shipment.aiRisk === "high" ? "animate-pulse" : ""
            }`}
          />
          {risk.label.toUpperCase()}
        </span>
      </div>
    </motion.button>
  );
}
