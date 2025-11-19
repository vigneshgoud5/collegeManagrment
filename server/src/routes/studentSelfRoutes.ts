import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/studentSelfController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  updateStudentContactValidation,
  changePasswordValidation,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

router.get('/me', requireAuth, requireRole('student'), getMe);
router.put('/me', requireAuth, requireRole('student'), updateStudentContactValidation, handleValidationErrors, updateMe);
router.put('/me/password', requireAuth, requireRole('student'), changePasswordValidation, handleValidationErrors, changePassword);

export default router;


