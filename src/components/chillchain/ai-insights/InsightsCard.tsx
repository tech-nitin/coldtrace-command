import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
} from "lucide-react";

import type { AIInsight } from "@/types/aiInsights";

interface InsightCardProps {
  insight: AIInsight;
}

const severityStyles = {
  low: {
    label: "Low",
    icon: Info,
    className:
      "border-blue-500/20 bg-blue-500/5 text-blue-600",
  },
  medium: {
    label: "Medium",
    icon: TrendingUp,
    className:
      "border-amber-500/20 bg-amber-500/5 text-amber-600",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    className:
      "border-orange-500/20 bg-orange-500/5 text-orange-600",
  },
  critical: {
    label: "Critical",
    icon: AlertTriangle,
    className:
      "border-red-500/20 bg-red-500/5 text-red-600",
  },
};

export function InsightCard({
  insight,
}: InsightCardProps) {
  const style = severityStyles[insight.severity];
  const Icon = style.icon;

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {style.label} risk
        </div>

        <span className="text-xs text-muted-foreground">
          {insight.timestamp}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold">
        {insight.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {insight.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          Shipment{" "}
          <span className="font-medium text-foreground">
            {insight.shipmentId}
          </span>
        </span>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          {insight.confidence}% confidence
        </div>
      </div>
    </article>
  );
}