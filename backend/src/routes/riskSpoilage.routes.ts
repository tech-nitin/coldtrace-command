// backend/src/routes/riskSpoilage.routes.ts
import { Router } from 'express';
import { 
  getRiskSpoilageData, 
  getShipmentRiskBreakdown, 
  getShipmentRecommendedActions 
} from '../controllers/riskSpoilage.controller';

const router = Router();

router.get('/analytics/risk-spoilage', getRiskSpoilageData);
router.get('/analytics/risk-breakdown/:shipmentId', getShipmentRiskBreakdown);
router.get('/analytics/recommended-actions/:shipmentId', getShipmentRecommendedActions);

export default router;