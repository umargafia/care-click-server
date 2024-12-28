import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time, type } = req.body;
  
  const appointment = await Appointment.create({
    doctor: doctorId,
    patient: req.user._id,
    date,
    time,
    type
  });

  res.status(201).json(appointment);
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate('patient', 'name email')
    .sort({ date: 1, time: 1 });

  res.json(appointments);
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('doctor', 'name specialization')
    .sort({ date: 1, time: 1 });

  res.json(appointments);
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  await appointment.save();

  res.json(appointment);
});

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find();
  res.status(200).json({
    status: 'success',
    total: doctors.length,
    data: doctors
  });
});

export const searchDoctor = asyncHandler(async (req, res) => {
  const query = req.query.query;
  console.log(query);

  const doctors = await Doctor.find({ name: { $regex: query.toString(), $options: 'i' } });
  res.status(200).json({
    status: 'success',
    total: doctors.length,
    data: doctors
  });
});