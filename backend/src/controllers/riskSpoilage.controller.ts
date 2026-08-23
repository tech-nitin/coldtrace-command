// backend/src/controllers/riskSpoilage.controller.ts
import { Request, Response } from 'express';
import Shipment from '../models/Shipment';
import { Telemetry } from '../models/Telemetry';

// Helper function to safely parse temperature thresholds (e.g. "-18°C", "2-8°C", "5")
const parseMaxAllowedTemp = (tempLimitStr?: string, defaultLimit = 5.0): number => {
  if (!tempLimitStr) return defaultLimit;
  const matches = tempLimitStr.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return defaultLimit;
  const nums = matches.map(Number);
  return Math.max(...nums);
};

export const getRiskSpoilageData = async (req: Request, res: Response) => {
  try {
    const activeShipments = await Shipment.find({});

    if (!activeShipments || activeShipments.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          summary: { activeShipments: 0, atRisk: 0, critical: 0, predictedLoss: 0, riskScore: 0 },
          attentionShipments: []
        }
      });
    }

    const shipmentRiskList = await Promise.all(
      activeShipments.map(async (shipment) => {
        const latestTelemetry = await Telemetry.findOne({ shipmentId: shipment.shipmentId })
          .sort({ timestamp: -1 });

        const currentTemp = latestTelemetry ? latestTelemetry.temperature : (shipment.currentTemp ?? 4.0);
        const currentHumidity = latestTelemetry ? latestTelemetry.humidity : (shipment.currentHumidity ?? 60.0);

        const maxAllowedTemp = parseMaxAllowedTemp(shipment.tempLimit, 5.0);
        const tempExcursion = Math.max(0, currentTemp - maxAllowedTemp);

        let calculatedRisk = 5;
        if (tempExcursion > 0) {
          calculatedRisk += Math.round(tempExcursion * 12);
        }

        if (shipment.healthIndex && shipment.healthIndex < 100 && shipment.healthIndex > 0) {
          calculatedRisk += Math.round((100 - shipment.healthIndex) * 0.4);
        }

        calculatedRisk = Math.min(Math.max(calculatedRisk, 5), 99);

        let status = 'MONITORING';
        let timeToCritical = '—';

        if (calculatedRisk >= 75 || shipment.aiRiskLevel === 'high') {
          status = 'CRITICAL';
          timeToCritical = '1h 24m';
        } else if (calculatedRisk >= 40 || shipment.aiRiskLevel === 'medium') {
          status = 'WARNING';
          timeToCritical = '3h 10m';
        }

        return {
          id: shipment.shipmentId,
          product: shipment.cargo || shipment.cargoType || 'Perishable Cargo',
          route: `${shipment.origin} – ${shipment.destination}`,
          riskScore: calculatedRisk,
          trend: tempExcursion > 0 ? 'Increasing' : 'Stable',
          timeToCritical,
          status,
          currentTemp,
          maxAllowedTemp,
          tempExcursion,
          currentHumidity
        };
      })
    );

    shipmentRiskList.sort((a, b) => b.riskScore - a.riskScore);

    const totalActive = shipmentRiskList.length;
    const criticalShipments = shipmentRiskList.filter((s) => s.status === 'CRITICAL');
    const warningShipments = shipmentRiskList.filter((s) => s.status === 'WARNING');
    const atRiskCount = criticalShipments.length + warningShipments.length;

    const totalRiskSum = shipmentRiskList.reduce((acc, s) => acc + s.riskScore, 0);
    const avgRiskScore = Math.round(totalRiskSum / (totalActive || 1));

    const focusShipment = shipmentRiskList[0];

    const tempExposurePct = Math.min(Math.round((focusShipment.tempExcursion / 4) * 100), 94);
    const humidityDevPct = Math.min(Math.round((focusShipment.currentHumidity / 100) * 80), 61);
    const delayDurationPct = Math.min(Math.round(focusShipment.riskScore * 0.5), 41);

    const responsePayload = {
      summary: {
        activeShipments: totalActive,
        atRisk: atRiskCount,
        critical: criticalShipments.length,
        predictedLoss: 18500,
        riskScore: avgRiskScore,
        riskScoreMax: 100,
        criticalShipmentsCount: criticalShipments.length,
        riskTrendPercent: avgRiskScore > 50 ? 23 : 5,
        confidence: 84,
        shipmentValueAtRisk: 1228918500
      },
      attentionShipments: shipmentRiskList.map(({ currentTemp, maxAllowedTemp, tempExcursion, currentHumidity, ...rest }) => rest),
      selectedShipmentRiskBreakdown: {
        shipmentId: focusShipment.id,
        factors: [
          { name: 'Temperature Exposure', percentage: Math.max(tempExposurePct, 15) },
          { name: 'Humidity Deviation', percentage: Math.max(humidityDevPct, 10) },
          { name: 'Delay Duration', percentage: Math.max(delayDurationPct, 5) }
        ],
        aiExplanation: {
          text: focusShipment.tempExcursion > 0
            ? `Shipment ${focusShipment.id} has exceeded its recommended threshold of ${focusShipment.maxAllowedTemp}°C. Because ${focusShipment.product.toLowerCase()} cargo is sensitive to temperature variations, ChillChain AI predicts elevated risk.`
            : `Shipment ${focusShipment.id} is operating safely within nominal limits.`,
          temperatureDelta: focusShipment.tempExcursion > 0 
            ? `+${focusShipment.tempExcursion.toFixed(1)}°C above safe range`
            : `Nominal safe temperature`,
          aiConfidence: 94
        }
      },
      riskEvolution: {
        timeline: [
          { time: 'Current', risk: focusShipment.riskScore },
          { time: 'In 1 Hour', risk: Math.min(focusShipment.riskScore + 9, 99) },
          { time: 'In 2 Hours', risk: Math.min(focusShipment.riskScore + 17, 99) }
        ],
        criticalThresholdHour: 1.4,
        predictedOutcome: focusShipment.riskScore > 70 
          ? 'High probability of quality degradation' 
          : 'Low to moderate risk',
        aiConfidence: 94
      },
      recommendedActions: {
        shipmentId: focusShipment.id,
        actions: [
          {
            title: 'Restore cooling immediately',
            description: `Maintain container temperature below ${focusShipment.maxAllowedTemp}°C.`
          },
          {
            title: 'Inspect refrigeration system',
            description: 'Verify thermal insulation and cooling performance.'
          },
          {
            title: 'Prioritize delivery',
            description: 'Reduce remaining transit exposure.'
          }
        ],
        estimatedLossAvoided: 14800
      }
    };

    res.status(200).json({ success: true, data: responsePayload });
  } catch (error: any) {
    console.error('Error fetching risk spoilage database metrics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipmentRiskBreakdown = async (req: Request, res: Response) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findOne({ shipmentId });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const latestTelemetry = await Telemetry.findOne({ shipmentId }).sort({ timestamp: -1 });
    const currentTemp = latestTelemetry ? latestTelemetry.temperature : (shipment.currentTemp ?? 4.0);
    const currentHumidity = latestTelemetry ? latestTelemetry.humidity : (shipment.currentHumidity ?? 60.0);
    const maxAllowedTemp = parseMaxAllowedTemp(shipment.tempLimit, 5.0);

    const tempExcursion = Math.max(0, currentTemp - maxAllowedTemp);

    const tempExposurePct = tempExcursion > 0 
      ? Math.min(98, Math.max(25, Math.round((tempExcursion / 4.0) * 100))) 
      : 12;

    const humidityDevPct = Math.min(95, Math.max(10, Math.round((Math.abs(currentHumidity - 60) / 30) * 100)));
    const delayDurationPct = Math.min(90, Math.max(15, Math.round((100 - (shipment.healthIndex ?? 100)) * 0.8 + 10)));

    const cargoName = (shipment.cargo || shipment.cargoType || 'perishable cargo').toLowerCase();
    
    const explanationText = tempExcursion > 0
      ? `Shipment ${shipment.shipmentId} has exceeded its recommended threshold of ${maxAllowedTemp}°C (current reading: ${currentTemp}°C). Because ${cargoName} cargo is sensitive to temperature variations, ChillChain AI predicts elevated risk.`
      : `Shipment ${shipment.shipmentId} is operating safely within its target limit of ${maxAllowedTemp}°C (current reading: ${currentTemp}°C). Relative humidity remains stable at ${currentHumidity}%.`;

    res.status(200).json({
      success: true,
      data: {
        shipmentId: shipment.shipmentId,
        factors: [
          { name: 'Temperature Exposure', percentage: tempExposurePct },
          { name: 'Humidity Deviation', percentage: humidityDevPct },
          { name: 'Delay Duration', percentage: delayDurationPct }
        ],
        aiExplanation: {
          text: explanationText,
          temperatureDelta: tempExcursion > 0 
            ? `+${tempExcursion.toFixed(1)}°C above safe range`
            : `Within safe range`,
          aiConfidence: 94
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching breakdown:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DYNAMIC RECOMMENDED ACTIONS CONTROLLER (PURE MONGODB)
export const getShipmentRecommendedActions = async (req: Request, res: Response) => {
  const { shipmentId } = req.params;

  try {
    const shipment = await Shipment.findOne({ shipmentId });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const latestTelemetry = await Telemetry.findOne({ shipmentId }).sort({ timestamp: -1 });
    const currentTemp = latestTelemetry ? latestTelemetry.temperature : (shipment.currentTemp ?? 4.0);
    const currentHumidity = latestTelemetry ? latestTelemetry.humidity : (shipment.currentHumidity ?? 60.0);
    const cargo = shipment.cargo || shipment.cargoType || 'Perishable Cargo';
    const origin = shipment.origin || 'Origin';
    const destination = shipment.destination || 'Destination';
    const tempLimit = shipment.tempLimit || '4.0°C';

    const tempExcursion = Math.max(0, currentTemp - 5.0);
    const dynamicLoss = Math.round(12500 + (tempExcursion * 2400) + (shipmentId.charCodeAt(shipmentId.length - 1) * 85));

    return res.status(200).json({
      success: true,
      data: {
        shipmentId,
        actions: [
          {
            title: `Restore cooling for ${cargo}`,
            description: `Current container temp is ${currentTemp}°C. Maintain reading below ${tempLimit} threshold.`
          },
          {
            title: "Inspect refrigeration unit",
            description: `Relative humidity is ${currentHumidity}%. Inspect HVAC compressor performance and door seals on ${origin} – ${destination} route.`
          },
          {
            title: "Prioritize transit dispatch",
            description: `Expedite shipment route from ${origin} to ${destination} to minimize transit exposure.`
          }
        ],
        estimatedLossAvoided: dynamicLoss
      }
    });
  } catch (error: any) {
    console.error('Error calculating recommended actions:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};