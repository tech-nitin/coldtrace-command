import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/chillchain/hero";
import { KpiStrip } from "@/components/chillchain/kpi-strip";
import { ShipmentMap } from "@/components/chillchain/shipment-map";
import { AlertCenter } from "@/components/chillchain/alert-center";
import AIRiskSnapshot from "@/components/chillchain/AIRiskSnapshot";
import { TemperatureIntelligenceLive } from "@/components/chillchain/TemperatureIntelligenceLive";

const TITLE = "ChillChain AI — AI-Powered Cold-Chain Intelligence";

const DESC =
  "ChillChain turns real-time IoT sensor data into AI-powered shipment intelligence — detect spoilage risk and prevent cold-chain losses.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: TITLE,
      },
      {
        name: "description",
        content: DESC,
      },
      {
        property: "og:title",
        content: TITLE,
      },
      {
        property: "og:description",
        content: DESC,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="min-h-screen">
      <h1 className="sr-only">
        ChillChain AI cold-chain intelligence dashboard
      </h1>

      {/* Hero */}
      <Hero />

      {/* KPI section */}
      <KpiStrip />

      {/* AI Risk */}
      <AIRiskSnapshot />

      {/* Temperature intelligence */}
      <TemperatureIntelligenceLive />

      {/* ========================================= */}
      {/* LIVE SHIPMENT MAP */}
      {/* ========================================= */}
      <ShipmentMap />

      {/* Alerts */}
      <AlertCenter />

      {/* Footer */}
      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        ChillChain AI · SHT40 + ESP32 + AI Risk Engine · Hackathon build
      </footer>
    </main>
  );
}