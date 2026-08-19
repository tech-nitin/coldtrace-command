import {
  CheckCircle2,
  Clock3,
  Gauge,
  MapPin,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wrench,
} from "lucide-react";

const actions = [
  {
    icon: Thermometer,
    title: "Reduce temperature immediately",
    description:
      "Bring the shipment temperature back below the 8°C safe threshold.",
    priority: "Immediate",
    priorityClass: "text-red-500 bg-red-500/10",
    iconClass: "text-red-500 bg-red-500/10",
  },
  {
    icon: Wrench,
    title: "Inspect the cooling system",
    description:
      "Verify compressor performance and refrigeration efficiency.",
    priority: "High",
    priorityClass: "text-orange-500 bg-orange-500/10",
    iconClass: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: MapPin,
    title: "Consider rerouting the shipment",
    description:
      "Use the nearest cold-storage hub if conditions continue to worsen.",
    priority: "Recommended",
    priorityClass: "text-violet-500 bg-violet-500/10",
    iconClass: "text-violet-500 bg-violet-500/10",
  },
];

export function AIRecommendation() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Recommended Action
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What should happen next?
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Based on the current risk prediction and detected root causes,
            these actions can help reduce potential shipment loss.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Recommended actions */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Recommended response plan
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Ordered by urgency and expected impact
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-4">
              {actions.map((action, index) => {
                const Icon = action.icon;

                return (
                  <div
                    key={action.title}
                    className="group flex gap-4 rounded-2xl border border-border bg-background p-5 transition-all hover:border-foreground/20"
                  >
                    {/* Step number */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-foreground">
                          {action.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${action.priorityClass}`}
                        >
                          {action.priority}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Start response plan
              </button>

              <button
                type="button"
                className="flex-1 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Assign to operator
              </button>
            </div>
          </div>

          {/* AI impact forecast */}
          <div className="flex flex-col rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Gauge className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
              Expected Impact
            </p>

            <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground">
              Early action could significantly reduce shipment risk.
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              If corrective action is taken within the next 20 minutes, the AI
              estimates that the current risk score could return to a safer
              range.
            </p>

            {/* Stats */}
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-emerald-500/10 bg-background/70 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-emerald-500" />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Response window
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Within the next 20 minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-background/70 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Estimated risk reduction
                    </p>

                    <p className="text-xs text-muted-foreground">
                      From 78% to approximately 35%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div className="mt-auto pt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Recommendation confidence</span>
                <span className="font-semibold text-foreground">91%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full w-[91%] rounded-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}