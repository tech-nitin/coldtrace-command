import { Router } from 'express';
import Shipment from '../models/Shipment.js';
import { Telemetry } from '../models/Telemetry.js';
import { analyzeShipmentRisk } from '../services/ai.service.js';
import { getAIInsightsData } from '../controllers/ai.controller.js';

const router = Router();

// GET /api/v1/ai-insights (Powers AIInsightsPage.tsx)
router.get('/', getAIInsightsData);

// GET /api/v1/ai-insights/analyze/:shipmentId (Single shipment analysis)
router.get('/analyze/:shipmentId', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findOne({ shipmentId });
    const telemetry = await Telemetry.findOne({ shipmentId }).sort({ timestamp: -1 });

    if (!shipment || !telemetry) {
      return res.status(404).json({ success: false, message: 'Shipment data not found' });
    }

    const aiAnalysis = await analyzeShipmentRisk({
      shipmentId,
      temperature: telemetry.temperature,
      humidity: telemetry.humidity,
      maxTemp: shipment.thresholds.maxTemp,
    });

    res.status(200).json({ success: true, data: aiAnalysis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;