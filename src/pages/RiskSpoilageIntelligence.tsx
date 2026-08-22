import React, { useEffect, useState } from "react";
import { motion, animate, useReducedMotion, Variants } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Wrench,
  Truck,
  IndianRupee,
  CheckCircle2,
  ChevronRight,
  Snowflake,
} from "lucide-react";

/* ============================================================================
 * DESIGN TOKENS
 * ----------------------------------------------------------------------------
 * These mirror the existing ChillChain AI dashboard: warm cream background,
 * deep forest green as the primary brand color, emerald/amber/red as the
 * semantic risk colors. If your project already exposes these as Tailwind
 * theme colors (e.g. `brand-forest`, `brand-cream`) or CSS variables, swap
 * the hex literals below for those tokens instead of duplicating them here.
 * ========================================================================= */
const token = {
  cream: "#FBF8F1",
  cardBorder: "#EAE4D6",
  forest: "#12332A",
  forestSoft: "#1E4B3A",
  ink: "#1C231E",
  sub: "#6E7568",
  emerald: "#1E9E63",
  emeraldSoft: "#E6F4EC",
  amber: "#E3A23C",
  amberSoft: "#FBF1DF",
  red: "#D6534A",
  redSoft: "#FBEBE9",
};

/* ============================================================================
 * TYPES
 * ========================================================================= */
type RiskStatus = "critical" | "warning" | "monitoring";
type RiskTrend = "increasing" | "decreasing" | "stable";

interface Shipment {
  id: string;
  product: string;
  route: string;
  risk: number;
  trend: RiskTrend;
  etaToCritical: string | null;
  status: RiskStatus;
}

interface RiskFactor {
  label: string;
  value: number;
}

interface InsightChip {
  label: string;
  value: string;
}

interface ShipmentInsight {
  headline: string;
  narrative: string;
  factors: RiskFactor[];
  factorNote: string;
  chips: InsightChip[];
  confidence: number;
}

/* ============================================================================
 * MOCK DATA
 * ========================================================================= */
const shipments: Shipment[] = [
  {
    id: "CC-2048",
    product: "Fresh Strawberries",
    route: "Indore \u2192 Delhi",
    risk: 82,
    trend: "increasing",
    etaToCritical: "1h 24m",
    status: "critical",
  },
  {
    id: "CC-1921",
    product: "Dairy Products",
    route: "Mumbai \u2192 Pune",
    risk: 68,
    trend: "increasing",
    etaToCritical: "3h 10m",
    status: "warning",
  },
  {
    id: "CC-2037",
    product: "Fresh Vegetables",
    route: "Bhopal \u2192 Indore",
    risk: 54,
    trend: "stable",
    etaToCritical: "6h 42m",
    status: "warning",
  },
  {
    id: "CC-1982",
    product: "Pharmaceuticals",
    route: "Delhi \u2192 Jaipur",
    risk: 31,
    trend: "stable",
    etaToCritical: null,
    status: "monitoring",
  },
];

