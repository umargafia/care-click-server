import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';

export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, time } = req.body;

  if (!doctorId || !time) {
    return res.status(400).json({
      status: 'error',
      message: 'Doctor ID and time are required',
    });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({
      status: 'error',
      message: 'Doctor not found',
    });
  }

  const isDoctorAvailable = await Appointment.findOne({
    doctor: doctorId,
    time,
  });

  if (isDoctorAvailable) {
    return res.status(400).json({
      status: 'error',
      message: 'Doctor is not available at this time',
    });
  }

  const appointment = await Appointment.create({
    doctor: doctorId,
    patient: req.user._id,
    time,
  });

  res.status(201).json({
    status: 'success',
    data: appointment,
  });
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Get all appointments for the doctor from start to end of current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor: id,
    time: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .populate('patient', 'name email')
    .sort({ time: -1 });

  res.status(200).json({
    status: 'success',
    total: appointments.length,
    data: appointments,
  });
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  //get the appointments of the patient for the current day
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('doctor', 'name specialization')
    .sort({ date: 1, time: 1 })
    .limit(limit);

  res.json({
    status: 'success',
    total: appointments.length,
    data: appointments,
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found',
    });
  }

  appointment.status = status;
  await appointment.save();

  res.json({
    status: 'success',
    data: appointment,
  });
});
