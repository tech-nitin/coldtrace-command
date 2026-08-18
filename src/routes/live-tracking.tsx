import { createFileRoute } from "@tanstack/react-router";
import LiveTrackingPage from "@/pages/LiveTrackingPage";

export const Route = createFileRoute("/live-tracking")({
  component: LiveTrackingPage,
});