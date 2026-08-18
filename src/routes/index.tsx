import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/chillchain/nav";
import { Hero } from "@/components/chillchain/hero";
import { KpiStrip } from "@/components/chillchain/kpi-strip";
import { TemperatureIntelligence } from "@/components/chillchain/temperature-intelligence";
import { RiskAssessment } from "@/components/chillchain/risk-assessment";
import { ShipmentMap } from "@/components/chillchain/shipment-map";
import { ShipmentsTable } from "@/components/chillchain/shipments-table";
import { Analytics } from "@/components/chillchain/analytics";
import { HealthPassport } from "@/components/chillchain/health-passport";
import { AlertCenter } from "@/components/chillchain/alert-center";
import { ClosingBanner, IotSystem } from "@/components/chillchain/iot-system";
import AIRiskSnapshot from "@/components/chillchain/AIRiskSnapshot";

const TITLE = "ChillChain AI — AI-Powered Cold-Chain Intelligence";
const DESC =
  "ChillChain turns real-time IoT sensor data into AI-powered shipment intelligence — detect spoilage risk and prevent cold-chain losses.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="min-h-screen">
      {/* <TopNav /> */}
      <h1 className="sr-only">ChillChain AI cold-chain intelligence dashboard</h1>
      <Hero />
      <KpiStrip />
      <AIRiskSnapshot />
      <TemperatureIntelligence />
      {/* <RiskAssessment /> */}
      <ShipmentMap />
      {/* <ShipmentsTable /> */}
      {/* <Analytics /> */}
      {/* <HealthPassport /> */}
      <AlertCenter />
      {/* <IotSystem /> */}
      {/* <ClosingBanner /> */}
      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        ChillChain AI · SHT40 + ESP32 + AI Risk Engine · Hackathon build
      </footer>
    </main>
  );
}
