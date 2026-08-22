import RiskSpoilageIntelligence from "@/pages/RiskSpoilageIntelligence";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/risk-spoilage")({
  component: RiskSpoilagePage,
});

function RiskSpoilagePage() {
  return <RiskSpoilageIntelligence />;
}