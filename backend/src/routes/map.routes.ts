import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// GET /api/v1/map/directions?origin=...&destination=...
router.get('/directions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      res.status(400).json({ success: false, message: 'Origin and Destination are required.' });
      return;
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin as string
    )}&destination=${encodeURIComponent(destination as string)}&key=${apiKey}`;

    const response = await axios.get(url);
    res.status(200).json({ success: true, data: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;