import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const doctor = await Doctor.findById(decoded.id);
      if (!doctor) {
        res.status(401);
        throw new Error('Not authorized');
      }
      req.user = doctor;
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Not authorized to access this route');
    }
    next();
  };
};
