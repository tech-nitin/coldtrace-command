import { Router } from 'express';
import { getDevicesOverview, createDevice } from '../controllers/device.controller.js';

const router = Router();

router.get('/devices/overview', getDevicesOverview);
router.post('/devices', createDevice);

export default router;