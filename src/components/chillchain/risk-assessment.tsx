<<<<<<< Updated upstream:src/components/chillchain/risk-assessment.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Clock, Gauge, HeartPulse, Sparkles, Wrench } from "lucide-react";
import { AI_ASSESSMENT } from "@/lib/ChillChain-data";
=======
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
>>>>>>> Stashed changes:src/components/coldtrace/risk-assessment.tsx
import { Counter, Reveal, Section } from "./primitives";

const ROUTE_RISK_DATA = {
  distance: 522,
  eta: "8.0h",
  riskScore: 78,
  riskLevel: "HIGH RISK",
  hazards: [
    {
      id: "thermal-peak",
      title: "Thermal Peak Warning",
      location: "Segment 2 (Midway Transit)",
      description:
        "Ambient temp predicted to reach 38°C. Reefer compressor load will increase by 34%.",
    },
    {
      id: "traffic-delay",
      title: "Traffic Delay Anomaly",
      location: "Highway Checkpoint B",
      description:
        "Predicted 35 min congestion bottleneck. Potential cold storage battery drain.",
    },
  ],
  actions: [
    "Pre-cool cargo bay to -2°C prior to departure.",
    "Schedule secondary cooling cycle at Checkpoint B.",
    "Reroute via Western Corridor to avoid thermal congestion.",
  ],
};

export function RiskAssessment() {
  return (
    <Section id="route-risk">
      <Reveal>
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-emerald-900/40 bg-[#03150f] p-6 text-emerald-100 shadow-2xl sm:p-7">
          {/* Header */}
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-lime-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                AI Route Risk Model
              </h2>
            </div>
            <span className="rounded-full border border-emerald-700/40 bg-emerald-950/60 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400">
              IHAT3 PREDICTOR
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 mb-7">
            {/* Distance & ETA */}
            <div className="rounded-2xl border border-emerald-800/30 bg-[#072118] p-4.5">
              <p className="text-[11px] font-medium text-emerald-400/80">
                Distance & ETA
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">
                  {ROUTE_RISK_DATA.distance} <span className="text-base font-normal">km</span>
                </span>
                <span className="text-base font-semibold text-emerald-400 font-mono">
                  ({ROUTE_RISK_DATA.eta})
                </span>
              </div>
            </div>

            {/* Predicted Risk Score */}
            <div className="rounded-2xl border border-rose-900/40 bg-[#1f0b11] p-4.5">
              <p className="text-[11px] font-medium text-rose-300/80">
                Predicted Risk Score
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-rose-500 font-mono">
                  <Counter to={ROUTE_RISK_DATA.riskScore} suffix="%" />
                </span>
                <span className="rounded-md bg-rose-950/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-400 border border-rose-800/40">
                  {ROUTE_RISK_DATA.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Route Hazards */}
          <div className="mb-7">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90">
              Predicted Route Hazards
            </h3>
            <div className="space-y-3">
              {ROUTE_RISK_DATA.hazards.map((hazard) => (
                <div
                  key={hazard.id}
                  className="rounded-2xl border border-emerald-800/30 bg-[#062017] p-4 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{hazard.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-500/80">
                      {hazard.location}
                    </span>
                  </div>
                  <p className="text-emerald-200/70 leading-relaxed font-sans text-[12px]">
                    {hazard.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Driver Actions */}
          <div className="mb-7">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90">
              Recommended Driver Actions
            </h3>
            <div className="space-y-2.5">
              {ROUTE_RISK_DATA.actions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-emerald-800/30 bg-[#062017] px-4 py-3 text-xs text-emerald-100 font-sans"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recalculate Action */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 py-3.5 text-xs font-bold text-slate-950 transition-colors hover:bg-lime-300"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Recalculate Route Telemetry</span>
          </motion.button>
        </div>
      </Reveal>
    </Section>
  );
}