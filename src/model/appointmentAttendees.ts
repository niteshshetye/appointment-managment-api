import mongoose from 'mongoose';
import { IAppointmentAttendeesModal } from '../types/appointmentAttendees';

const appointmentAttendeesSchema =
  new mongoose.Schema<IAppointmentAttendeesModal>({
    appointment_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment id is required'],
    },
    developer_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Developer is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLIEND'],
      default: 'PENDING',
    },
    response_date: Date,
  });

export const AppointmentAttendees = mongoose.model<IAppointmentAttendeesModal>(
  'AppointmentAttendees',
  appointmentAttendeesSchema,
);
