import {
  BrainCircuit,
  CheckCircle2,
  Database,
  ShieldCheck,
  Thermometer,
  TrendingUp,
} from "lucide-react";

const signals = [
  {
    icon: Thermometer,
    label: "Temperature trend",
    confidence: 98,
    description: "Strong and consistent upward trajectory detected.",
  },
  {
    icon: TrendingUp,
    label: "Historical patterns",
    confidence: 91,
    description: "Current behavior matches previous high-risk excursions.",
  },
  {
    icon: Database,
    label: "Sensor consistency",
    confidence: 94,
    description: "Telemetry readings show stable and reliable sensor data.",
  },
];

export function ConfidenceSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Prediction Confidence
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How confident is the AI?
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            The prediction confidence is calculated from live sensor quality,
            detected patterns and consistency across multiple signals.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Main confidence score */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/[0.03] p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <BrainCircuit className="h-7 w-7" />
            </div>

            {/* Circular score */}
            <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-violet-500/20">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-background">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">94%</p>

                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Confidence
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mt-8 text-xl font-bold text-foreground">
              High confidence prediction
            </h3>

            <p className="mt-2 max-w-sm text-center text-sm leading-6 text-muted-foreground">
              The available telemetry strongly supports the current risk
              prediction.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              Multiple signals agree
            </div>
          </div>

          {/* Signal confidence */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6">
              <p className="font-semibold text-foreground">
                Confidence by signal
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The strongest data signals supporting this prediction.
              </p>
            </div>

            <div className="space-y-5">
              {signals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-border bg-background p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-semibold text-foreground">
                            {signal.label}
                          </h3>

                          <span className="text-sm font-bold text-foreground">
                            {signal.confidence}%
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {signal.description}
                        </p>

                        {/* Progress bar */}
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${signal.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                <div>
                  <p className="font-semibold text-foreground">
                    Data quality is good
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    No major sensor inconsistencies were detected in the
                    current telemetry stream.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}