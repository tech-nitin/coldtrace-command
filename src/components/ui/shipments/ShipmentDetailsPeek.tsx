import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Shipment } from "../../types/shipment";
import { riskConfig, statusConfig } from "./statusStyles";

interface ShipmentDetailsPeekProps {
  shipment: Shipment | null;
  onClose: () => void;
}

/**
 * Lightweight "peek" shown on card click. This intentionally stays minimal —
 * swap the body for <ShipmentDetailsPage shipmentId={shipment.id} /> (or
 * navigate(`/shipments/${shipment.id}`) if using a router) once the full
 * details page exists.
 */
export function ShipmentDetailsPeek({ shipment, onClose }: ShipmentDetailsPeekProps) {
  return (
    <AnimatePresence>
      {shipment && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#122A1F]/30 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-t-2xl border border-[#E4E1D4] bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A9186]">
                  Shipment
                </span>
                <h3 className="mt-1 text-lg font-semibold text-[#122A1F]">
                  {shipment.id}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#9AA79F] transition-colors hover:bg-[#EFEEE6] hover:text-[#1E3D2C]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusConfig[shipment.status].bg} ${statusConfig[shipment.status].text}`}
              >
                {statusConfig[shipment.status].label}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskConfig[shipment.aiRisk].text} bg-[#F7F5EC]`}
              >
                AI Risk: {riskConfig[shipment.aiRisk].label}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#647065]">
              {shipment.cargoType} moving from {shipment.origin} to{" "}
              {shipment.destination}. Full sensor history, route map and
              AI risk timeline will live on the dedicated Shipment Details
              page.
            </p>

            <button
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1E3D2C] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#122A1F]"
              onClick={onClose}
            >
              Open full details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
