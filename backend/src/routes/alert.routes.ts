import { Router, Request, Response } from 'express';
import { Alert } from '../models/Alert.js';

const router = Router();

// GET /api/v1/alerts - Fetch active alerts
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await Alert.find({ status: 'ACTIVE' }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/alerts/:id/resolve - Resolve an alert
router.patch('/:id/resolve', async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'RESOLVED', resolvedAt: new Date(), resolvedBy: req.body.resolvedBy || 'Operator' },
      { new: true }
    );
    res.status(200).json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;