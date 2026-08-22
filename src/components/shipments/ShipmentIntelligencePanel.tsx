import { Shipment } from "../../types/shipment";

interface PanelProps {
  shipment: Shipment | null;
}

export function ShipmentIntelligencePanel({ shipment }: PanelProps) {
  // Guard against null selections or delayed async state loads
  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E7E3D4] bg-white p-8 text-center text-stone-400 min-h-[300px]">
        <p className="text-sm">Select a shipment to inspect live telemetry and AI guidance.</p>
      </div>
    );
  }

  // Safe numerical extractions
  const temp = (shipment.currentTemp ?? 0).toFixed(1);
  const humidity = (shipment.currentHumidity ?? 0).toFixed(0);
  const health = shipment.health ?? 100;

  return (
    <div className="rounded-3xl border border-[#E7E3D4] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-emerald-800 uppercase">
            • AI Analysis Live
          </span>
          <h3 className="mt-1 font-mono text-xl font-bold text-stone-900">
            {shipment.id}
          </h3>
          <p className="text-xs text-stone-500">{shipment.cargoType}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            shipment.status === "critical"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : shipment.status === "at-risk"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {shipment.status}
        </span>
      </div>

      {/* Health Score Metric */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/30">
          <span className="font-mono text-2xl font-bold text-stone-800">{health}</span>
        </div>
        <span className="mt-2 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
          Shipment Health
        </span>
      </div>

      {/* Live Conditions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-stone-100 bg-stone-50/50 p-3.5">
          <span className="text-[10px] font-medium text-stone-400 uppercase">Temperature</span>
          <p className="mt-1 font-mono text-lg font-bold text-stone-800">{temp}°C</p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-stone-50/50 p-3.5">
          <span className="text-[10px] font-medium text-stone-400 uppercase">Humidity</span>
          <p className="mt-1 font-mono text-lg font-bold text-stone-800">{humidity}%</p>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
        <span className="text-[11px] font-semibold text-emerald-900">AI RECOMMENDATION</span>
        <p className="mt-1 text-xs leading-relaxed text-emerald-800">
          {shipment.aiRecommendation || "Conditions optimal. Monitor standard route updates."}
        </p>
      </div>
    </div>
  );
}