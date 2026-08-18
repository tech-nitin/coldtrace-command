import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface ShipmentsHeaderProps {
  activeCount: number;
  lastSyncedSecondsAgo: number;
  systemHealthy: boolean;
}

export function ShipmentsHeader({
  activeCount,
  lastSyncedSecondsAgo,
  systemHealthy,
}: ShipmentsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE7DE] bg-white px-3 py-1"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E8F55] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1E8F55]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1E8F55]">
            Live Shipment Operations
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl text-[34px] font-semibold leading-[1.1] tracking-tight text-[#14231B] sm:text-[44px]"
        >
          Every shipment.
          <br />
          <span className="text-[#1E8F55]">One source of truth.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B7568]"
        >
          Monitor cargo health, route progress, sensor conditions and AI
          risk across your active cold-chain shipments.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-3 md:items-end"
      >
        <div className="flex items-baseline gap-2">
          <AnimatedCounter
            value={activeCount}
            className="text-3xl font-semibold tabular-nums text-[#14231B]"
          />
          <span className="text-sm font-medium text-[#6B7568]">
            Active Shipments
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              systemHealthy
                ? "border-[#DCE7DE] bg-white text-[#1B4B33]"
                : "border-[#F0DEB8] bg-[#FBF0DC] text-[#8A5A16]"
            }`}
          >
            <ShieldCheck className="h-3 w-3" />
            {systemHealthy ? "All sensors online" : "1 sensor needs attention"}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-[#98A093]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9BA79E] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#9BA79E]" />
            </span>
            Synced {lastSyncedSecondsAgo}s ago
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
