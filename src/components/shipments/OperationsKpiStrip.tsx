import { motion } from "framer-motion";
import { SummaryMetric } from "../../types/shipment";
import { AnimatedCounter } from "./AnimatedCounter";

const toneUnderline: Record<SummaryMetric["tone"], string> = {
  neutral: "bg-[#33604A]",
  green: "bg-[#1E8F55]",
  amber: "bg-[#C1852B]",
  red: "bg-[#C0473C]",
};

const toneTrendText: Record<SummaryMetric["trendTone"], string> = {
  up: "text-[#1E8F55]",
  down: "text-[#C1852B]",
  flat: "text-[#98A093]",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

interface OperationsKpiStripProps {
  metrics: SummaryMetric[];
  selectedKey: SummaryMetric["key"] | null;
  onSelect: (metric: SummaryMetric) => void;
}

export function OperationsKpiStrip({
  metrics,
  selectedKey,
  onSelect,
}: OperationsKpiStripProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 divide-y divide-[#EEEADC] rounded-2xl border border-[#E7E3D4] bg-white sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:grid-cols-5"
    >
      {metrics.map((metric) => {
        const isSelected = selectedKey === metric.key;
        const isUrgent = metric.key === "critical" || metric.key === "at-risk";

        return (
          <motion.button
            key={metric.key}
            variants={item}
            onClick={() => onSelect(metric)}
            whileHover={{ backgroundColor: "#FBFAF4" }}
            className={`group relative px-5 py-5 text-left transition-colors ${
              isSelected ? "bg-[#FBFAF4]" : ""
            }`}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A093]">
              {isUrgent && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${toneUnderline[metric.tone]} ${
                    metric.key === "critical" ? "animate-pulse" : ""
                  }`}
                />
              )}
              {metric.label}
            </span>

            <div className="mt-1.5 flex items-end justify-between gap-2">
              <AnimatedCounter
                value={metric.value}
                className="block text-[26px] font-semibold tabular-nums text-[#14231B]"
              />
              <span className={`mb-1 text-[11px] font-medium ${toneTrendText[metric.trendTone]}`}>
                {metric.trendLabel}
              </span>
            </div>

            <span
              className={`mt-2 block h-[3px] w-7 rounded-full transition-all duration-300 ${
                toneUnderline[metric.tone]
              } ${isSelected ? "w-10 opacity-100" : "opacity-70 group-hover:w-9"}`}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
