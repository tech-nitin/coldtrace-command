import React, { useEffect, useState } from "react";
import { motion, useAnimation, easeOut, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Clock,
  Wrench,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Radio,
  BrainCircuit,
} from "lucide-react";

/**
 * ChillChain AI — "AI Risk Assessment"
 * -----------------------------------------------------------------------
 * A compact, live-feeling dashboard section that reads as a real-time
 * intelligence pipeline rather than a static summary card:
 *
 *   LIVE SENSOR DATA  →  AI ANALYSIS  →  RISK DETECTION  →  ACTION
 *   (signal cards)       (radial gauge)   (severity + score)  (recommendation)
 *
 * Self-contained: no external design system, no backend calls. Mock data
 * only — wire the marked values up to your live feed / inference output.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Mock data — replace with live values.
// ---------------------------------------------------------------------------

const RISK_SCORE = 72; // 0–100
const AI_CONFIDENCE = 94; // %

const RISK_SIGNALS = [
  {
    id: "temperature",
    label: "Temperature",
    value: "+32% drift",
    detail: "3.4°C above threshold",
    icon: Thermometer,
    tone: "critical" as const,
  },
  {
    id: "humidity",
    label: "Humidity",
    value: "Unstable",
    detail: "Fluctuating ±8% RH",
    icon: Droplets,
    tone: "warning" as const,
  },
  {
    id: "route",
    label: "Route Delay",
    value: "+24 min",
    detail: "Behind scheduled ETA",
    icon: Clock,
    tone: "warning" as const,
  },
];

// ---------------------------------------------------------------------------
// Tone tokens — keep in sync with the rest of the ChillChain theme.
// ---------------------------------------------------------------------------

const toneStyles = {
  critical: {
    text: "text-[#B3382C]",
    bg: "bg-[#FBEAE7]",
    solid: "#C1443C",
    border: "border-[#F0CFC8]",
    glow: "rgba(193,68,60,0.20)",
  },
  warning: {
    text: "text-[#9A6B12]",
    bg: "bg-[#FBF1DD]",
    solid: "#D98E2A",
    border: "border-[#F0DFB6]",
    glow: "rgba(217,142,42,0.20)",
  },
  safe: {
    text: "text-[#1F7A4D]",
    bg: "bg-[#E4F0E6]",
    solid: "#1F7A4D",
    border: "border-[#CFE6D5]",
    glow: "rgba(31,122,77,0.20)",
  },
};

function riskLabel(score: number): { label: string; tone: "critical" | "warning" | "safe" } {
  if (score >= 70) return { label: "HIGH RISK", tone: "critical" };
  if (score >= 40) return { label: "MODERATE RISK", tone: "warning" };
  return { label: "LOW RISK", tone: "safe" };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useCountUp(target: number, durationMs = 1400, startDelayMs = 150) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const timeout = setTimeout(() => {
      const tick = (t: number) => {
        if (start === null) start = t;
        const progress = Math.min((t - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelayMs);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs, startDelayMs]);

  return value;
}

// Ticks up a "Xs ago" style live timestamp label.
function useLiveTimestamp() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (seconds < 3) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds}s ago`;
  return `Updated ${Math.floor(seconds / 60)}m ago`;
}

// Cycles through the pipeline labels to imply an active analysis loop.
function useAnalysisStatus() {
  const stages = [
    "Reading live sensor data",
    "Analyzing risk patterns",
    "Cross-checking route telemetry",
    "Refreshing recommendation",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % stages.length);
    }, 2600);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stages[index];
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function LiveDot({ color = "#1F7A4D", size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
        animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeOut" }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

// Thin animated dashed connector implying data flow between pipeline stages.
function FlowConnector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative hidden w-10 flex-shrink-0 items-center justify-center lg:flex">
      <div className="h-px w-full border-t border-dashed border-[#D8D0BC]" />
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-[#1F7A4D]"
        animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay }}
        style={{ top: "50%", translateY: "-50%" }}
      />
      <ChevronRight className="absolute right-[-6px] h-3.5 w-3.5 text-[#C9BE9E]" strokeWidth={2.5} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radial risk gauge with ambient glow
// ---------------------------------------------------------------------------

function RiskGauge({ score }: { score: number }) {
  const size = 148;
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedScore = useCountUp(score);
  const offset = circumference - (animatedScore / 100) * circumference;
  const { tone } = riskLabel(score);
  const styles = toneStyles[tone];

  return (
    <div className="relative flex h-[148px] w-[148px] items-center justify-center">
      {/* ambient pulsing glow behind the gauge */}
      <motion.div
        className="absolute inset-[-14px] rounded-full blur-xl"
        style={{ backgroundColor: styles.glow }}
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          className="stroke-[#E7E1D4]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          stroke={styles.solid}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: easeOut, delay: 0.2 }}
        />
        {/* leading-edge dot to sell "live" motion at the gauge tip */}
        <motion.circle
          r={stroke / 2.4}
          fill={styles.solid}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            cx: size / 2 + radius * Math.cos((animatedScore / 100) * 2 * Math.PI),
            cy: size / 2 + radius * Math.sin((animatedScore / 100) * 2 * Math.PI),
          }}
          transition={{ duration: 1.5, ease: easeOut, delay: 0.2 }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-[2.3rem] leading-none tracking-tight text-[#14231B]">
          {animatedScore}
        </span>
        <span className="mt-1 text-[11px] font-medium tracking-wide text-[#6B6355]">/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AIRiskAssessment() {
  const controls = useAnimation();
  const confidence = useCountUp(AI_CONFIDENCE, 1300, 500);
  const { label: scoreLabel, tone: scoreTone } = riskLabel(RISK_SCORE);
  const scoreStyles = toneStyles[scoreTone];
  const timestamp = useLiveTimestamp();
  const analysisStatus = useAnalysisStatus();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <section className="w-full bg-[#FAF7F0] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DED5BE] bg-white/60 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#1F7A4D]" strokeWidth={2.25} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B4A3F]">
                AI-Powered Insight
              </span>
            </div>
            <h2 className="font-serif text-3xl leading-tight tracking-tight text-[#14231B] sm:text-4xl">
              Know the risk before the loss.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5B5548]">
              AI continuously analyzes live sensor signals to detect emerging
              shipment risks before they become costly losses.
            </p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-[#E7E1D4] bg-white/80 shadow-[0_2px_8px_rgba(20,35,27,0.04),0_16px_40px_-24px_rgba(20,35,27,0.18)] backdrop-blur-sm"
        >
          {/* Top strip: live status + analyzing ticker + timestamp */}
          <div className="flex flex-col gap-2 border-b border-[#EFEADD] bg-[#F7F4EA]/80 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2">
              <LiveDot />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B4A3F]">
                AI Analysis Live
              </span>
              <span className="mx-1 hidden h-3 w-px bg-[#DED5BE] sm:inline-block" />
              <BrainCircuit className="hidden h-3.5 w-3.5 text-[#8A8371] sm:inline" strokeWidth={2} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={analysisStatus}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                  className="hidden text-[11.5px] italic text-[#8A8371] sm:inline"
                >
                  {analysisStatus}…
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8371]">
              <Radio className="h-3 w-3" strokeWidth={2.25} />
              Shipment&nbsp;#CC-4471 · {timestamp}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-4 py-7 sm:px-6 lg:flex-row lg:items-stretch lg:gap-0 lg:px-8">
            {/* STAGE 1 — Live sensor signals (IoT data in) */}
            <div className="flex flex-1 flex-col justify-center gap-3 py-3 lg:py-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8371]">
                Live Sensor Signals
              </span>
              <div className="flex flex-col gap-2.5">
                {RISK_SIGNALS.map((signal, i) => {
                  const styles = toneStyles[signal.tone];
                  const Icon = signal.icon;
                  return (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.2 + i * 0.12, ease: easeOut }}
                      whileHover={{ y: -3, boxShadow: `0 10px 24px -12px ${styles.glow}` }}
                      className={`flex items-center justify-between rounded-2xl border ${styles.border} ${styles.bg} px-4 py-3 transition-colors duration-200`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
                          <Icon className={`h-3.5 w-3.5 ${styles.text}`} strokeWidth={2.25} />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[13.5px] font-medium leading-tight text-[#2A342B]">
                            {signal.label}
                          </span>
                          <span className="text-[11px] leading-tight text-[#8A8371]">
                            {signal.detail}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-semibold ${styles.text}`}>
                          {signal.value}
                        </span>
                        <LiveDot color={styles.solid} size={6} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <FlowConnector delay={0} />

            {/* STAGE 2 — AI risk score (analysis + detection) */}
            <div className="flex flex-col items-center justify-center gap-3 border-y border-[#EFEADD] py-6 lg:w-[220px] lg:flex-shrink-0 lg:border-x lg:border-y-0 lg:px-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8371]">
                AI Risk Score
              </span>
              <RiskGauge score={RISK_SCORE} />
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] ${scoreStyles.bg} ${scoreStyles.text}`}
              >
                {scoreLabel}
              </span>
            </div>

            <FlowConnector delay={1.1} />

            {/* STAGE 3 — Recommended action */}
            <div className="flex flex-1 flex-col justify-center gap-4 py-3 lg:py-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8371]">
                Recommended Action
              </span>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35, ease: easeOut }}
                whileHover={{ y: -2 }}
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(31,122,77,0.0)",
                    "0 0 24px 3px rgba(31,122,77,0.14)",
                    "0 0 0px 0px rgba(31,122,77,0.0)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative overflow-hidden rounded-2xl border border-[#CFE6D5] bg-gradient-to-br from-[#EEF5EF] to-[#E7F1E9] p-4"
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#1F7A4D]" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F7A4D]">
                    AI Suggested
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1F7A4D]/10">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#1F7A4D]/15"
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <Wrench className="relative h-4 w-4 text-[#1F7A4D]" strokeWidth={2.25} />
                  </span>
                  <span className="text-[14.5px] font-semibold leading-snug text-[#14231B]">
                    Inspect cooling system
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-[#5B5548]">
                  Temperature trend indicates increasing spoilage risk.
                </p>
              </motion.div>

              {/* Confidence bar */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11.5px] font-medium text-[#6B6355]">AI Confidence</span>
                  <span className="text-[12.5px] font-semibold text-[#14231B]">{confidence}%</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#EFEADD]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${AI_CONFIDENCE}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, ease: easeOut, delay: 0.45 }}
                    className="relative h-full overflow-hidden rounded-full bg-[#1F7A4D]"
                  >
                    <motion.div
                      className="absolute inset-y-0 w-8 bg-white/35"
                      animate={{ left: ["-20%", "120%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                    />
                  </motion.div>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ x: 2, boxShadow: "0 10px 24px -10px rgba(20,35,27,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="group mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#14231B] px-4 py-2.5 text-[13px] font-semibold text-[#FAF7F0] transition-colors duration-200 hover:bg-[#1F7A4D]"
              >
                View AI Insights
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
