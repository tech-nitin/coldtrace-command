import { createFileRoute } from "@tanstack/react-router";

import StorageIntelligencePage from "../pages/StorageIntelligencePage";

export const Route = createFileRoute("/storage")({
  component: StorageIntelligencePage,
});