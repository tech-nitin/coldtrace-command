import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

export type LiveAlertData = {
  shipmentId: string;

  alert: {
    _id?: string;
    id?: string;

    alertType?: string;
    severity?: string;
    message?: string;
    status?: string;

    createdAt?: string;

    readingValue?: number;
  };
};

export function useAlertSocket() {
  const [liveAlert, setLiveAlert] =
    useState<LiveAlertData | null>(null);

  useEffect(() => {
    const handleAlert = (data: LiveAlertData) => {
      console.log(
        "🚨 [LIVE ALERT TRIGGERED]",
        data
      );

      setLiveAlert(data);

      const alert = data.alert;

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("🚨 ChillChain Alert", {
          body:
            alert.message ||
            `Alert detected for shipment ${data.shipmentId}`,
        });
      }
    };

    socket.on(
      "alert_triggered",
      handleAlert
    );

    return () => {
      socket.off(
        "alert_triggered",
        handleAlert
      );
    };
  }, []);

  return liveAlert;
}