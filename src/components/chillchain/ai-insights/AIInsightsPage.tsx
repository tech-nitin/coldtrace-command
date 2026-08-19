import { AIInsightsHero } from "@/components/chillchain/ai-insights/AIInsightsHero";
import { RiskSnapshot } from "@/components/chillchain/ai-insights/RiskSnapshot";
import { PriorityInsights } from "@/components/chillchain/ai-insights/PriorityInsights";
import { PredictiveRisk } from "@/components/chillchain/ai-insights/PredictiveRisk";
import { RootCause } from "@/components/chillchain/ai-insights/RootCause";
import { ExplainableAI } from "@/components/chillchain/ai-insights/ExplainableAI";
import { ConfidenceSelection } from "@/components/chillchain/ai-insights/ConfidenceSelection";
import { AIRecommendation } from "@/components/chillchain/ai-insights/AIRecommendation";
import { InsightFeed } from "@/components/chillchain/ai-insights/InsightFeed";
import { AIActivity } from "@/components/chillchain/ai-insights/AIActivity";

export function AIInsightsPage() {
  return (
    <main className="min-h-screen">
      <AIInsightsHero />

      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <RiskSnapshot />

        <PriorityInsights />

        <PredictiveRisk />

        <RootCause />

        <ExplainableAI />

        <ConfidenceSelection />

        <AIRecommendation />

        <InsightFeed />

        <AIActivity />
      </div>
    </main>
  );
}