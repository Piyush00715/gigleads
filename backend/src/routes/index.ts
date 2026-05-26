import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';
import analyticsRoutes from './analytics.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);

export default router;
