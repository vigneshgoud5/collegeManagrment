import { Router } from 'express';
import { requireAuth, requireRole, requireAdministrative } from '../middleware/auth.js';
import { listFaculty, getFaculty, createFaculty, updateFaculty, toggleFacultyStatus, deleteFaculty } from '../controllers/facultyController.js';
import {
  idParamValidation,
  createFacultyValidation,
  updateFacultyValidation,
  toggleStatusValidation,
  searchQueryValidation,
  departmentQueryValidation,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

// All routes require authentication and academic role
router.use(requireAuth, requireRole('academic'));

// List and get faculty - available to all academic users
router.get('/', searchQueryValidation, departmentQueryValidation, handleValidationErrors, listFaculty);
router.get('/:id', idParamValidation, handleValidationErrors, getFaculty);

// Create, update, toggle status, and delete - only for administrators
router.post('/', requireAdministrative(), createFacultyValidation, handleValidationErrors, createFaculty);
router.put('/:id', requireAdministrative(), idParamValidation, updateFacultyValidation, handleValidationErrors, updateFaculty);
router.patch('/:id/status', requireAdministrative(), idParamValidation, toggleStatusValidation, handleValidationErrors, toggleFacultyStatus);
router.delete('/:id', requireAdministrative(), idParamValidation, handleValidationErrors, deleteFaculty);

export default router;

