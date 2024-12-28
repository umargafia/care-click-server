import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    status: 'success',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

export const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, specialization } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  if (await Doctor.findOne({ email })) {
    res.status(400);
    throw new Error('Doctor already exists');
  }

  const doctor = await Doctor.create({
    name,
    email,
    password,
    specialization,
  });

  res.status(201).json({
    status: 'success',
    data: {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id),
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    status: 'success',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

export const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email }).select('+password');

  if (!doctor || !(await doctor.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    status: 'success',
    data: {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id),
    },
  });
});
