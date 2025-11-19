import { Router } from 'express';
import { requireAuth, requireRole, requireAdministrative } from '../middleware/auth.js';
import { listStudents, getStudent, createStudent, updateStudent, toggleStatus, softDeleteStudent, deleteStudent } from '../controllers/academicStudentsController.js';
import {
  idParamValidation,
  createStudentValidation,
  updateStudentValidation,
  toggleStatusValidation,
  searchQueryValidation,
  departmentQueryValidation,
  yearQueryValidation,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

router.use(requireAuth, requireRole('academic'));

router.get('/', searchQueryValidation, departmentQueryValidation, yearQueryValidation, handleValidationErrors, listStudents);
router.get('/:id', idParamValidation, handleValidationErrors, getStudent);
// Create and update - only for administrators
router.post('/', requireAdministrative(), createStudentValidation, handleValidationErrors, createStudent);
router.put('/:id', requireAdministrative(), idParamValidation, updateStudentValidation, handleValidationErrors, updateStudent);
// Toggle status - available to all academic users
router.patch('/:id/status', idParamValidation, toggleStatusValidation, handleValidationErrors, toggleStatus);
// Delete - only for administrators
router.delete('/:id', requireAdministrative(), idParamValidation, handleValidationErrors, deleteStudent);

export default router;


