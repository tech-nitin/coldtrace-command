import { motion } from "framer-motion";
import { SummaryMetric } from "../../types/shipment";
import { AnimatedCounter } from "./AnimatedCounter";

const toneDot: Record<SummaryMetric["tone"], string> = {
  neutral: "bg-[#33604A]",
  green: "bg-[#2E9E68]",
  amber: "bg-[#C68A2E]",
  red: "bg-[#C1443A]",
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function SummaryStrip({ metrics }: { metrics: SummaryMetric[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.key}
          variants={item}
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-[#E4E1D4] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(18,42,31,0.04)] transition-shadow hover:shadow-[0_8px_20px_rgba(18,42,31,0.06)]"
        >
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${toneDot[metric.tone]}`} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A9186]">
              {metric.label}
            </span>
          </div>
          <AnimatedCounter
            value={metric.value}
            className="mt-2 block text-[26px] font-semibold tabular-nums text-[#122A1F]"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
