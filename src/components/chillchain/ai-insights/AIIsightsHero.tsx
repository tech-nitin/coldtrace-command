import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Activity } from "lucide-react";

export function AIInsightsHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>AI Intelligence Engine</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              AI Insights
            </h1>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Real-time cold-chain intelligence, predictive risk analysis,
              and actionable recommendations powered by your sensor data.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  AI Status
                </p>
                <p className="text-sm font-semibold">
                  Intelligence Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <div className="relative flex h-9 w-9 items-center justify-center">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500 opacity-40" />
                <span className="relative h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Live Monitoring
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  Processing Data
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}