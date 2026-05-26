import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(protect);

router.put('/me', userController.updateMe);

export default router;
