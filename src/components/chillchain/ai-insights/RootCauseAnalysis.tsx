import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Thermometer,
  Wind,
} from "lucide-react";

const causes = [
  {
    icon: Thermometer,
    title: "Sustained temperature increase",
    description:
      "Temperature increased from 5.2°C to 8.6°C and remained above the expected operating range.",
    impact: 92,
    level: "Primary cause",
    iconClass: "bg-red-500/10 text-red-500",
    barClass: "bg-red-500",
  },
  {
    icon: Wind,
    title: "Reduced cooling efficiency",
    description:
      "The cooling pattern is weaker than the shipment's normal historical behavior.",
    impact: 78,
    level: "Contributing factor",
    iconClass: "bg-orange-500/10 text-orange-500",
    barClass: "bg-orange-500",
  },
  {
    icon: Activity,
    title: "Extended exposure duration",
    description:
      "The shipment has spent an increasing amount of time outside its preferred temperature range.",
    impact: 64,
    level: "Contributing factor",
    iconClass: "bg-amber-500/10 text-amber-500",
    barClass: "bg-amber-500",
  },
];

export function RootCauseAnalysis() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-violet-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Explainable AI
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why is the risk increasing?
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            The AI analyzed multiple telemetry signals and identified the
            strongest factors contributing to the current risk prediction.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Causes */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Risk contributing factors
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Ranked by estimated impact
                </p>
              </div>

              <div className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-500">
                3 key factors
              </div>
            </div>

            <div className="space-y-4">
              {causes.map((cause, index) => {
                const Icon = cause.icon;

                return (
                  <div
                    key={cause.title}
                    className="rounded-2xl border border-border bg-background p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cause.iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cause.title}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {cause.level}
                            </p>
                          </div>

                          <span className="text-lg font-bold text-foreground">
                            {cause.impact}%
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {cause.description}
                        </p>

                        {/* Impact bar */}
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Estimated impact</span>
                            <span>{cause.impact}%</span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${cause.barClass}`}
                              style={{ width: `${cause.impact}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI conclusion */}
          <div className="flex flex-col rounded-3xl border border-violet-500/20 bg-violet-500/[0.03] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <BrainCircuit className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              AI Conclusion
            </p>

            <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground">
              The temperature trajectory is the strongest risk signal.
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              The prediction is primarily driven by sustained temperature
              growth, with reduced cooling efficiency increasing the likelihood
              of further deterioration.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                <p className="text-sm text-muted-foreground">
                  High confidence in detected temperature pattern.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                <p className="text-sm text-muted-foreground">
                  Pattern matches previous high-risk excursions.
                </p>
              </div>

              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                <p className="text-sm text-muted-foreground">
                  Cooling system behavior should be investigated.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-auto pt-8"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                View model explanation
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}