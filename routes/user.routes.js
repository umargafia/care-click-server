import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getUserById, updateMe } from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserById);
router.patch('/', updateMe);

export default router;
