import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getAllDoctors,
  searchDoctor,
  getDoctorById,
} from '../controllers/doctor.controller.js';

const router = express.Router();

router.use(protect);

router
  .get('/all', getAllDoctors)
  .get('/search', searchDoctor)
  .get('/:id', getDoctorById);

export default router;
