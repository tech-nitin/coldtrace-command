import { Sparkles } from "lucide-react";

import type { AIInsight } from "@/types/aiInsights";
import { InsightCard } from "./InsightCard";

interface InsightFeedProps {
  insights: AIInsight[];
}

export function InsightFeed({
  insights,
}: InsightFeedProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

            <h2 className="text-xl font-semibold">
              AI Insight Feed
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest intelligence generated from live shipment telemetry.
          </p>
        </div>

        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {insights.length} insights
        </span>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <p className="font-medium">
            No insights available
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The AI engine is waiting for more telemetry data.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
            />
          ))}
        </div>
      )}
    </section>
  );
}