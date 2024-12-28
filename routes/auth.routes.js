import express from 'express';
import {
  registerUser,
  loginUser,
  registerDoctor,
  loginDoctor,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/doctor', registerDoctor);

router.post('/login/user', loginUser);
router.post('/login/doctor', loginDoctor);

export default router;
