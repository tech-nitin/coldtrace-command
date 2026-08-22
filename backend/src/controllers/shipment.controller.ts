import { Request, Response } from 'express';
import { ShipmentService } from '../services/shipment.service.js';
import Shipment from '../models/Shipment.js';
import mongoose from 'mongoose';

const shipmentService = new ShipmentService();

export const getMetrics = async (_req: Request, res: Response) => {
  try {
    const metrics = await shipmentService.getDashboardMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipments = async (_req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not ready");
    }

    const rawShipments = await db.collection('shipments').find({}).toArray();

    const enrichedShipments = await Promise.all(
      rawShipments.map(async (shipment) => {
        const sensorId = shipment.sensorDeviceId || shipment.deviceId || shipment.sensorId || "COLD_TRUCK_01";

        const latestTelemetry = await db.collection('telemetries')
          .find({
            $or: [
              { sensorDeviceId: sensorId },
              { deviceId: sensorId },
              { device_id: sensorId }
            ]
          })
          .sort({ _id: -1 })
          .limit(1)
          .toArray();

        const lastRead = latestTelemetry[0] || {};

        return {
          ...shipment,
          shipmentId: shipment.shipmentId || shipment._id.toString(),
          status: (shipment.status || "healthy").toLowerCase(),
          currentTemp: lastRead.temperature ?? lastRead.temp ?? shipment.currentTemp ?? 0,
          currentHumidity: lastRead.humidity ?? shipment.currentHumidity ?? 0,
          lastTelemetry: lastRead
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedShipments
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = await shipmentService.getShipmentDetails(id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const { shipmentId } = req.body;

    // Check if shipmentId already exists before saving to prevent E11000 crash
    const existing = await Shipment.findOne({ shipmentId });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: `Shipment with ID ${shipmentId} already exists.` 
      });
    }

    const newShipment = new Shipment(req.body);
    const savedShipment = await newShipment.save();
    res.status(201).json({ success: true, data: savedShipment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};