import express from 'express';
import { protect,  } from '../middleware/auth.middleware.js';
import {
  getAllDoctors,
  searchDoctor
} from '../controllers/doctor.controller.js';

const router = express.Router();

router.use(protect);

router.get('/all', getAllDoctors);
router.get('/search', searchDoctor);

export default router;