const insights: Record<string, ShipmentInsight> = {
  "CC-2048": {
    headline: "Temperature excursion driving critical risk",
    narrative:
      "Shipment CC-2048 has remained above its recommended temperature range for 46 minutes. Because strawberries are highly sensitive to heat exposure, ChillChain AI predicts a rapid increase in spoilage probability if cooling is not restored.",
    factors: [
      { label: "Temperature Exposure", value: 92 },
      { label: "Humidity Deviation", value: 61 },
      { label: "Delay Duration", value: 48 },
      { label: "Product Sensitivity", value: 86 },
    ],
    factorNote:
      "Temperature excursions and product sensitivity are the primary contributors to current spoilage risk.",
    chips: [
      { label: "Temperature", value: "+4.2\u00B0C above safe range" },
      { label: "Exposure", value: "46 min outside range" },
      { label: "Product sensitivity", value: "High" },
    ],
    confidence: 94,
  },
  "CC-1921": {
    headline: "Humidity instability increasing condensation risk",
    narrative:
      "Shipment CC-1921 is experiencing unstable relative humidity, currently drifting \u00B18% outside its target band. Because dairy products are highly sensitive to condensation, ChillChain AI predicts a steady rise in spoilage risk if humidity is not stabilized.",
    factors: [
      { label: "Temperature Exposure", value: 55 },
      { label: "Humidity Deviation", value: 78 },
      { label: "Delay Duration", value: 40 },
      { label: "Product Sensitivity", value: 70 },
    ],
    factorNote:
      "Humidity deviation is the primary contributor, with product sensitivity compounding the risk.",
    chips: [
      { label: "Humidity", value: "\u00B18% RH deviation" },
      { label: "Exposure", value: "3h 10m outside range" },
      { label: "Product sensitivity", value: "High" },
    ],
    confidence: 88,
  },
  "CC-2037": {
    headline: "Minor delay, conditions within acceptable limits",
    narrative:
      "Shipment CC-2037 is showing a minor route delay, but temperature and humidity remain within acceptable limits. ChillChain AI is monitoring closely, as vegetables carry moderate sensitivity to prolonged transit time.",
    factors: [
      { label: "Temperature Exposure", value: 38 },
      { label: "Humidity Deviation", value: 45 },
      { label: "Delay Duration", value: 52 },
      { label: "Product Sensitivity", value: 58 },
    ],
    factorNote:
      "Delay duration is the leading factor; temperature and humidity remain stable.",
    chips: [
      { label: "Delay", value: "24 min behind schedule" },
      { label: "Exposure", value: "Within safe band" },
      { label: "Product sensitivity", value: "Moderate" },
    ],
    confidence: 81,
  },
  "CC-1982": {
    headline: "All parameters within safe operating range",
    narrative:
      "Shipment CC-1982 remains within all safe operating parameters. Pharmaceuticals require strict monitoring, so ChillChain AI continues tracking closely for any early deviation.",
    factors: [
      { label: "Temperature Exposure", value: 20 },
      { label: "Humidity Deviation", value: 18 },
      { label: "Delay Duration", value: 12 },
      { label: "Product Sensitivity", value: 35 },
    ],
    factorNote:
      "No factor currently exceeds a safe threshold. Sensitivity is monitored as a precaution.",
    chips: [
      { label: "Temperature", value: "Within safe range" },
      { label: "Humidity", value: "Stable" },
      { label: "Product sensitivity", value: "Low-moderate" },
    ],
    confidence: 97,
  },
};

/* ============================================================================
 * SHARED ANIMATION VARIANTS
 * ========================================================================= */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================================================
 * SMALL PRESENTATIONAL PRIMITIVES
 * ----------------------------------------------------------------------------
 * If ChillChain already has shared <Card>, <Badge>, <Button> primitives,
 * replace these with the real imports \u2014 the markup/classNames below assume
 * the same visual language (rounded-[24px] cards, thin borders, soft shadow).
 * ========================================================================= */
function StatusBadge({ status }: { status: RiskStatus }) {
  const map: Record<RiskStatus, { label: string; bg: string; fg: string }> = {
    critical: { label: "CRITICAL", bg: token.redSoft, fg: token.red },
    warning: { label: "WARNING", bg: token.amberSoft, fg: token.amber },
    monitoring: { label: "MONITORING", bg: token.emeraldSoft, fg: token.emerald },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em]"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

function TrendTag({ trend }: { trend: RiskTrend }) {
  if (trend === "increasing") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: token.red }}>
        <TrendingUp size={13} strokeWidth={2.4} /> Increasing
      </span>
    );
  }
  if (trend === "decreasing") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: token.emerald }}>
        <TrendingDown size={13} strokeWidth={2.4} /> Decreasing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: token.sub }}>
      <Minus size={13} strokeWidth={2.4} /> Stable
    </span>
  );
}

function riskColor(value: number) {
  if (value >= 70) return token.red;
  if (value >= 40) return token.amber;
  return token.emerald;
}

/* ---- animated count-up ---------------------------------------------------- */
function useCountUp(target: number, duration = 1.2, delay = 0) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

