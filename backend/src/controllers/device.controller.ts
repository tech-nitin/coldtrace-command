// backend/src/controllers/device.controller.ts
import { Request, Response } from 'express';
import Device from '../models/Device';

const defaultDevices = [
  {
    nodeId: 'DEV-1001',
    name: 'Primary Storage A Sensor',
    type: 'ESP32 SHT40',
    battery: 98,
    signal: -62,
    lastPing: 'Just now',
    firmware: 'v2.1.0',
    status: 'Online',
    tempHistory: [4.1, 4.2, 4.0, 4.3, 4.2, 4.1],
    humidityHistory: [68, 70, 69, 71, 72, 72]
  },
  {
    nodeId: 'DEV-1002',
    name: 'Refrigerated Transit Node B',
    type: 'ESP32 LIS3DH',
    battery: 84,
    signal: -74,
    lastPing: '1 min ago',
    firmware: 'v2.1.0',
    status: 'Online',
    tempHistory: [3.5, 3.6, 3.4, 3.7, 3.6, 3.6],
    humidityHistory: [62, 64, 65, 63, 68, 68]
  },
  {
    nodeId: 'DEV-1003',
    name: 'Frozen Cargo Pod C',
    type: 'ESP32 SHT40',
    battery: 15,
    signal: -89,
    lastPing: '4 min ago',
    firmware: 'v2.0.4',
    status: 'Warning',
    tempHistory: [-18.2, -18.4, -18.1, -18.5, -18.4],
    humidityHistory: [52, 54, 53, 55, 54]
  },
  {
    nodeId: 'DEV-1004',
    name: 'Fresh Produce Zone D',
    type: 'ESP32 SHT40',
    battery: 42,
    signal: -95,
    lastPing: '18 min ago',
    firmware: 'v1.9.8',
    status: 'Offline',
    tempHistory: [6.2, 6.8, 7.2, 7.5, 7.6],
    humidityHistory: [82, 85, 87, 88, 89]
  }
];

export const getDevicesOverview = async (_req: Request, res: Response) => {
  try {
    let devices = await Device.find({});

    // Seed default hardware devices if collection is empty
    if (devices.length === 0) {
      devices = await Device.insertMany(defaultDevices);
    }

    const totalNodes = devices.length;
    const onlineNodes = devices.filter((d) => d.status === 'Online').length;
    const warningNodes = devices.filter((d) => d.status === 'Warning').length;
    const offlineNodes = devices.filter((d) => d.status === 'Offline').length;

    const uptimePercent = (((totalNodes - offlineNodes) / totalNodes) * 100).toFixed(1);

    // Pick active alert node for the detailed panel chart
    const activeNode = devices.find((d) => d.nodeId === 'DEV-1004') || devices[0];

    return res.status(200).json({
      success: true,
      data: {
        networkSummary: {
          totalNodes,
          onlineNodes,
          warningNodes,
          offlineNodes,
          uptimePercent: `${uptimePercent}%`
        },
        devices: devices.map((d) => ({
          _id: d._id,
          nodeId: d.nodeId,
          name: d.name,
          type: d.type,
          battery: d.battery,
          signal: `${d.signal} dBm`,
          lastPing: d.lastPing,
          firmware: d.firmware,
          status: d.status
        })),
        activeNodeTelemetry: {
          nodeId: activeNode.nodeId,
          name: activeNode.name,
          status: activeNode.status,
          battery: activeNode.battery,
          signal: activeNode.signal,
          tempHistory: activeNode.tempHistory,
          humidityHistory: activeNode.humidityHistory
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching device telemetry:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { nodeId, name, type, battery, signal } = req.body;

    const newDevice = new Device({
      nodeId,
      name,
      type: type || 'ESP32 SHT40',
      battery: Number(battery) || 100,
      signal: Number(signal) || -65,
      lastPing: 'Just now',
      firmware: 'v2.1.0',
      status: 'Online',
      tempHistory: [4.0, 4.1, 4.2],
      humidityHistory: [60, 62, 61]
    });

    await newDevice.save();

    return res.status(201).json({ success: true, data: newDevice });
  } catch (error: any) {
    console.error('Error adding new device node:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};