import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MOCK_SHIPMENTS, SUMMARY_METRICS } from "../data/mockShipments";
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

const riskWeight = { high: 3, medium: 2, low: 1 } as const;

function matchesFilter(shipment: Shipment, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "active") return shipment.status === "in-transit";
  return shipment.status === filter;
}

function parseEtaMinutes(eta: string) {
  if (eta === "Delivered") return Infinity;
  const hoursMatch = eta.match(/(\d+)h/);
  const minsMatch = eta.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
}

// Surface the shipment that most needs attention first, so the panel never
// opens empty and the "what needs attention right now" story is immediate.
function pickDefaultShipment(list: Shipment[]): Shipment | null {
  if (list.length === 0) return null;
  const critical = list.find((s) => s.status === "critical");
  if (critical) return critical;
  const atRisk = list.find((s) => s.status === "at-risk");
  if (atRisk) return atRisk;
  return list[0];
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedKpi, setSelectedKpi] = useState<SummaryMetric["key"] | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewMode>("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => pickDefaultShipment(MOCK_SHIPMENTS)?.id ?? null
  );
  const [syncedSecondsAgo, setSyncedSecondsAgo] = useState(6);

  // Ticks the "synced Xs ago" indicator so the header feels connected to
  // live infrastructure without implying data is changing constantly.
  useEffect(() => {
    const tick = window.setInterval(() => {
      setSyncedSecondsAgo((s) => (s >= 45 ? 0 : s + 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  // Occasionally marks a single online sensor as freshly updated — a small,
  // believable heartbeat rather than constantly shuffling numbers.
  useEffect(() => {
    const heartbeat = window.setInterval(() => {
      setShipments((prev) => {
        const onlineIndexes = prev
          .map((s, i) => (s.sensorOnline ? i : -1))
          .filter((i) => i !== -1);
        if (onlineIndexes.length === 0) return prev;
        const idx =
          onlineIndexes[Math.floor(Math.random() * onlineIndexes.length)];
        return prev.map((s, i) =>
          i === idx ? { ...s, lastUpdateMinutesAgo: 0 } : s
        );
      });
    }, 20000);
    return () => window.clearInterval(heartbeat);
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
          return riskWeight[b.aiRisk] - riskWeight[a.aiRisk];
        case "eta":
          return parseEtaMinutes(a.eta) - parseEtaMinutes(b.eta);
        case "recent":
        default:
          return a.lastUpdateMinutesAgo - b.lastUpdateMinutesAgo;
      }
    });

    return results;
  }, [shipments, query, filter, sort]);

  // Keep selection valid as filters/search narrow the list.
  useEffect(() => {
    if (visibleShipments.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!visibleShipments.some((s) => s.id === selectedId)) {
      setSelectedId(visibleShipments[0].id);
    }
  }, [visibleShipments, selectedId]);

  const selectedShipment =
    shipments.find((s) => s.id === selectedId) ?? null;

  const systemHealthy = !shipments.some((s) => s.status === "critical");

  function handleKpiSelect(metric: SummaryMetric) {
    setSelectedKpi(metric.key);
    setFilter(metric.filter);
  }

  function handleFilterChange(nextFilter: FilterKey) {
    setFilter(nextFilter);
    setSelectedKpi(null);
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setSyncedSecondsAgo(0);
    window.setTimeout(() => setIsRefreshing(false), 650);
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
          activeCount={SUMMARY_METRICS[0].value}
          lastSyncedSecondsAgo={syncedSecondsAgo}
          systemHealthy={systemHealthy}
        />

        <OperationsKpiStrip
          metrics={SUMMARY_METRICS}
          selectedKey={selectedKpi}
          onSelect={handleKpiSelect}
        />

        {/* Main command-center surface */}
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
            onRefresh={handleRefresh}
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
