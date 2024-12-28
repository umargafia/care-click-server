import Doctor from '../models/doctor.model.js';
import asyncHandler from 'express-async-handler';

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find();
  res.status(200).json({
    status: 'success',
    total: doctors.length,
    data: doctors,
  });
});

export const searchDoctor = asyncHandler(async (req, res) => {
  const query = req.query.query;

  const doctors = await Doctor.find({
    name: { $regex: query.toString(), $options: 'i' },
  });
  res.status(200).json({
    status: 'success',
    total: doctors.length,
    data: doctors,
  });
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404).json({
      status: 'error',
      message: 'Doctor not found',
    });
  }
  
  res.status(200).json( {
    status: 'success',
    data: doctor,
  });
});