/* ---- circular AI risk gauge ------------------------------------------------ */
function RiskGauge({ value, size = 220 }: { value: number; size?: number }) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const animated = useCountUp(value, 1.4, 0.2);
  const color = riskColor(value);
  const label = value >= 70 ? "HIGH RISK" : value >= 40 ? "ELEVATED RISK" : "LOW RISK";
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}2E 0%, transparent 68%)` }}
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [0.94, 1.04, 0.94] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EDE7D9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[11px] font-semibold tracking-[0.18em]" style={{ color }}>
          {label}
        </span>
        <span
          className="mt-2 font-serif leading-none"
          style={{ color: token.forest, fontSize: 46 }}
        >
          {Math.round(animated)}
          <span className="ml-1 font-sans text-lg font-medium" style={{ color: token.sub }}>
            /100
          </span>
        </span>
      </div>
    </div>
  );
}

/* ---- floating metric pill (hero) ------------------------------------------ */
function FloatingMetric({
  icon,
  label,
  value,
  tone,
  className,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "emerald" | "amber" | "red" | "forest";
  className?: string;
  delay?: number;
}) {
  const toneColor = { emerald: token.emerald, amber: token.amber, red: token.red, forest: token.forest }[tone];
  return (
    <motion.div
      className={`hidden lg:flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_-12px_rgba(18,51,42,0.25)] ${className ?? ""}`}
      style={{ border: `1px solid ${token.cardBorder}` }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 + delay }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex items-center gap-2.5"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${toneColor}1A`, color: toneColor }}
        >
          {icon}
        </span>
        <span className="whitespace-nowrap">
          <span className="block text-sm font-semibold" style={{ color: token.ink }}>
            {value}
          </span>
          <span className="block text-[11px]" style={{ color: token.sub }}>
            {label}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ---- animated horizontal factor bar ---------------------------------------- */
function FactorBar({ label, value }: RiskFactor) {
  const color = riskColor(value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span style={{ color: token.ink }} className="font-medium">
          {label}
        </span>
        <span className="font-serif" style={{ color: token.forest }}>
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#EDE7D9" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ---- forecast line chart (decorative, matches the reference style) -------- */
function ForecastChart({ etaLabel }: { etaLabel: string }) {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto">
      {/* safe zone */}
      <rect x={0} y={170} width={640} height={90} fill={token.emeraldSoft} opacity={0.7} />
      {/* warning threshold */}
      <line x1={0} y1={120} x2={640} y2={120} stroke={token.amber} strokeDasharray="4 5" strokeWidth={1.4} />
      <text x={8} y={112} fontSize={11} fill={token.amber} fontFamily="sans-serif">
        Warning threshold
      </text>
      {/* critical threshold */}
      <line x1={0} y1={72} x2={640} y2={72} stroke={token.red} strokeDasharray="4 5" strokeWidth={1.4} />
      <text x={8} y={64} fontSize={11} fill={token.red} fontFamily="sans-serif">
        Critical threshold
      </text>

      {/* historical (solid) */}
      <motion.path
        d="M0,182 C60,176 100,180 150,168 C190,158 210,150 236,140"
        fill="none"
        stroke={token.forestSoft}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* forecast (rising toward critical) */}
      <motion.path
        d="M236,140 C300,120 340,100 390,84 C440,66 500,50 560,40 C585,35 605,32 630,28"
        fill="none"
        stroke={token.red}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="1 0"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* current marker */}
      <line x1={236} y1={20} x2={236} y2={240} stroke={token.forest} strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
      <motion.circle
        cx={236}
        cy={140}
        r={5}
        fill={token.forest}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.3 }}
      />
      <text x={236} y={252} fontSize={11} textAnchor="middle" fill={token.forest} fontFamily="sans-serif" fontWeight={600}>
        Current
      </text>

      {/* predicted critical point */}
      <motion.circle
        cx={460}
        cy={72}
        r={5.5}
        fill={token.red}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.35 }}
      />
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        <rect x={370} y={12} width={220} height={30} rx={15} fill={token.red} />
        <text x={480} y={31} fontSize={11.5} fontWeight={600} textAnchor="middle" fill="#fff" fontFamily="sans-serif">
          Critical risk predicted in {etaLabel}
        </text>
      </motion.g>
    </svg>
  );
}

/* ============================================================================
 * PAGE
 * ========================================================================= */
