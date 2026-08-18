import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { Shipment, ViewMode } from "../../types/shipment";
import { ShipmentRow } from "./ShipmentRow";

interface ShipmentsListProps {
  shipments: Shipment[];
  view: ViewMode;
  selectedId: string | null;
  onSelect: (shipment: Shipment) => void;
}

export function ShipmentsList({ shipments, view, selectedId, onSelect }: ShipmentsListProps) {
  if (shipments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#E7E3D4] bg-[#FCFBF6] py-16 text-center"
      >
        <PackageSearch className="h-7 w-7 text-[#C9D2CB]" />
        <p className="text-sm font-medium text-[#6B7568]">
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
          ? "grid grid-cols-1 gap-2.5 lg:grid-cols-2"
          : "flex flex-col gap-2"
      }
    >
      <AnimatePresence mode="popLayout">
        {shipments.map((shipment, index) => (
          <motion.div
            key={shipment.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.035,
            }}
          >
            <ShipmentRow
              shipment={shipment}
              view={view}
              isSelected={shipment.id === selectedId}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
