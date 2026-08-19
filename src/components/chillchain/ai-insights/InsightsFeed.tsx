import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock3,
  Info,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Temperature rising faster than expected",
    description:
      "The last 18 minutes show a sustained upward temperature trend. Current conditions are moving toward the critical threshold.",
    tag: "Temperature",
    time: "2 min ago",
    tone: "warning",
  },
  {
    icon: Activity,
    title: "Cooling system behavior changed",
    description:
      "Sensor data suggests the refrigeration system is cycling less effectively than its recent operating pattern.",
    tag: "System anomaly",
    time: "6 min ago",
    tone: "danger",
  },
  {
    icon: TrendingDown,
    title: "Shipment risk increased by 23%",
    description:
      "Risk prediction increased after combining temperature trajectory, excursion duration and destination arrival time.",
    tag: "Risk prediction",
    time: "11 min ago",
    tone: "info",
  },
];

const toneStyles = {
  warning: {
    icon: "bg-amber-500/10 text-amber-500",
    tag: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  danger: {
    icon: "bg-red-500/10 text-red-500",
    tag: "bg-red-500/10 text-red-500",
  },
  info: {
    icon: "bg-violet-500/10 text-violet-500",
    tag: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
};

export function InsightFeed() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                AI Analysis Feed
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What the AI is seeing
            </h2>

            <p className="mt-2 max-w-xl text-muted-foreground">
              Important patterns detected from live telemetry and shipment
              behavior.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-70"
          >
            View all insights
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Feed */}
        <div className="grid gap-4 lg:grid-cols-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            const styles = toneStyles[insight.tone];

            return (
              <article
                key={insight.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${styles.tag}`}
                  >
                    {insight.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold leading-snug text-foreground">
                  {insight.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {insight.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {insight.time}
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground"
                  >
                    Explain
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* AI monitoring status */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Info className="h-4 w-4" />
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              AI monitoring continuously.
            </span>{" "}
            New insights are generated automatically as shipment conditions
            change.
          </p>
        </div>
      </div>
    </section>
  );
}