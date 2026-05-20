import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
