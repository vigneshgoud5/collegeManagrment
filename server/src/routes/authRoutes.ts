import { Router } from 'express';
import { login, logout, refresh, register, changePassword, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  authRateLimiter,
  registerRateLimiter,
} from '../middleware/security.js';
import {
  loginValidation,
  registerValidation,
  changePasswordValidation,
  updateAcademicProfileValidation,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

router.post('/register', registerRateLimiter, registerValidation, handleValidationErrors, register);
router.post('/login', authRateLimiter, loginValidation, handleValidationErrors, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.put('/password', requireAuth, changePasswordValidation, handleValidationErrors, changePassword);
router.put('/profile', requireAuth, updateAcademicProfileValidation, handleValidationErrors, updateProfile);

export default router;


