import { Shipment } from "../../types/shipment";

interface ShipmentRowProps {
  shipment: Shipment;
  isSelected: boolean;
  onSelect: (shipment: Shipment) => void;
}

export function ShipmentRow({ shipment, isSelected, onSelect }: ShipmentRowProps) {
  // Safe numerical fallbacks prevent .toFixed() runtime crashes
  const temp = typeof shipment?.currentTemp === "number" ? shipment.currentTemp : 0;
  const humidity = typeof shipment?.currentHumidity === "number" ? shipment.currentHumidity : 0;
  const health = shipment?.health ?? 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "at-risk":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div
      onClick={() => onSelect(shipment)}
      className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
        isSelected
          ? "border-emerald-600 bg-emerald-50/20 shadow-sm"
          : "border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50/50"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-stone-900">
              {shipment.id}
            </span>
            <span className="text-xs text-stone-400">• {shipment.cargoType}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
            <span>{shipment.origin}</span>
            <span>→</span>
            <span>{shipment.destination}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="flex items-center justify-end gap-3 font-mono text-xs font-medium">
            <span className={temp > 25 ? "text-rose-600 font-semibold" : "text-stone-700"}>
              {temp.toFixed(1)}°C
            </span>
            <span className="text-stone-500">{humidity.toFixed(0)}% RH</span>
            <span className="text-emerald-700 font-medium">Health {health}</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            ETA {shipment.eta || "N/A"}
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${getStatusBadge(
            shipment.status
          )}`}
        >
          {shipment.status}
        </span>
      </div>
    </div>
  );
}