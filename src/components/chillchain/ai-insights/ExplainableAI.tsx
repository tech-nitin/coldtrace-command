import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  CircleHelp,
  Database,
  Eye,
  ShieldCheck,
  Thermometer,
  TrendingUp,
} from "lucide-react";

const reasons = [
  {
    title: "Temperature is rising",
    description:
      "Recent telemetry shows a sustained upward temperature trend approaching the critical threshold.",
    impact: "High impact",
    value: "42%",
    icon: Thermometer,
  },
  {
    title: "Risk trend is accelerating",
    description:
      "The AI risk score has increased consistently across the latest monitoring window.",
    impact: "Medium impact",
    value: "31%",
    icon: TrendingUp,
  },
  {
    title: "Historical pattern match",
    description:
      "Current shipment behavior matches patterns observed during previous cold-chain excursions.",
    impact: "Medium impact",
    value: "18%",
    icon: Database,
  },
  {
    title: "Sensor confidence is strong",
    description:
      "The telemetry is internally consistent, increasing confidence in the prediction.",
    impact: "Supporting signal",
    value: "9%",
    icon: ShieldCheck,
  },
];

export function ExplainableAI() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-violet-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Explainable AI
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why did the AI make this prediction?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            ChillChain does not provide a prediction without context. Every
            risk assessment is broken into the signals and patterns that
            contributed to the AI decision.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* AI explanation summary */}
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/[0.03] p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <BrainCircuit className="h-7 w-7" />
            </div>

            <h3 className="mt-7 text-2xl font-bold text-foreground">
              Primary AI conclusion
            </h3>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              The shipment has entered an increasing risk state because
              temperature is rising faster than expected and is showing a
              pattern associated with refrigeration failure.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-background/70 p-5">
              <div className="flex items-start gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />

                <div>
                  <p className="font-semibold text-foreground">
                    What this means
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The prediction is not based on a single temperature value.
                    Multiple telemetry signals are combined to estimate the
                    probability of a cold-chain failure.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Prediction is supported by live telemetry
            </div>
          </div>

          {/* Feature importance */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  Signal contribution
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Relative importance of each factor in the prediction.
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-5">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;

                return (
                  <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-border bg-background p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {reason.title}
                            </h4>

                            <p className="mt-1 text-xs font-medium text-violet-500">
                              {reason.impact}
                            </p>
                          </div>

                          <span className="text-lg font-bold text-foreground">
                            {reason.value}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {reason.description}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: reason.value }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.1,
                            }}
                            className="h-full rounded-full bg-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transparency footer */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Built for transparent decisions
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Operators can inspect the signals behind every AI prediction
                  instead of treating the system as a black box.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full border border-success/20 bg-success/5 px-4 py-2 text-xs font-semibold text-success">
                Explainability enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}