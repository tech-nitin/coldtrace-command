import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as string) || '24H';
    const shipmentId = (req.query.shipmentId as string) || 'ALL';

    // 1. Filter shipments based on query parameter
    let filter: any = {};
    if (shipmentId !== 'ALL') {
      filter.shipmentId = shipmentId;
    }

    const shipments = await Shipment.find(filter);
    const totalCount = shipments.length || 1;

    let healthyCount = 0;
    let atRiskCount = 0;
    let criticalCount = 0;
    let totalTemp = 0;
    let totalHumidity = 0;
    let totalHealth = 0;

    const sensorDeviceIds: string[] = [];

    shipments.forEach((s: any) => {
      const status = (s.status || '').toUpperCase();
      if (status === 'CRITICAL') criticalCount++;
      else if (status === 'AT_RISK' || status === 'WARNING' || status === 'AT-RISK') atRiskCount++;
      else healthyCount++;

      totalTemp += Number(s.currentTemp ?? s.temperature ?? 4.5);
      totalHumidity += Number(s.currentHumidity ?? s.humidity ?? 65);
      totalHealth += Number(s.healthIndex ?? s.health ?? 95);

      const devId = s.sensorDeviceId || s.deviceId || s.sensorId;
      if (devId) sensorDeviceIds.push(devId);
    });

    const avgTemp = (totalTemp / totalCount).toFixed(1);
    const avgHealth = Math.round(totalHealth / totalCount);

    // 2. Fetch Telemetry History for Chart Trajectory
    const db = mongoose.connection.db;
    let trajectoryData = [];

    if (db) {
      const telemetryQuery: any = {};
      if (sensorDeviceIds.length > 0) {
        telemetryQuery.$or = [
          { sensorDeviceId: { $in: sensorDeviceIds } },
          { deviceId: { $in: sensorDeviceIds } },
          { device_id: { $in: sensorDeviceIds } }
        ];
      }

      const rawTelemetry = await db.collection('telemetries')
        .find(telemetryQuery)
        .sort({ timestamp: 1 })
        .limit(24)
        .toArray();

      trajectoryData = rawTelemetry.map((t, idx) => ({
        idx,
        label: t.timestamp ? new Date(t.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : `${idx}:00`,
        temp: Number(t.temperature ?? t.temp ?? 4.0),
        safeLow: 2.0,
        safeHigh: 8.0,
        critical: 10.0,
        humidity: Number(t.humidity ?? 65),
        risk: (t.temperature ?? t.temp ?? 0) > 10.0 ? "High" : (t.temperature ?? t.temp ?? 0) > 8.0 ? "Elevated" : "Low"
      }));
    }

    // 3. KPI Strip Data
    const kpis = [
      { key: "health", label: "Average Shipment Health", value: avgHealth, suffix: "/100", delta: 4.2, dir: "up", tone: "good", spark: [78, 82, 88, avgHealth] },
      { key: "excursions", label: "Temperature Excursions", value: criticalCount * 3 + atRiskCount, suffix: "", delta: 12.0, dir: "up", tone: criticalCount > 0 ? "bad" : "good", spark: [1, 2, 4, criticalCount * 3 + atRiskCount] },
      { key: "onTime", label: "On-Time Delivery", value: 94.6, suffix: "%", delta: 1.1, dir: "up", tone: "good", spark: [91, 93, 94, 94.6] },
      { key: "atRisk", label: "At-Risk Shipments", value: atRiskCount, suffix: "", delta: 1, dir: "up", tone: atRiskCount > 0 ? "warn" : "good", spark: [0, 1, 1, atRiskCount] },
      { key: "savings", label: "Losses Prevented", value: Number((healthyCount * 0.8).toFixed(1)), prefix: "₹", suffix: "L", delta: 12.8, dir: "up", tone: "good", spark: [1.2, 1.6, 2.0, Number((healthyCount * 0.8).toFixed(1))] },
    ];

    // 4. Risk Distribution Data
    const riskDistribution = [
      { key: "healthy", label: "Healthy", pct: Math.round((healthyCount / totalCount) * 100), count: healthyCount, color: "#1E7A4C" },
      { key: "atRisk", label: "At Risk", pct: Math.round((atRiskCount / totalCount) * 100), count: atRiskCount, color: "#C4842A" },
      { key: "critical", label: "Critical", pct: Math.round((criticalCount / totalCount) * 100), count: criticalCount, color: "#B23B34" },
    ];

    // 5. Route Performance Data
    const routes = shipments.map((s: any) => ({
      id: s.shipmentId || s.id,
      from: s.origin || "Origin",
      to: s.destination || "Destination",
      health: Number(s.healthIndex ?? s.health ?? 90),
      onTime: 95,
      shipments: 1,
      excursions: (s.status || '').toUpperCase() === 'CRITICAL' ? 3 : 0,
      avgTemp: Number(s.currentTemp ?? s.temperature ?? 4.5),
    }));

    // 6. Sensor Infrastructure Data
    const sensors = [
      { id: "temp", name: "Temperature Sensor", model: "SHT40", icon: "temp", uptime: 99.2, quality: 98.6, issues: criticalCount, lastComm: "12s ago", online: true },
      { id: "humidity", name: "Humidity Sensor", model: "SHT40", icon: "humidity", uptime: 98.7, quality: 96.4, issues: 0, lastComm: "12s ago", online: true },
      { id: "gps", name: "GPS Module", model: "ESP32 · u-blox", icon: "gps", uptime: 95.4, quality: 91.8, issues: atRiskCount, lastComm: "48s ago", online: true },
      { id: "accel", name: "Accelerometer", model: "MPU6050", icon: "accel", uptime: 88.1, quality: 84.2, issues: 1, lastComm: "6 min ago", online: true },
    ];

    // 7. Business Impact Metrics
    const impact = [
      { value: Number((healthyCount * 0.8).toFixed(1)), prefix: "₹", suffix: "L", decimals: 1, label: "Losses Prevented", note: "Estimated spoilage value averted" },
      { value: healthyCount + atRiskCount, suffix: "", decimals: 0, label: "High-Risk Shipments Intercepted", note: "Flagged and monitored" },
      { value: Math.round((healthyCount / totalCount) * 100), suffix: "%", decimals: 1, label: "Cold-Chain Compliance", note: "Time spent within safe temperature limits" },
      { value: totalCount * 14, suffix: "h", decimals: 0, label: "Potential Spoilage Avoided", note: "Cumulative safe exposure time" },
    ];

    res.json({
      success: true,
      data: {
        avgTemp,
        kpis,
        trajectoryData,
        riskDistribution,
        routes,
        sensors,
        impact,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};