import { useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Droplets,
  Route,
  WifiOff,
} from "lucide-react";

import {
  ALERTS,
  type RiskLevel,
} from "@/lib/ChillChain-data";

import type {
  LiveAlertData,
} from "@/hooks/useAlertSocket";

import {
  LiveDot,
  Reveal,
  Section,
  SectionHeading,
} from "./primitives";

type LiveAlert = {
  id: string;

  title: string;
  shipment: string;

  detail: string;
  time: string;

  level: RiskLevel;
};

type AlertCenterProps = {
  liveAlert: LiveAlertData | null;
};

const iconFor: Record<
  string,
  typeof AlertTriangle
> = {
  "Temperature Breach": AlertTriangle,

  "Temperature Too Low": AlertTriangle,

  "Humidity Warning": Droplets,

  "Route Deviation": Route,

  "Sensor Offline": WifiOff,

  "Temperature Normalized":
    CheckCircle2,
};

const styles: Record<
  RiskLevel,
  {
    wrap: string;
    icon: string;
  }
> = {
  healthy: {
    wrap:
      "border-success/30 bg-success/6",

    icon:
      "bg-success/12 text-success",
  },

  warning: {
    wrap:
      "border-warning/40 bg-warning/8",

    icon:
      "bg-warning/18 text-warning-foreground",
  },

  critical: {
    wrap:
      "border-destructive/30 bg-destructive/6",

    icon:
      "bg-destructive/12 text-destructive",
  },
};

function getRiskLevel(
  severity?: string,
): RiskLevel {
  const value =
    severity?.toUpperCase();

  if (
    value === "CRITICAL" ||
    value === "HIGH"
  ) {
    return "critical";
  }

  if (
    value === "MEDIUM" ||
    value === "WARNING"
  ) {
    return "warning";
  }

  return "healthy";
}

function getAlertTitle(
  alertType?: string,
): string {
  const type =
    alertType?.toUpperCase();

  if (
    type === "TEMP_EXCEEDED" ||
    type === "HIGH_TEMPERATURE"
  ) {
    return "Temperature Breach";
  }

  if (
    type === "TEMP_TOO_LOW" ||
    type === "LOW_TEMPERATURE"
  ) {
    return "Temperature Too Low";
  }

  if (
    type === "HUMIDITY_EXCEEDED"
  ) {
    return "Humidity Warning";
  }

  if (
    type === "SENSOR_OFFLINE"
  ) {
    return "Sensor Offline";
  }

  return "Cold Chain Alert";
}

export function AlertCenter({
  liveAlert,
}: AlertCenterProps) {
  const [liveAlerts, setLiveAlerts] =
    useState<LiveAlert[]>([]);

  const [visible, setVisible] =
    useState(1);

  /*
   * Convert incoming live socket alert
   * into AlertCenter UI format.
   */
  useEffect(() => {
    if (!liveAlert?.alert) {
      return;
    }

    console.log(
      "📥 AlertCenter received:",
      liveAlert,
    );

    const alert =
      liveAlert.alert;

    const newAlert: LiveAlert = {
      id:
        alert._id ||
        alert.id ||
        `${Date.now()}-${Math.random()}`,

      title:
        getAlertTitle(
          alert.alertType,
        ),

      shipment:
        liveAlert.shipmentId,

      detail:
        alert.message ||
        `Cold-chain anomaly detected for shipment ${liveAlert.shipmentId}`,

      time:
        "Just now",

      level:
        getRiskLevel(
          alert.severity,
        ),
    };

    setLiveAlerts((previous) => {
      const alreadyExists =
        previous.some(
          (item) =>
            item.id === newAlert.id,
        );

      if (alreadyExists) {
        return previous;
      }

      return [
        newAlert,
        ...previous,
      ].slice(0, 10);
    });

    /*
     * Make sure the new alert
     * is immediately visible.
     */
    setVisible((current) =>
      Math.max(
        current + 1,
        liveAlerts.length + 1,
      ),
    );
  }, [liveAlert]);

  /*
   * Animate the initial static alerts.
   */
  useEffect(() => {
    const totalAlerts =
      ALERTS.length +
      liveAlerts.length;

    if (visible >= totalAlerts) {
      return;
    }

    const timer =
      setTimeout(() => {
        setVisible(
          (value) => value + 1,
        );
      }, 700);

    return () =>
      clearTimeout(timer);
  }, [
    visible,
    liveAlerts.length,
  ]);

  /*
   * Live alerts appear first.
   */
  const allAlerts = [
    ...liveAlerts,
    ...ALERTS,
  ];

  const displayedAlerts =
    allAlerts.slice(
      0,
      Math.max(
        visible,
        liveAlerts.length,
      ),
    );

  const criticalCount =
    allAlerts.filter(
      (alert) =>
        alert.level === "critical",
    ).length;

  return (
    <Section
      id="alerts"
      className="!py-8 sm:!py-10 lg:!py-12"
    >
      <SectionHeading
        eyebrow="Alert Center"
        title={
          <>
            Escalations arrive{" "}

            <span className="text-gradient-primary">
              before the loss does
            </span>
            .
          </>
        }
        description="Every anomaly is streamed, classified and ranked by urgency so operators act on the one shipment that matters."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <LiveDot
              level={
                criticalCount > 0
                  ? "critical"
                  : undefined
              }
            />

            {criticalCount > 0
              ? `${criticalCount} unresolved critical`
              : "System monitoring active"}
          </span>
        }
      />

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">

        {/* ALERT LIST */}
        <div className="space-y-2.5">
          <AnimatePresence
            initial={false}
          >
            {displayedAlerts.map(
              (alert) => {
                const Icon =
                  iconFor[
                    alert.title
                  ] ?? BellRing;

                const style =
                  styles[
                    alert.level
                  ];

                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{
                      opacity: 0,
                      x: 48,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: -32,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${style.wrap}`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${style.icon}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">

                        <p className="font-display text-sm font-bold tracking-tight">
                          {alert.title}
                        </p>

                        <span className="text-xs font-semibold text-muted-foreground">
                          {alert.shipment}
                        </span>

                      </div>

                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {alert.detail}
                      </p>
                    </div>

                    <span className="ml-auto whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {alert.time}
                    </span>
                  </motion.div>
                );
              },
            )}
          </AnimatePresence>
        </div>

        {/* RESPONSE PLAYBOOK */}
        <Reveal delay={0.1}>
          <div className="surface-panel sticky top-20 rounded-2xl p-5">

            <p className="eyebrow">
              Response playbook
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              {[
                [
                  "Critical",
                  "Call driver, verify compressor, reroute to nearest cold hub.",
                ],

                [
                  "Warning",
                  "Increase sampling to 5 s, monitor 15 min window.",
                ],

                [
                  "Recovered",
                  "Log excursion into shipment passport.",
                ],
              ].map(
                ([key, value]) => (
                  <li key={key}>

                    <p className="font-display text-xs font-bold uppercase tracking-wider">
                      {key}
                    </p>

                    <p className="mt-1 text-muted-foreground">
                      {value}
                    </p>

                  </li>
                ),
              )}
            </ul>

            <button
              onClick={() =>
                setVisible(1)
              }
              className="mt-5 w-full rounded-full border border-border-strong bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:border-accent/50"
            >
              Replay alert feed
            </button>

          </div>
        </Reveal>

      </div>
    </Section>
  );
}