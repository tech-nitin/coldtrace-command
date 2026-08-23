import {
  useEffect,
  useState,
} from "react";

import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  socket,
} from "@/services/socket";

import {
  Hero,
} from "@/components/chillchain/hero";

import {
  KpiStrip,
} from "@/components/chillchain/kpi-strip";

import {
  ShipmentMap,
} from "@/components/chillchain/shipment-map";

import {
  AlertCenter,
} from "@/components/chillchain/alert-center";

import AIRiskSnapshot
  from "@/components/chillchain/AIRiskSnapshot";

import {
  TemperatureIntelligenceLive,
} from "@/components/chillchain/TemperatureIntelligenceLive";

import {
  useAlertSocket,
} from "@/hooks/useAlertSocket";

const TITLE =
  "ChillChain AI — AI-Powered Cold-Chain Intelligence";

const DESC =
  "ChillChain turns real-time IoT sensor data into AI-powered shipment intelligence — detect spoilage risk and prevent cold-chain losses.";

type LiveAlert = {
  _id?: string;
  id?: string;
  alertType?: string;
  severity?: string;
  message?: string;
  status?: string;
};

export type LiveTelemetry = {
  shipmentId: string;

  temperature: number;
  humidity: number;

  healthIndex: number;

  status: string;
  aiRiskLevel: string;

  location?: number[];

  timestamp?: string;

  alert?: LiveAlert | null;
};

export const Route =
  createFileRoute("/")({

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
          content:
            "summary_large_image",
        },
      ],
    }),

    component: Dashboard,
  });

function Dashboard() {
  const [
    liveTelemetry,
    setLiveTelemetry,
  ] = useState<
    LiveTelemetry | null
  >(null);

  const [
    isSocketConnected,
    setIsSocketConnected,
  ] = useState(
    socket.connected,
  );

  const [
    notificationPermission,
    setNotificationPermission,
  ] =
    useState<NotificationPermission>(
      () => {
        if (
          typeof window ===
          "undefined"
        ) {
          return "default";
        }

        if (
          !("Notification" in window)
        ) {
          return "default";
        }

        return Notification.permission;
      },
    );

  /*
   * Receive live alert from Socket.IO.
   */
  const liveAlert =
    useAlertSocket();

  /*
   * Request browser notification permission.
   * This must be triggered by user interaction.
   */
  const requestNotificationPermission =
    async () => {
      if (
        !("Notification" in window)
      ) {
        window.alert(
          "This browser does not support notifications.",
        );

        return;
      }

      try {
        const permission =
          await Notification.requestPermission();

        setNotificationPermission(
          permission,
        );

        console.log(
          "🔔 Notification permission:",
          permission,
        );

        if (
          permission === "granted"
        ) {
          new Notification(
            "🔔 ChillChain Notifications Enabled",
            {
              body:
                "You will now receive real-time cold-chain alerts.",
            },
          );
        }
      } catch (error) {
        console.error(
          "Notification permission error:",
          error,
        );
      }
    };

  /*
   * Main Socket.IO connection
   * + telemetry listener.
   */
  useEffect(() => {
    const handleConnect =
      () => {
        console.log(
          "🟢 Connected to ChillChain Socket.IO:",
          socket.id,
        );

        setIsSocketConnected(true);
      };

    const handleDisconnect =
      () => {
        console.log(
          "🔴 Socket.IO disconnected",
        );

        setIsSocketConnected(false);
      };

    const handleConnectError =
      (error: Error) => {
        console.error(
          "❌ Socket.IO connection error:",
          error.message,
        );

        setIsSocketConnected(false);
      };

    const handleTelemetry =
      (data: LiveTelemetry) => {
        console.log(
          "📡 Live telemetry received:",
          data,
        );

        setLiveTelemetry(data);
      };

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "telemetry_update",
      handleTelemetry,
    );

    /*
     * Connect once.
     */
    if (!socket.connected) {
      socket.connect();
    } else {
      setIsSocketConnected(true);
    }

    return () => {
      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "telemetry_update",
        handleTelemetry,
      );

      /*
       * Don't disconnect the global socket here.
       */
    };
  }, []);

  return (
    <main className="min-h-screen">

      <h1 className="sr-only">
        ChillChain AI cold-chain intelligence dashboard
      </h1>

      {/* LIVE STATUS */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">

        {notificationPermission ===
          "default" && (
            <button
              onClick={
                requestNotificationPermission
              }
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-blue-700"
            >
              🔔 Enable Notifications
            </button>
          )}

        {notificationPermission ===
          "denied" && (
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 shadow-lg">
              🔕 Notifications Blocked
            </div>
          )}

        {notificationPermission ===
          "granted" && (
            <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-600 shadow-lg">
              🔔 Notifications Enabled
            </div>
          )}

        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur ${
            isSocketConnected
              ? "border-green-500/30 bg-green-500/10 text-green-600"
              : "border-red-500/30 bg-red-500/10 text-red-600"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isSocketConnected
                ? "animate-pulse bg-green-500"
                : "bg-red-500"
            }`}
          />

          {isSocketConnected
            ? "Live Connected"
            : "Reconnecting..."}
        </div>

      </div>

      {/* HERO */}
      <Hero />

      {/* KPI */}
      <KpiStrip />

      {/* AI RISK */}
      <AIRiskSnapshot
        liveTelemetry={
          liveTelemetry
        }
      />

      {/* TEMPERATURE */}
      <TemperatureIntelligenceLive
        liveTelemetry={
          liveTelemetry
        }
      />

      {/* LIVE MAP */}
      <ShipmentMap
        liveTelemetry={
          liveTelemetry
        }
      />

      {/* LIVE ALERTS */}
      <AlertCenter
        liveAlert={
          liveAlert
        }
      />

      {/* FOOTER */}
      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        ChillChain AI · SHT40 + NodeMCU ESP8266 + AI Risk Engine · Hackathon build
      </footer>

    </main>
  );
}