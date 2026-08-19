import { createFileRoute } from "@tanstack/react-router";

import { AIInsightsHero } from "@/components/chillchain/ai-insights/AIInsightsHero";

import { PredictiveRisk } from "@/components/chillchain/ai-insights/PredictiveRisk";
import { RootCauseAnalysis } from "@/components/chillchain/ai-insights/RootCauseAnalysis";
import { AIRecommendation } from "@/components/chillchain/ai-insights/AIRecommendation";
import { ConfidenceSection } from "@/components/chillchain/ai-insights/ConfidenceSelection";
import { AIActivity } from "@/components/chillchain/ai-insights/AIActivity";
import { ExplainableAI } from "@/components/chillchain/ai-insights/ExplainableAI";
import { PriorityInsight } from "@/components/chillchain/ai-insights/PriorityInsights";
import { InsightFeed } from "@/components/chillchain/ai-insights/InsightsFeed";

export const Route = createFileRoute("/ai-insights")({
  component: AIInsightsRoute,
});

function AIInsightsRoute() {
  return (
    <main className="min-h-screen">
      <AIInsightsHero />
      <PriorityInsight />
      <InsightFeed />
      <PredictiveRisk />
      <RootCauseAnalysis />
      <AIRecommendation />
      <ConfidenceSection />
      <AIActivity />
      <ExplainableAI />
    </main>
  );
}
