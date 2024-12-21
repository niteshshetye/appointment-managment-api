import mongoose from 'mongoose';
import moment from 'moment';
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
    validate: {
      validator: function (value: Date) {
        // Ensure the date is in a valid ISO format
        return moment(value, moment.ISO_8601, true).isValid();
      },
      message: (props: any) => `${props.value} is not a valid ISO date!`,
    },
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
