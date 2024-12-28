import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js';

const router = express.Router();

router.use(protect);

router.post('/create', createAppointment);
router.get('/doctor/:id',  getDoctorAppointments);
router.get('/patient', getPatientAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
