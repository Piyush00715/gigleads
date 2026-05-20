import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';

const router = Router();
const controller = new LeadController();

router.use(protect);

router.get('/', validate(leadQuerySchema), controller.getLeads);
router.get('/export', controller.exportCSV);
router.post('/', validate(createLeadSchema), controller.createLead);

router.route('/:id')
  .get(controller.getLeadById)
  .put(validate(updateLeadSchema), controller.updateLead)
  .delete(restrictTo('Admin'), controller.deleteLead);

export default router;
