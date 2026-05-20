import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth';

const router = Router();
const controller = new AnalyticsController();

router.get('/summary', protect, controller.getSummary);

export default router;
