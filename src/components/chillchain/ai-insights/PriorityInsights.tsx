import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  MapPin,
  Thermometer,
} from "lucide-react";

export function PriorityInsight() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Highest Priority
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Priority Insight
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Clock3 className="h-4 w-4" />
            Updated just now
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-3xl border border-red-500/20 bg-card shadow-sm">
          {/* Alert header */}
          <div className="border-b border-red-500/15 bg-red-500/[0.04] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500">
                      High Risk
                    </span>

                    <span className="text-sm text-muted-foreground">
                      Shipment CHL-001
                    </span>
                  </div>

                  <h3 className="max-w-2xl text-xl font-bold leading-tight text-foreground sm:text-2xl">
                    Temperature trend indicates an elevated spoilage risk.
                  </h3>

                  <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                    AI detected a sustained temperature increase that could
                    impact product quality if the current trend continues.
                  </p>
                </div>
              </div>

              {/* Risk score */}
              <div className="shrink-0 rounded-2xl border border-border bg-background p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Risk Score
                </p>

                <p className="mt-1 text-3xl font-bold text-red-500">
                  78%
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <InsightDetail
              icon={<Thermometer className="h-5 w-5" />}
              label="Temperature"
              value="8.6°C"
              description="Target range: 2–8°C"
              color="text-red-500"
            />

            <InsightDetail
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value="Indore Transit Hub"
              description="En route to destination"
              color="text-emerald-500"
            />

            <InsightDetail
              icon={<BrainCircuit className="h-5 w-5" />}
              label="AI Confidence"
              value="94%"
              description="Based on sensor trend analysis"
              color="text-violet-500"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-border bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-sm text-muted-foreground">
              Recommended action:
              <span className="ml-1 font-medium text-foreground">
                Inspect refrigeration system immediately.
              </span>
            </p>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              View supporting data
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InsightDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: string;
}

function InsightDetail({
  icon,
  label,
  value,
  description,
  color,
}: InsightDetailProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className={`mb-4 ${color}`}>{icon}</div>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}