import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Droplets,
  MapPin,
  PackageSearch,
  Radio,
  Sparkles,
  Thermometer,
} from "lucide-react";
import { Shipment } from "../../types/shipment";
import { healthTone, riskConfig, statusConfig } from "./statusStyles";
import { TemperatureSparkline } from "./TemperatureSparkline";

interface ShipmentIntelligencePanelProps {
  shipment: Shipment | null;
}

function HealthRing({ health }: { health: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - health / 100);
  const tone = healthTone(health);

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 96 96" className="h-28 w-28 -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#EEEADC" strokeWidth="7" />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold tabular-nums text-[#14231B]">{health}</span>
        <span className="text-[10px] font-medium text-[#98A093]">/ 100</span>
      </div>
    </div>
  );
}

export function ShipmentIntelligencePanel({ shipment }: ShipmentIntelligencePanelProps) {
  if (!shipment) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#E7E3D4] bg-[#FCFBF6] p-8 text-center">
        <PackageSearch className="h-7 w-7 text-[#C9D2CB]" />
        <p className="text-sm font-medium text-[#6B7568]">
          Select a shipment to see live conditions and AI guidance.
        </p>
      </div>
    );
  }

  const status = statusConfig[shipment.status];
  const risk = riskConfig[shipment.aiRisk];
  const latestEvent = shipment.recentEvents[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7E3D4] bg-white">
      <div className="flex items-center justify-between border-b border-[#EEEADC] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E8F55] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1E8F55]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E8F55]">
            AI Analysis Live
          </span>
        </div>
        <span className="text-[11px] text-[#98A093]">
          {shipment.lastUpdateMinutesAgo <= 1
            ? "Updated just now"
            : `Updated ${shipment.lastUpdateMinutesAgo}m ago`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={shipment.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 p-5"
        >
          {/* Identity */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#14231B]">{shipment.id}</h3>
              <span className="text-xs text-[#98A093]">{shipment.cargoType}</span>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {/* Health ring */}
          <div className="flex flex-col items-center gap-1 self-center">
            <HealthRing health={shipment.health} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
              Shipment Health
            </span>
          </div>

          {/* Live conditions */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
              Live Conditions
            </span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E7E3D4] p-3">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[#98A093]">
                  <Thermometer className="h-3 w-3" />
                  Temperature
                </span>
                <span
                  className="mt-1 block text-lg font-semibold tabular-nums"
                  style={{
                    color:
                      shipment.temperatureState === "critical"
                        ? "#C0473C"
                        : shipment.temperatureState === "warn"
                        ? "#C1852B"
                        : "#14231B",
                  }}
                >
                  {shipment.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="rounded-xl border border-[#E7E3D4] p-3">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[#98A093]">
                  <Droplets className="h-3 w-3" />
                  Humidity
                </span>
                <span className="mt-1 block text-lg font-semibold tabular-nums text-[#14231B]">
                  {shipment.humidity}%
                </span>
              </div>
            </div>
          </div>

          {/* Live sensor trend */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
                Live Sensor Trend
              </span>
              <span className="text-[10px] text-[#C9D2CB]">
                critical {shipment.criticalTemp}°C
              </span>
            </div>
            <div className="mt-2 rounded-xl border border-[#E7E3D4] p-3">
              <TemperatureSparkline
                history={shipment.tempHistory}
                criticalTemp={shipment.criticalTemp}
                state={shipment.temperatureState}
              />
            </div>
          </div>

          {/* Route */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
              Route
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#14231B]">
              <MapPin className="h-3.5 w-3.5 text-[#98A093]" />
              {shipment.origin}
              <span className="text-[#C9D2CB]">→</span>
              {shipment.destination}
            </div>
            <div className="relative mt-2 h-1.5 w-full rounded-full bg-[#EEEADC]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[#1E8F55]"
                initial={{ width: 0 }}
                animate={{ width: `${shipment.progress}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-[#98A093]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ETA {shipment.eta}
              </span>
              <span>{shipment.progress}% of route</span>
            </div>
          </div>

          {/* AI risk */}
          <div className="flex items-center justify-between rounded-xl border border-[#E7E3D4] p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#98A093]">
              <Radio className="h-3.5 w-3.5" />
              AI Risk
            </span>
            <span className={`flex flex-col items-end gap-0.5 text-sm font-semibold ${risk.text}`}>
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${risk.dot} ${
                    shipment.aiRisk === "high" ? "animate-pulse" : ""
                  }`}
                />
                {risk.label.toUpperCase()}
              </span>
              {shipment.riskReason && (
                <span className="text-[11px] font-normal text-[#98A093]">
                  {shipment.riskReason}
                </span>
              )}
            </span>
          </div>

          {/* Recent event */}
          {latestEvent && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
                Recent Event
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-[#3E4A42]">
                {latestEvent.label}
                <span className="ml-1.5 text-xs text-[#98A093]">· {latestEvent.time}</span>
              </p>
            </div>
          )}

          {/* AI recommendation */}
          <div className="rounded-xl border border-[#CFE6D8] bg-[#E6F3EA] p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#1B4B33]">
              <Sparkles className="h-3.5 w-3.5 text-[#1E8F55]" />
              AI Recommendation
            </span>
            <p className="mt-1.5 text-sm leading-relaxed text-[#1B4B33]">
              {shipment.aiRecommendation}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
