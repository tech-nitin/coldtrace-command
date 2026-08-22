import { Router } from 'express';
// Add createShipment to controller imports
import { 
  getMetrics, 
  getShipments, 
  getShipmentById, 
  createShipment 
} from '../controllers/shipment.controller.js';

const router = Router();

router.get('/metrics', getMetrics);
router.get('/', getShipments);
router.get('/:id', getShipmentById);

// POST route to insert new shipments into MongoDB
router.post('/', createShipment);

export default router;