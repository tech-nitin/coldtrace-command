import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Clock3,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

const predictions = [
  {
    time: "Now",
    risk: 42,
    level: "Moderate",
    color: "bg-amber-500",
  },
  {
    time: "+30 min",
    risk: 58,
    level: "Elevated",
    color: "bg-orange-500",
  },
  {
    time: "+1 hour",
    risk: 78,
    level: "High Risk",
    color: "bg-red-500",
  },
  {
    time: "+2 hours",
    risk: 91,
    level: "Critical",
    color: "bg-red-600",
  },
];

export function PredictiveRisk() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-violet-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Predictive Intelligence
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Where the risk is heading
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            AI predicts how shipment conditions may evolve based on current
            telemetry trends and historical behavior.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Prediction timeline */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Risk projection
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Next 2 hours
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-violet-500" />

                <span className="text-xs font-semibold text-violet-500">
                  Rising trend
                </span>
              </div>
            </div>

            {/* Risk line */}
            <div className="relative mb-10 hidden h-24 items-end justify-between px-6 sm:flex">
              <div className="absolute bottom-3 left-8 right-8 h-px bg-border" />

              {predictions.map((prediction, index) => (
                <div
                  key={prediction.time}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className="mb-3 rounded-full border-4 border-card shadow-md"
                    style={{
                      width: `${Math.max(prediction.risk, 16)}px`,
                      height: `${Math.max(prediction.risk, 16)}px`,
                    }}
                  >
                    <div
                      className={`h-full w-full rounded-full ${prediction.color}`}
                    />
                  </div>

                  <span className="text-xs font-semibold text-foreground">
                    {prediction.time}
                  </span>

                  {index < predictions.length - 1 && (
                    <ArrowRight className="absolute left-[calc(50%+35px)] top-8 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 sm:hidden">
              {predictions.map((prediction) => (
                <div
                  key={prediction.time}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {prediction.time}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {prediction.level}
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {prediction.risk}%
                  </span>
                </div>
              ))}
            </div>

            {/* Risk percentage cards */}
            <div className="grid gap-3 sm:grid-cols-4">
              {predictions.map((prediction) => (
                <div
                  key={prediction.time}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="text-xs text-muted-foreground">
                    {prediction.time}
                  </p>

                  <p className="mt-2 text-xl font-bold text-foreground">
                    {prediction.risk}%
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {prediction.level}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical prediction card */}
          <div className="flex flex-col rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                AI Forecast
              </p>

              <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground">
                Critical threshold may be reached within 1 hour.
              </h3>

              <p className="mt-4 leading-7 text-muted-foreground">
                If the current temperature trajectory continues, spoilage risk
                is predicted to reach a critical level.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/15 bg-background/60 p-4">
              <Clock3 className="h-5 w-5 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Estimated critical point
                </p>

                <p className="text-xs text-muted-foreground">
                  Approximately 1 hour from now
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <AlertTriangle className="h-4 w-4" />
              Take preventive action
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}