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

router.post('/', createAppointment);
router.get('/doctor', restrictTo('doctor'), getDoctorAppointments);
router.get('/patient', restrictTo('patient'), getPatientAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;