import { motion } from "framer-motion";
import {
  Clock,
  Droplets,
  MapPin,
  Radio,
  Thermometer,
} from "lucide-react";
import { Shipment, ViewMode } from "../../types/shipment";
import {
  healthTone,
  riskConfig,
  statusConfig,
} from "./statusStyles";

interface ShipmentCardProps {
  shipment: Shipment;
  view: ViewMode;
  onSelect: (shipment: Shipment) => void;
}

function HealthRing({ health }: { health: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - health / 100);
  const tone = healthTone(health);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#EFEEE6"
          strokeWidth="4"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums text-[#122A1F]">
        {health}
      </span>
    </div>
  );
}

function RouteProgress({ progress }: { progress: number }) {
  return (
    <div className="relative mt-0.5 h-1 w-full rounded-full bg-[#EFEEE6]">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-[#2E9E68]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#2E9E68] shadow-sm"
        initial={{ left: "0%" }}
        animate={{ left: `${progress}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ marginLeft: -5 }}
      />
    </div>
  );
}

export function ShipmentCard({ shipment, view, onSelect }: ShipmentCardProps) {
  const status = statusConfig[shipment.status];
  const risk = riskConfig[shipment.aiRisk];
  const tempColor =
    shipment.temperatureState === "critical"
      ? "text-[#C1443A]"
      : shipment.temperatureState === "warn"
      ? "text-[#C68A2E]"
      : "text-[#1E3D2C]";

  return (
    <motion.button
      layout
      onClick={() => onSelect(shipment)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className={`group flex text-left ${
        view === "list" ? "flex-col sm:flex-row sm:items-center" : "flex-col"
      } gap-4 rounded-2xl border border-[#E4E1D4] bg-white p-5 shadow-[0_1px_2px_rgba(18,42,31,0.04)] transition-shadow hover:shadow-[0_14px_30px_rgba(18,42,31,0.08)]`}
    >
      {/* Header row */}
      <div
        className={`flex items-start justify-between ${
          view === "list" ? "sm:w-56 sm:shrink-0" : ""
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-[#122A1F]">
              {shipment.id}
            </span>
            {shipment.sensorOnline && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2E9E68] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2E9E68]" />
              </span>
            )}
          </div>
          <span className="text-xs text-[#8A9186]">{shipment.cargoType}</span>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Route */}
      <div className={view === "list" ? "sm:flex-1" : ""}>
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#5B6B60]">
          <MapPin className="h-3 w-3 text-[#9AA79F]" />
          <span className="text-[#1E3D2C]">{shipment.origin}</span>
          <span className="text-[#C9D2CB]">→</span>
          <span className="text-[#1E3D2C]">{shipment.destination}</span>
        </div>
        <RouteProgress progress={shipment.progress} />
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#9AA79F]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ETA {shipment.eta}
          </span>
          <span>{shipment.lastUpdateMinutesAgo}m ago</span>
        </div>
      </div>

      {/* Metrics */}
      <div
        className={`flex items-center gap-5 ${
          view === "list" ? "sm:w-64 sm:shrink-0 sm:justify-end" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex flex-col items-start gap-0.5 ${tempColor}`}>
            <span className="flex items-center gap-1 text-[11px] text-[#9AA79F]">
              <Thermometer className="h-3 w-3" />
              Temp
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {shipment.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="flex flex-col items-start gap-0.5 text-[#1E3D2C]">
            <span className="flex items-center gap-1 text-[11px] text-[#9AA79F]">
              <Droplets className="h-3 w-3" />
              Humidity
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {shipment.humidity}%
            </span>
          </div>
        </div>

        <HealthRing health={shipment.health} />
      </div>

      {/* AI Risk footer */}
      <div
        className={`flex items-center justify-between border-t border-[#EFEEE6] pt-3 text-[11px] ${
          view === "list" ? "sm:w-40 sm:shrink-0 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0" : ""
        }`}
      >
        <span className="flex items-center gap-1.5 font-medium text-[#8A9186]">
          <Radio className="h-3 w-3" />
          AI Risk
        </span>
        <span className={`flex items-center gap-1.5 font-semibold ${risk.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${risk.dot}`} />
          {risk.label}
        </span>
      </div>
    </motion.button>
  );
}
