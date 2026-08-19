import { Brain, Sparkles } from "lucide-react";

export function AIInsightsHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-emerald-500/5" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
        <div className="max-w-3xl">
          {/* AI badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4" />
            AI-Powered Intelligence
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            See what the{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              data
            </span>
            <br />
            is trying to tell you.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            AI continuously analyzes shipment conditions, sensor behavior and
            operational patterns to identify risks before they become losses.
          </p>

          {/* AI status card */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  AI Engine Active
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Monitoring shipment intelligence
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Last analysis{" "}
              <span className="font-medium text-foreground">just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}