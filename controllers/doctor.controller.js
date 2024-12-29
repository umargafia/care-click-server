import Doctor from '../models/doctor.model.js';
import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointment.model.js';

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

  // Get all appointments for the doctor from start to end of current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor: req.params.id,
    time: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).select('time');

  // Create array of all time slots
  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
  ];

  // Mark slots as unavailable if there's an appointment
  appointments.forEach((appt) => {
    const apptTime = appt.time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const slot = timeSlots.find((slot) => slot.time === apptTime);
    if (slot) {
      slot.available = false;
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      doctor,
      availableSlots: timeSlots,
    },
  });
});
