// backend/src/routes/storage.routes.ts
import { Router } from 'express';
import { getStorageOverview, createStorageZone } from '../controllers/storage.controller';

const router = Router();

router.get('/storage/overview', getStorageOverview);
router.post('/storage/zones', createStorageZone);

export default router;