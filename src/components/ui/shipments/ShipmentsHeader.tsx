import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface ShipmentsHeaderProps {
  activeCount: number;
  lastSyncedSecondsAgo: number;
}

export function ShipmentsHeader({
  activeCount,
  lastSyncedSecondsAgo,
}: ShipmentsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2E9E68]">
          Shipment Operations
        </span>
        <h1 className="mt-3 max-w-xl text-[32px] font-semibold leading-[1.15] tracking-tight text-[#122A1F] sm:text-[40px]">
          Every shipment. One source of truth.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#647065]">
          Monitor cargo health, route progress and AI risk across your
          active cold-chain shipments.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="flex items-baseline gap-2">
          <AnimatedCounter
            value={activeCount}
            className="text-3xl font-semibold tabular-nums text-[#122A1F]"
          />
          <span className="text-sm font-medium text-[#647065]">
            Active Shipments
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-[#E4E1D4] bg-white px-3 py-1 text-xs font-medium text-[#1E3D2C]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2E9E68] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2E9E68]" />
            </span>
            Live
          </span>

          <span className="flex items-center gap-1.5 text-xs text-[#8A9186]">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex"
            >
              <RefreshCw className="h-3 w-3" />
            </motion.span>
            Synced {lastSyncedSecondsAgo}s ago
          </span>
        </div>
      </div>
    </motion.div>
  );
}
