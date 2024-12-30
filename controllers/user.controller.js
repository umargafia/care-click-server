import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
