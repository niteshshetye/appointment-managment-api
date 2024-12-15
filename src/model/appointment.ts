import mongoose from 'mongoose';
import { IAppointmentModal } from '../types/appointment';

const appointmentSchema = new mongoose.Schema<IAppointmentModal>({
  manager_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Appointment should have manager'],
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title should atleast contain 3 characters long'],
    maxlength: [300, 'Title should not more than contain 300 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  appointment_date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Appointment = mongoose.model<IAppointmentModal>(
  'Appointment',
  appointmentSchema,
);
