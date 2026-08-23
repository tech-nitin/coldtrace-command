// backend/src/controllers/storage.controller.ts
import { Request, Response } from 'express';
import StorageZone from '../models/StorageZone.js';

// 1. Add 'as const' to status strings so TypeScript treats them as literal types
const defaultZones = [
  {
    zoneId: 'Storage Zone A',
    category: 'Fresh Vegetables',
    temperature: 4.2,
    humidity: 72,
    spoilageRisk: 14,
    status: 'Healthy' as const,
    sparklineData: [10, 12, 11, 15, 14],
    exposureTime: '0h 45m',
    productSensitivity: 'Medium',
    recommendedAction: 'Zone parameters are optimal.'
  },
  {
    zoneId: 'Storage Zone B',
    category: 'Dairy Products',
    temperature: 3.6,
    humidity: 68,
    spoilageRisk: 9,
    status: 'Healthy' as const,
    sparklineData: [8, 9, 8, 10, 9],
    exposureTime: '0h 20m',
    productSensitivity: 'High',
    recommendedAction: 'Temperature within safe threshold.'
  },
  {
    zoneId: 'Storage Zone C',
    category: 'Frozen Food',
    temperature: -18.4,
    humidity: 54,
    spoilageRisk: 5,
    status: 'Healthy' as const,
    sparklineData: [4, 5, 5, 6, 5],
    exposureTime: '0h 10m',
    productSensitivity: 'Medium',
    recommendedAction: 'Sub-zero cooling maintained.'
  },
  {
    zoneId: 'Storage Zone D',
    category: 'Fresh Fruits',
    temperature: 7.6,
    humidity: 89,
    spoilageRisk: 82,
    status: 'Critical' as const,
    sparklineData: [40, 55, 68, 75, 82],
    exposureTime: '2h 18m',
    productSensitivity: 'High',
    recommendedAction: 'Move sensitive inventory away from Storage Zone D and inspect its cooling system.'
  },
  {
    zoneId: 'Storage Zone E',
    category: 'Meat & Poultry',
    temperature: 2.4,
    humidity: 81,
    spoilageRisk: 46,
    status: 'Warning' as const,
    sparklineData: [20, 25, 32, 40, 46],
    exposureTime: '1h 05m',
    productSensitivity: 'High',
    recommendedAction: 'Monitor humidity levels and adjust air circulation.'
  },
  {
    zoneId: 'Storage Zone F',
    category: 'Pharmaceuticals',
    temperature: 5.1,
    humidity: 50,
    spoilageRisk: 11,
    status: 'Healthy' as const,
    sparklineData: [10, 11, 10, 12, 11],
    exposureTime: '0h 15m',
    productSensitivity: 'High',
    recommendedAction: 'Sensors report stable ambient conditions.'
  }
];

export const getStorageOverview = async (_req: Request, res: Response) => {
  try {
    let zones: any[] = await StorageZone.find({});

    // 2. Seed default zones if collection is totally empty
    if (zones.length === 0) {
      zones = await StorageZone.insertMany(defaultZones);
    }

    // 3. Dynamic Summary Calculations
    const activeZones = zones.length;
    const highRiskZones = zones.filter(
      (z) => z.status === 'Critical' || z.status === 'Warning' || z.spoilageRisk >= 40
    ).length;

    // 4. Dynamically pick the zone with highest spoilage risk for AI Spotlight
    const elevatedRiskZone = [...zones].sort((a, b) => b.spoilageRisk - a.spoilageRisk)[0];

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          activeZones,
          inventoryProtectedTons: `${(activeZones * 3.1).toFixed(1)}T`,
          highRiskZonesCount: highRiskZones
        },
        zones: zones.map((z) => ({
          _id: z._id,
          zoneId: z.zoneId,
          category: z.category,
          temperature: z.temperature,
          humidity: z.humidity,
          spoilageRisk: z.spoilageRisk,
          status: z.status,
          sparklineData: z.sparklineData && z.sparklineData.length > 0 ? z.sparklineData : [z.temperature, z.temperature + 0.2, z.temperature]
        })),
        aiElevatedRiskAlert: elevatedRiskZone
          ? {
              zoneId: elevatedRiskZone.zoneId,
              category: elevatedRiskZone.category,
              spoilageRisk: elevatedRiskZone.spoilageRisk,
              temperature: elevatedRiskZone.temperature,
              humidity: elevatedRiskZone.humidity,
              exposureTime: elevatedRiskZone.exposureTime || '1h 00m',
              productSensitivity: elevatedRiskZone.productSensitivity || 'Medium',
              recommendedAction: elevatedRiskZone.recommendedAction || `Monitor thermal status of ${elevatedRiskZone.zoneId}.`
            }
          : null
      }
    });
  } catch (error: any) {
    console.error('Error fetching storage overview:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createStorageZone = async (req: Request, res: Response) => {
  try {
    const { zoneId, category, temperature, humidity, productSensitivity } = req.body;

    if (!zoneId || !category || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const tempNum = Number(temperature);
    const humidityNum = Number(humidity);

    let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
    let spoilageRisk = 12;

    if (tempNum > 8.0 || humidityNum > 80) {
      status = 'Critical';
      spoilageRisk = Math.min(98, Math.round(tempNum * 9 + 15));
    } else if (tempNum > 5.0 || humidityNum > 75) {
      status = 'Warning';
      spoilageRisk = 48;
    }

    const newZone = new StorageZone({
      zoneId,
      category,
      temperature: tempNum,
      humidity: humidityNum,
      spoilageRisk,
      status,
      productSensitivity: productSensitivity || 'Medium',
      sparklineData: [tempNum - 0.4, tempNum - 0.2, tempNum, tempNum + 0.1, tempNum],
      exposureTime: '0h 10m',
      recommendedAction: status === 'Healthy' 
        ? 'Operating safely within target threshold.' 
        : `Inspect cooling unit and ventilation for ${zoneId}.`
    });

    await newZone.save();

    return res.status(201).json({ success: true, data: newZone });
  } catch (error: any) {
    console.error('Error creating storage zone:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};