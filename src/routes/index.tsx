import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/coldtrace/nav";
import { Hero } from "@/components/coldtrace/hero";
import { KpiStrip } from "@/components/coldtrace/kpi-strip";
import { TemperatureIntelligence } from "@/components/coldtrace/temperature-intelligence";
import { RiskAssessment } from "@/components/coldtrace/risk-assessment";
import { ShipmentMap } from "@/components/coldtrace/shipment-map";
import { ShipmentsTable } from "@/components/coldtrace/shipments-table";
import { Analytics } from "@/components/coldtrace/analytics";
import { HealthPassport } from "@/components/coldtrace/health-passport";
import { AlertCenter } from "@/components/coldtrace/alert-center";
import { ClosingBanner, IotSystem } from "@/components/coldtrace/iot-system";

const TITLE = "ColdTrace AI — AI-Powered Cold-Chain Intelligence";
const DESC =
  "ColdTrace turns real-time IoT sensor data into AI-powered shipment intelligence — detect spoilage risk and prevent cold-chain losses.";

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
      <TopNav />
      <h1 className="sr-only">ColdTrace AI cold-chain intelligence dashboard</h1>
      <Hero />
      <KpiStrip />
      <TemperatureIntelligence />
      <RiskAssessment />
      <ShipmentMap />
      <ShipmentsTable />
      <Analytics />
      <HealthPassport />
      <AlertCenter />
      <IotSystem />
      <ClosingBanner />
      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        ColdTrace AI · SHT40 + ESP32 + AI Risk Engine · Hackathon build
      </footer>
    </main>
  );
}
