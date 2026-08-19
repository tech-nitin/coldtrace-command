import { Router } from 'express';
// Add .js to the import path
import { getMetrics, getShipments, getShipmentById } from '../controllers/shipment.controller.js';

const router = Router();

router.get('/metrics', getMetrics);
router.get('/', getShipments);
router.get('/:id', getShipmentById);

export default router;