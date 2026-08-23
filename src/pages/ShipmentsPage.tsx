import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { socket } from "@/services/socket";
import { ShipmentsHeader } from "../components/shipments/ShipmentsHeader";
import { OperationsKpiStrip } from "../components/shipments/OperationsKpiStrip";
import { ShipmentsToolbar } from "../components/shipments/ShipmentsToolbar";
import { ShipmentsList } from "../components/shipments/ShipmentsList";
import { ShipmentIntelligencePanel } from "../components/shipments/ShipmentIntelligencePanel";
import {
  FilterKey,
  Shipment,
  SortKey,
  SummaryMetric,
  ViewMode,
} from "../types/shipment";
import { CreateShipmentCard } from "@/components/shipments/CreateShipmentCard";

const API_BASE_URL = "http://localhost:5000/api/v1";
const SOCKET_URL = "http://localhost:5000";

const riskWeight = { high: 3, medium: 2, low: 1 } as const;

function normalizeStatus(statusStr: string): string {
  if (!statusStr) return "healthy";
  const lower = statusStr.toLowerCase().replace(/_/g, "-");
  if (lower === "in-transit" || lower === "healthy") return "healthy";
  return lower;
}

function matchesFilter(shipment: Shipment, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "active") return shipment.status === "healthy" || shipment.status === "in-transit";
  return shipment.status === filter;
}

function parseEtaMinutes(eta: string) {
  if (!eta || eta === "Delivered") return Infinity;
  const hoursMatch = eta.match(/(\d+)h/);
  const minsMatch = eta.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
}

