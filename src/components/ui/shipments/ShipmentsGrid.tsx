import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { Shipment, ViewMode } from "../../types/shipment";
import { ShipmentCard } from "./ShipmentCard";

interface ShipmentsGridProps {
  shipments: Shipment[];
  view: ViewMode;
  onSelect: (shipment: Shipment) => void;
}

export function ShipmentsGrid({ shipments, view, onSelect }: ShipmentsGridProps) {
  if (shipments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#E4E1D4] bg-white/60 py-20 text-center"
      >
        <PackageSearch className="h-8 w-8 text-[#C9D2CB]" />
        <p className="text-sm font-medium text-[#5B6B60]">
          No shipments match your search or filters.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-3"
      }
    >
      <AnimatePresence mode="popLayout">
        {shipments.map((shipment, index) => (
          <motion.div
            key={shipment.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.04,
            }}
          >
            <ShipmentCard shipment={shipment} view={view} onSelect={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
