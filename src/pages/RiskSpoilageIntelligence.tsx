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

function StatusBadge({ status }: { status: RiskStatus }) {
  const map: Record<RiskStatus, { label: string; bg: string; fg: string }> = {
    critical: { label: "CRITICAL", bg: token.redSoft, fg: token.red },
    warning: { label: "WARNING", bg: token.amberSoft, fg: token.amber },
    monitoring: { label: "MONITORING", bg: token.emeraldSoft, fg: token.emerald },
  };
  const s = map[status] || map.monitoring;
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
  }, [target, duration, delay, reduceMotion]);

  return value;
}

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

function ForecastChart({ etaLabel }: { etaLabel: string }) {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto">
      <rect x={0} y={170} width={640} height={90} fill={token.emeraldSoft} opacity={0.7} />
      <line x1={0} y1={120} x2={640} y2={120} stroke={token.amber} strokeDasharray="4 5" strokeWidth={1.4} />
      <text x={8} y={112} fontSize={11} fill={token.amber} fontFamily="sans-serif">
        Warning threshold
      </text>
      <line x1={0} y1={72} x2={640} y2={72} stroke={token.red} strokeDasharray="4 5" strokeWidth={1.4} />
      <text x={8} y={64} fontSize={11} fill={token.red} fontFamily="sans-serif">
        Critical threshold
      </text>

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

function ForecastRiskBox({ forecastNow }: { forecastNow: number }) {
  const forecast1h = Math.min(99, forecastNow + 9);
  const forecast2h = Math.min(99, forecastNow + 17);

  const nowCurrent = useCountUp(forecastNow, 1, 0);
  const now1h = useCountUp(forecast1h, 1, 0.15);
  const now2h = useCountUp(forecast2h, 1, 0.3);

  return (
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
      </div>
    </div>
  );
}

export default function RiskSpoilageIntelligence() {
  const [apiData, setApiData] = useState<any>(null);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [actionData, setActionData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>("");

  // 1. Main polling loop for dashboard telemetry
  useEffect(() => {
    const fetchRiskData = () => {
      fetch("http://localhost:5000/api/v1/analytics/risk-spoilage")
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setApiData(res.data);
            if (res.data.attentionShipments?.length > 0 && !selectedId) {
              setSelectedId(res.data.attentionShipments[0].id);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching live risk metrics:", err);
          setLoading(false);
        });
    };

    fetchRiskData();
    const interval = setInterval(fetchRiskData, 5000);
    return () => clearInterval(interval);
  }, [selectedId]);

  // 2. Fetch specific breakdown data dynamically whenever selectedId changes
  useEffect(() => {
    if (!selectedId) return;

    fetch(`http://localhost:5000/api/v1/analytics/risk-breakdown/${selectedId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setBreakdownData(res.data);
        }
      })
      .catch((err) => console.error("Error fetching shipment breakdown:", err));
  }, [selectedId]);

  // 3. Fetch Gemini AI actions dynamically whenever selectedId changes
  useEffect(() => {
    if (!selectedId) return;

    setActionLoading(true);
    setActionData(null);

    fetch(`http://localhost:5000/api/v1/analytics/recommended-actions/${selectedId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setActionData(res.data);
        }
        setActionLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Gemini AI actions:", err);
        setActionLoading(false);
      });
  }, [selectedId]);

  if (loading) {
    return (
      <div style={{ backgroundColor: token.cream }} className="min-h-screen w-full flex items-center justify-center">
        <p className="font-serif text-lg text-emerald-900">Loading live telemetry and risk intelligence...</p>
      </div>
    );
  }

  const summary = apiData?.summary || {};
  const shipmentsList: Shipment[] = (apiData?.attentionShipments || []).map((s: any) => ({
    id: s.id,
    product: s.product,
    route: s.route,
    risk: s.riskScore,
    trend: (s.trend || "stable").toLowerCase() as RiskTrend,
    etaToCritical: s.timeToCritical === "N/A" ? null : s.timeToCritical,
    status: (s.status || "monitoring").toLowerCase() as RiskStatus,
  }));

  const fallbackShipment: Shipment = {
    id: "CC-0000",
    product: "No Active Shipments",
    route: "N/A",
    risk: 0,
    trend: "stable",
    etaToCritical: null,
    status: "monitoring",
  };

  const selected = shipmentsList.find((s) => s.id === selectedId) || shipmentsList[0] || fallbackShipment;

  const insight: ShipmentInsight = {
    headline: breakdownData?.aiExplanation?.text || "Analyzing parameters...",
    narrative: breakdownData?.aiExplanation?.text || "Analyzing parameters...",
    factors: (breakdownData?.factors || []).map((f: any) => ({
      label: f.name,
      value: f.percentage,
    })),
    factorNote: "Temperature excursions and product sensitivity are the primary contributors to current spoilage risk.",
    chips: [
      { label: "Temperature", value: breakdownData?.aiExplanation?.temperatureDelta || "Nominal" },
      { label: "Product sensitivity", value: "High" },
    ],
    confidence: breakdownData?.aiExplanation?.aiConfidence || 94,
  };

  return (
    <div style={{ backgroundColor: token.cream }} className="w-full">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-10">
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
                { label: "Active Shipments", value: summary.activeShipments ?? 0 },
                { label: "At Risk", value: summary.atRisk ?? 0 },
                { label: "Critical", value: summary.critical ?? 0 },
                { label: "Predicted Loss", value: `₹${(summary.predictedLoss ?? 0).toLocaleString()}` },
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
            <RiskGauge value={summary.riskScore ?? 72} />

            <FloatingMetric
              icon={<IndianRupee size={15} strokeWidth={2.2} />}
              label="Estimated Loss"
              value={`₹${(summary.predictedLoss ?? 18500).toLocaleString()}`}
              tone="red"
              className="absolute -left-6 top-2"
              delay={0}
            />
            <FloatingMetric
              icon={<AlertTriangle size={15} strokeWidth={2.2} />}
              label="Critical Shipments"
              value={String(summary.critical ?? 0)}
              tone="forest"
              className="absolute -right-4 top-16"
              delay={0.4}
            />
            <FloatingMetric
              icon={<TrendingUp size={15} strokeWidth={2.2} />}
              label="Risk Trend"
              value={`+${summary.riskTrendPercent ?? 23}%`}
              tone="amber"
              className="absolute -left-3 bottom-10"
              delay={0.8}
            />
            <FloatingMetric
              icon={<ShieldCheck size={15} strokeWidth={2.2} />}
              label="Confidence"
              value={`${summary.confidence ?? 84}%`}
              tone="emerald"
              className="absolute -right-6 bottom-0"
              delay={1.2}
            />
          </motion.div>
        </motion.section>

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

            {shipmentsList.map((s, i) => {
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
                    borderBottom: i === shipmentsList.length - 1 ? "none" : `1px solid ${token.cardBorder}`,
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
                  </span>

                  <TrendTag trend={s.trend} />

                  <span className="text-[13px]" style={{ color: token.ink }}>
                    {s.etaToCritical ?? "—"}
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

        {selected && (
          <motion.section
            key={`why-${selected.id}`}
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
              <div className="p-8 sm:p-10" style={{ borderRight: `1px solid ${token.cardBorder}` }}>
                <div className="text-[11px] font-semibold tracking-[0.14em]" style={{ color: token.sub }}>
                  {selected.id} · AI RISK BREAKDOWN
                </div>
                <h3 className="mt-2 font-serif text-2xl" style={{ color: token.forest }}>
                  Why is the risk increasing?
                </h3>

                <div className="mt-7 space-y-5">
                  {insight.factors.map((f) => (
                    <FactorBar key={f.label} {...f} />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden p-8 sm:p-10" style={{ backgroundColor: token.forest }}>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.1em]" style={{ backgroundColor: "#FFFFFF14", color: "#EAF3EC" }}>
                    <Sparkles size={12} strokeWidth={2.4} />
                    AI EXPLANATION
                  </div>

                  <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "#F3F0E6" }}>
                    {insight.narrative}
                  </p>

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
        )}

        {selected && (
          <motion.section
            key={`forecast-${selected.id}`}
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

              <ForecastRiskBox forecastNow={selected?.risk || 50} />
            </motion.div>
          </motion.section>
        )}

        {selected && (
          <motion.section
            key={`action-${selected.id}`}
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
                  RECOMMENDED ACTION · {selected.id}
                </div>
                <h2 className="mt-2 font-serif text-[26px] leading-tight sm:text-[30px]" style={{ color: "#FFFFFF" }}>
                  Act now to protect this shipment.
                </h2>

                <div className="mt-7 space-y-5">
                  {actionLoading ? (
                    <p className="text-sm text-emerald-200 animate-pulse">
                      Generating AI action plan for {selected.id}...
                    </p>
                  ) : (
                    (actionData?.actions || [
                      { title: "Restore cooling immediately", description: "Lower container temperature below safe threshold." },
                      { title: "Inspect refrigeration system", description: "Verify cooling unit functionality and insulation seal." },
                      { title: "Prioritize delivery", description: "Expedite dispatch to reduce remaining exposure time." }
                    ]).map((a: any, idx: number) => {
                      const icons = [
                        <Snowflake size={17} strokeWidth={2.2} />,
                        <Wrench size={17} strokeWidth={2.2} />,
                        <Truck size={17} strokeWidth={2.2} />
                      ];
                      return (
                        <div key={a.title || idx} className="flex items-start gap-4">
                          <span
                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: "#FFFFFF14", color: "#EAF3EC" }}
                          >
                            {icons[idx % 3]}
                          </span>
                          <div>
                            <div className="text-[14.5px] font-semibold" style={{ color: "#FFFFFF" }}>
                              {a.title}
                            </div>
                            <div className="mt-0.5 text-[13.5px] leading-relaxed" style={{ color: "#C9D6CD" }}>
                              {a.description || a.body || "Follow standard cold-chain operating procedures."}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[22px] p-6 sm:p-7" style={{ backgroundColor: "#FFFFFF0D", border: "1px solid #FFFFFF1A" }}>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em]" style={{ color: "#9FB3A6" }}>
                    <CheckCircle2 size={13} strokeWidth={2.4} />
                    ESTIMATED LOSS AVOIDED
                  </div>
                  <div className="mt-2 font-serif text-4xl" style={{ color: token.emerald }}>
                    {actionLoading ? (
                      <span className="text-2xl animate-pulse">Calculating...</span>
                    ) : (
                      `₹${Number(actionData?.estimatedLossAvoided ?? 14800).toLocaleString('en-IN')}`
                    )}
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
        )}
      </div>
    </div>
  );
}