export default function RiskSpoilageIntelligence() {
  const [selectedId, setSelectedId] = useState<string>(shipments[0].id);
  const selected = shipments.find((s) => s.id === selectedId) ?? shipments[0];
  const insight = insights[selectedId];

  const forecastNow = selected.risk;
  const forecast1h = Math.min(99, selected.risk + 12);
  const forecast2h = Math.min(99, selected.risk + 19);

  const now1h = useCountUp(forecast1h, 1, 0.15);
  const now2h = useCountUp(forecast2h, 1, 0.3);
  const nowCurrent = useCountUp(forecastNow, 1, 0);

  return (
    <div style={{ backgroundColor: token.cream }} className="w-full">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-10">
        {/* =====================================================================
         * SECTION 1 \u2014 HERO / RISK OVERVIEW
         * ================================================================== */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
        >
          <div>
            <motion.div
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em]"
              style={{ backgroundColor: token.emeraldSoft, color: token.emerald }}
            >
              <Sparkles size={13} strokeWidth={2.4} />
              AI RISK INTELLIGENCE
            </motion.div>

            <motion.h1
              variants={rise}
              className="mt-5 font-serif text-[38px] leading-[1.1] sm:text-[46px] lg:text-[50px]"
              style={{ color: token.forest }}
            >
              See the risk <span style={{ color: token.emerald }}>before the product spoils.</span>
            </motion.h1>

            <motion.p variants={rise} className="mt-5 max-w-[480px] text-[15.5px] leading-relaxed" style={{ color: token.sub }}>
              ChillChain AI continuously analyzes temperature, humidity, route exposure and product sensitivity to
              detect spoilage risk before inventory is lost.
            </motion.p>

            <motion.div variants={rise} className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "Active Shipments", value: "24" },
                { label: "At Risk", value: "5" },
                { label: "Critical", value: "2" },
                { label: "Predicted Loss", value: "\u20B918,500" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="font-serif text-2xl" style={{ color: token.forest }}>
                    {m.value}
                  </div>
                  <div className="mt-1 text-[11.5px]" style={{ color: token.sub }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={rise} className="relative mx-auto flex h-[380px] w-full max-w-[420px] items-center justify-center">
            <RiskGauge value={72} />

            <FloatingMetric
              icon={<IndianRupee size={15} strokeWidth={2.2} />}
              label="Estimated Loss"
              value="\u20B918,500"
              tone="red"
              className="absolute -left-6 top-2"
              delay={0}
            />
            <FloatingMetric
              icon={<AlertTriangle size={15} strokeWidth={2.2} />}
              label="Critical Shipments"
              value="2"
              tone="forest"
              className="absolute -right-4 top-16"
              delay={0.4}
            />
            <FloatingMetric
              icon={<TrendingUp size={15} strokeWidth={2.2} />}
              label="Risk Trend"
              value="+23%"
              tone="amber"
              className="absolute -left-3 bottom-10"
              delay={0.8}
            />
            <FloatingMetric
              icon={<ShieldCheck size={15} strokeWidth={2.2} />}
              label="Confidence"
              value="84%"
              tone="emerald"
              className="absolute -right-6 bottom-0"
              delay={1.2}
            />

            {/* mobile fallback: compact metric grid instead of floating pills */}
            <div className="absolute -bottom-24 grid w-full grid-cols-2 gap-3 lg:hidden">
              {[
                { label: "Estimated Loss", value: "\u20B918,500" },
                { label: "Critical Shipments", value: "2" },
                { label: "Risk Trend", value: "+23%" },
                { label: "Confidence", value: "84%" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white px-3.5 py-2.5"
                  style={{ border: `1px solid ${token.cardBorder}` }}
                >
                  <div className="text-sm font-semibold" style={{ color: token.ink }}>
                    {m.value}
                  </div>
                  <div className="text-[11px]" style={{ color: token.sub }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* spacer for mobile floating-metric fallback */}
        <div className="h-24 lg:hidden" />

        {/* =====================================================================
         * SECTION 2 \u2014 HIGH-RISK SHIPMENTS
         * ================================================================== */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="mt-28"
        >
          <motion.h2 variants={rise} className="font-serif text-[28px] sm:text-[32px]" style={{ color: token.forest }}>
            Shipments that need attention.
          </motion.h2>
          <motion.p variants={rise} className="mt-2 max-w-[560px] text-[14.5px] leading-relaxed" style={{ color: token.sub }}>
            Prioritized by AI according to current spoilage probability and estimated inventory impact.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-8 overflow-hidden rounded-[26px] bg-white"
            style={{ border: `1px solid ${token.cardBorder}` }}
          >
            {/* header row \u2014 desktop only */}
            <div
              className="hidden grid-cols-[1.1fr_1.3fr_1.2fr_0.9fr_1fr_1fr_0.9fr] gap-4 px-6 py-3 text-[11px] font-semibold tracking-[0.06em] lg:grid"
              style={{ color: token.sub, borderBottom: `1px solid ${token.cardBorder}` }}
            >
              <span>SHIPMENT</span>
              <span>PRODUCT</span>
              <span>ROUTE</span>
              <span>RISK</span>
              <span>TREND</span>
              <span>TIME TO CRITICAL</span>
              <span>STATUS</span>
            </div>

            {shipments.map((s, i) => {
              const isSelected = s.id === selectedId;
              const isCritical = s.status === "critical";
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  variants={rise}
                  whileHover={{ y: -2 }}
                  className="grid w-full grid-cols-2 gap-x-4 gap-y-2 px-6 py-5 text-left transition-colors lg:grid-cols-[1.1fr_1.3fr_1.2fr_0.9fr_1fr_1fr_0.9fr] lg:items-center lg:gap-4"
                  style={{
                    borderBottom: i === shipments.length - 1 ? "none" : `1px solid ${token.cardBorder}`,
                    backgroundColor: isSelected ? (isCritical ? "#FDF3F2" : token.emeraldSoft) : isCritical ? "#FEFBFA" : "transparent",
                  }}
                >
                  <span className="font-mono text-[13px] font-semibold" style={{ color: token.forest }}>
                    {s.id}
                  </span>
                  <span className="text-sm font-medium" style={{ color: token.ink }}>
                    {s.product}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px]" style={{ color: token.sub }}>
                    <Truck size={13} strokeWidth={2.2} />
                    {s.route}
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: riskColor(s.risk) }}>
                      {s.risk}%
                    </span>
                    <span className="hidden h-1.5 w-14 overflow-hidden rounded-full sm:inline-block" style={{ backgroundColor: "#EDE7D9" }}>
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ backgroundColor: riskColor(s.risk) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.risk}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </span>
                  </span>

                  <TrendTag trend={s.trend} />

                  <span className="text-[13px]" style={{ color: token.ink }}>
                    {s.etaToCritical ?? "\u2014"}
                  </span>

                  <span className="flex items-center justify-between gap-2">
                    <StatusBadge status={s.status} />
                    <ChevronRight size={16} style={{ color: token.sub }} className="hidden lg:block" />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.section>

        {/* =====================================================================
         * SECTION 3 \u2014 WHY IS THE RISK INCREASING?
         * ================================================================== */}
        <motion.section
          key={`why-${selectedId}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="mt-24"
        >
          <motion.div
            variants={rise}
            className="grid grid-cols-1 gap-0 overflow-hidden rounded-[28px] bg-white lg:grid-cols-2"
            style={{ border: `1px solid ${token.cardBorder}` }}
          >
            {/* left: risk breakdown */}
            <div className="p-8 sm:p-10" style={{ borderRight: `1px solid ${token.cardBorder}` }}>
              <div className="text-[11px] font-semibold tracking-[0.14em]" style={{ color: token.sub }}>
                {selected.id} \u00B7 AI RISK BREAKDOWN
              </div>
              <h3 className="mt-2 font-serif text-2xl" style={{ color: token.forest }}>
                Why is the risk increasing?
              </h3>

              <div className="mt-7 space-y-5">
                {insight.factors.map((f) => (
                  <FactorBar key={f.label} {...f} />
                ))}
              </div>

              <p className="mt-7 text-[13.5px] leading-relaxed" style={{ color: token.sub }}>
                {insight.factorNote}
              </p>
            </div>

            {/* right: AI explanation */}
            <div className="relative overflow-hidden p-8 sm:p-10" style={{ backgroundColor: token.forest }}>
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(120deg, transparent 30%, ${token.emerald}22 45%, transparent 60%)`,
                }}
                animate={{ backgroundPositionX: ["-30%", "130%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.1em]" style={{ backgroundColor: "#FFFFFF14", color: "#EAF3EC" }}>
                  <Sparkles size={12} strokeWidth={2.4} />
                  AI EXPLANATION
                </div>

                <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "#F3F0E6" }}>
                  {insight.narrative}
                </p>

                <div className="mt-7 space-y-2.5">
                  {insight.chips.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px]"
                      style={{ backgroundColor: "#FFFFFF0F", color: "#F3F0E6" }}
                    >
                      <span className="opacity-70">{c.label}</span>
                      <span className="font-medium">{c.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: "#C9D6CD" }}>
                    AI Confidence
                  </span>
                  <span className="font-serif text-lg" style={{ color: "#FFFFFF" }}>
                    {insight.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* =====================================================================
         * SECTION 4 \u2014 SPOILAGE FORECAST
         * ================================================================== */}
        <motion.section
          key={`forecast-${selectedId}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="mt-24"
        >
          <motion.h2 variants={rise} className="font-serif text-[28px] sm:text-[32px]" style={{ color: token.forest }}>
            How the risk may evolve.
          </motion.h2>

          <motion.div variants={rise} className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[26px] bg-white p-6 sm:p-8" style={{ border: `1px solid ${token.cardBorder}` }}>
              <ForecastChart etaLabel={selected.etaToCritical ?? "the next few hours"} />
            </div>

            <div className="flex flex-col justify-between rounded-[26px] p-7 sm:p-8" style={{ backgroundColor: token.forest }}>
              <div className="space-y-6">
                {[
                  { label: "CURRENT RISK", value: nowCurrent },
                  { label: "IN 1 HOUR", value: now1h },
                  { label: "IN 2 HOURS", value: now2h },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between">
                    <span className="text-[11.5px] font-semibold tracking-[0.1em]" style={{ color: "#C9D6CD" }}>
                      {row.label}
                    </span>
                    <span className="font-serif text-2xl" style={{ color: "#FFFFFF" }}>
                      {Math.round(row.value)}
                      <span className="ml-1 text-sm font-sans" style={{ color: "#C9D6CD" }}>
                        /100
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6" style={{ borderColor: "#FFFFFF1F" }}>
                <div className="text-[11px] font-semibold tracking-[0.1em]" style={{ color: "#C9D6CD" }}>
                  PREDICTED OUTCOME
                </div>
                <div className="mt-1.5 text-[14.5px] font-medium" style={{ color: "#FFFFFF" }}>
                  High probability of quality degradation
                </div>
                <div className="mt-4 text-[12px]" style={{ color: "#9FB3A6" }}>
                  AI confidence: {insight.confidence}%
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* =====================================================================
         * SECTION 5 \u2014 RECOMMENDED ACTION
         * ================================================================== */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="mt-24 mb-4"
        >
          <motion.div
            variants={rise}
            className="grid grid-cols-1 gap-10 overflow-hidden rounded-[28px] p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:gap-8"
            style={{ backgroundColor: token.forest }}
          >
            <div>
              <div className="text-[11px] font-semibold tracking-[0.14em]" style={{ color: "#9FB3A6" }}>
                RECOMMENDED ACTION \u00B7 {selected.id}
              </div>
              <h2 className="mt-2 font-serif text-[26px] leading-tight sm:text-[30px]" style={{ color: "#FFFFFF" }}>
                Act now to protect this shipment.
              </h2>

              <div className="mt-7 space-y-5">
                {[
                  {
                    icon: <Snowflake size={17} strokeWidth={2.2} />,
                    title: "Restore cooling immediately",
                    body: "Lower the container temperature below 4\u00B0C.",
                  },
                  {
                    icon: <Wrench size={17} strokeWidth={2.2} />,
                    title: "Inspect refrigeration system",
                    body: "Current sensor data suggests possible cooling inefficiency.",
                  },
                  {
                    icon: <Truck size={17} strokeWidth={2.2} />,
                    title: "Prioritize delivery",
                    body: "Reduce remaining transit exposure where possible.",
                  },
                ].map((a) => (
                  <div key={a.title} className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#FFFFFF14", color: "#EAF3EC" }}
                    >
                      {a.icon}
                    </span>
                    <div>
                      <div className="text-[14.5px] font-semibold" style={{ color: "#FFFFFF" }}>
                        {a.title}
                      </div>
                      <div className="mt-0.5 text-[13.5px] leading-relaxed" style={{ color: "#C9D6CD" }}>
                        {a.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[22px] p-6 sm:p-7" style={{ backgroundColor: "#FFFFFF0D", border: "1px solid #FFFFFF1A" }}>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em]" style={{ color: "#9FB3A6" }}>
                  <CheckCircle2 size={13} strokeWidth={2.4} />
                  ESTIMATED LOSS AVOIDED
                </div>
                <div className="mt-2 font-serif text-4xl" style={{ color: token.emerald }}>
                  \u20B914,800
                </div>
                <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#C9D6CD" }}>
                  If the recommended actions are taken before the predicted critical point.
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ backgroundColor: token.emerald, color: "#FFFFFF" }}
              >
                View Full Shipment Analysis
                <ArrowRight size={15} strokeWidth={2.4} />
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