function pickDefaultShipment(list: Shipment[]): Shipment | null {
  if (list.length === 0) return null;
  const critical = list.find((s) => s.status === "critical");
  if (critical) return critical;
  const atRisk = list.find((s) => s.status === "at-risk");
  if (atRisk) return atRisk;
  return list[0];
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [metrics, setMetrics] = useState<SummaryMetric[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedKpi, setSelectedKpi] = useState<SummaryMetric["key"] | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewMode>("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncedSecondsAgo, setSyncedSecondsAgo] = useState(0);

  const fetchBackendData = async () => {
    try {
      setIsRefreshing(true);

      const shipmentsRes = await fetch(`${API_BASE_URL}/shipments`);
      const shipmentsJson = await shipmentsRes.json();
      
      const rawData = shipmentsJson.data || shipmentsJson;

      if (Array.isArray(rawData)) {
        const mappedShipments: Shipment[] = rawData.map((item: any) => {
  // Extract temperature & humidity safely from root or telemetry object
  const temp = item.currentTemp ?? item.temperature ?? item.lastTelemetry?.temperature ?? 0;
  const humidity = item.currentHumidity ?? item.humidity ?? item.lastTelemetry?.humidity ?? 0;

  // Format ETA date string into concise display format (e.g., "1h 15m")
  let etaDisplay = "2h 00m";
  if (item.eta) {
    if (typeof item.eta === "string" && !item.eta.includes("T")) {
      etaDisplay = item.eta;
    } else {
      const etaDate = new Date(item.eta);
      const diffMs = etaDate.getTime() - Date.now();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        etaDisplay = `${hours}h ${mins}m`;
      }
    }
  }

  return {
    id: item.shipmentId || item.id || "N/A",
    cargoType: item.cargoType || "General",
    origin: item.origin || "Origin",
    destination: item.destination || "Destination",
    routeProgress: item.routeProgress ?? 50,
    currentTemp: Number(temp),
    currentHumidity: Number(humidity),
    health: Number(item.healthIndex ?? item.health ?? 100),
    eta: etaDisplay,
    status: normalizeStatus(item.status),
    aiRisk: (item.aiRiskLevel || item.aiRisk || "low").toLowerCase(),
    sensorOnline: true,
    lastUpdateMinutesAgo: 0,
    aiRecommendation: item.aiRecommendation || "Normal monitoring.",
  };
});

        setShipments(mappedShipments);
        if (!selectedId && mappedShipments.length > 0) {
          setSelectedId(pickDefaultShipment(mappedShipments)?.id ?? null);
        }
      }

      const metricsRes = await fetch(`${API_BASE_URL}/shipments/metrics`);
      const metricsJson = await metricsRes.json();
      const d = metricsJson.data || metricsJson;

      if (d) {
        const mappedMetrics: SummaryMetric[] = [
          { key: "total", label: "TOTAL SHIPMENTS", value: d.totalShipments ?? d.total ?? d.activeShipments ?? 0, change: "+8% today", trend: "up", filter: "all" },
          { key: "inTransit", label: "IN TRANSIT", value: d.inTransit ?? 0, change: "On schedule", trend: "neutral", filter: "active" },
          { key: "atRisk", label: "AT RISK", value: d.atRiskCount ?? d.atRisk ?? 0, change: "↑ 1 since noon", trend: "up", filter: "at-risk" },
          { key: "critical", label: "CRITICAL ALERT", value: d.criticalCount ?? d.critical ?? 0, change: "Needs attention", trend: "down", filter: "critical" },
          { key: "delayed", label: "DELAYED", value: d.delayedCount ?? d.delayed ?? 0, change: "↓ 1 vs yesterday", trend: "down", filter: "delayed" },
        ];
        setMetrics(mappedMetrics);
      }
    } catch (error) {
      console.error("Error connecting to backend API:", error);
    } finally {
      setIsRefreshing(false);
      setSyncedSecondsAgo(0);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  useEffect(() => {
    // const socket = io(SOCKET_URL);

    socket.on("telemetry_update", (data: any) => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.id === data.shipmentId) {
            return {
              ...s,
              currentTemp: Number(data.temperature ?? s.currentTemp),
              currentHumidity: Number(data.humidity ?? s.currentHumidity),
              health: Number(data.healthIndex ?? s.health),
              status: normalizeStatus(data.status || s.status),
              aiRisk: (data.aiRiskLevel || s.aiRisk || "low").toLowerCase(),
              lastUpdateMinutesAgo: 0,
            };
          }
          return s;
        })
      );
      setSyncedSecondsAgo(0);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setSyncedSecondsAgo((s) => (s >= 45 ? 0 : s + 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  const visibleShipments = useMemo(() => {
    const q = query.trim().toLowerCase();

    let results = shipments.filter((shipment) => {
      const matchesQuery =
        q.length === 0 ||
        shipment.id.toLowerCase().includes(q) ||
        shipment.cargoType.toLowerCase().includes(q) ||
        shipment.origin.toLowerCase().includes(q) ||
        shipment.destination.toLowerCase().includes(q);

      return matchesQuery && matchesFilter(shipment, filter);
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "health-asc":
          return a.health - b.health;
        case "risk-desc":
          return riskWeight[a.aiRisk as keyof typeof riskWeight] - riskWeight[b.aiRisk as keyof typeof riskWeight];
        case "eta":
          return parseEtaMinutes(a.eta) - parseEtaMinutes(b.eta);
        case "recent":
        default:
          return a.lastUpdateMinutesAgo - b.lastUpdateMinutesAgo;
      }
    });

    return results;
  }, [shipments, query, filter, sort]);

  useEffect(() => {
    if (visibleShipments.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!visibleShipments.some((s) => s.id === selectedId)) {
      setSelectedId(visibleShipments[0].id);
    }
  }, [visibleShipments, selectedId]);

  const selectedShipment = shipments.find((s) => s.id === selectedId) ?? null;
  const systemHealthy = !shipments.some((s) => s.status === "critical");

  function handleKpiSelect(metric: SummaryMetric) {
    setSelectedKpi(metric.key);
    setFilter(metric.filter);
  }

  function handleFilterChange(nextFilter: FilterKey) {
    setFilter(nextFilter);
    setSelectedKpi(null);
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(180deg, #F6F4EA 0%, #EFF3EC 45%, #F6F4EA 100%)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:px-10">
        <ShipmentsHeader
          activeCount={shipments.length}
          lastSyncedSecondsAgo={syncedSecondsAgo}
          systemHealthy={systemHealthy}
        />

        <OperationsKpiStrip
          metrics={metrics}
          selectedKey={selectedKpi}
          onSelect={handleKpiSelect}
        />

        <CreateShipmentCard onShipmentCreated={fetchBackendData} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-[#E7E3D4] bg-[#FCFBF6] p-5 shadow-[0_1px_2px_rgba(20,35,27,0.03)] sm:p-6"
        >
          <ShipmentsToolbar
            query={query}
            onQueryChange={setQuery}
            activeFilter={filter}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            onRefresh={fetchBackendData}
            isRefreshing={isRefreshing}
          />

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
            <div className="min-w-0">
              <ShipmentsList
                shipments={visibleShipments}
                view={view}
                selectedId={selectedId}
                onSelect={(shipment) => setSelectedId(shipment.id)}
              />
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <ShipmentIntelligencePanel shipment={selectedShipment} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}