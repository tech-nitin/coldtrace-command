import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  ScanSearch,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  {
    id: 1,
    time: "Just now",
    title: "Risk prediction updated",
    description:
      "AI recalculated the spoilage probability using the latest telemetry.",
    icon: BrainCircuit,
    tone: "violet",
  },
  {
    id: 2,
    time: "2 min ago",
    title: "Temperature anomaly detected",
    description:
      "A sustained temperature rise was detected above the recommended range.",
    icon: AlertTriangle,
    tone: "warning",
  },
  {
    id: 3,
    time: "4 min ago",
    title: "Root cause confidence increased",
    description:
      "The cooling-system anomaly hypothesis is now supported by more signals.",
    icon: ScanSearch,
    tone: "blue",
  },
  {
    id: 4,
    time: "7 min ago",
    title: "Operator intervention recommended",
    description:
      "AI generated a prioritized action to verify the refrigeration unit.",
    icon: ShieldAlert,
    tone: "critical",
  },
  {
    id: 5,
    time: "12 min ago",
    title: "Telemetry quality verified",
    description:
      "Sensor readings are consistent and suitable for AI analysis.",
    icon: CheckCircle2,
    tone: "success",
  },
];

const toneStyles = {
  violet: {
    icon: "bg-violet-500/10 text-violet-500",
    line: "bg-violet-500",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    line: "bg-warning",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-500",
    line: "bg-blue-500",
  },
  critical: {
    icon: "bg-destructive/10 text-destructive",
    line: "bg-destructive",
  },
  success: {
    icon: "bg-success/10 text-success",
    line: "bg-success",
  },
};

export function AIActivity() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                AI Activity
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What the AI is doing
            </h2>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              A transparent timeline of the analysis, predictions and actions
              generated from your shipment telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            Live analysis
          </div>
        </div>

        {/* Activity timeline */}
        <div className="relative">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-border" />

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const style =
                toneStyles[
                  activity.tone as keyof typeof toneStyles
                ];

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="relative flex gap-5"
                >
                  {/* Timeline icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-violet-500/30">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3 className="font-semibold text-foreground">
                        {activity.title}
                      </h3>

                      <span className="text-xs font-medium text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}