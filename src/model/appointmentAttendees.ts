import mongoose from 'mongoose';
import moment from 'moment';
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
    response_date: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          // Ensure the date is in a valid ISO format
          return moment(value, moment.ISO_8601, true).isValid();
        },
        message: (props) => `${props.value} is not a valid ISO date!`,
      },
    },
  });

export const AppointmentAttendees = mongoose.model<IAppointmentAttendeesModal>(
  'AppointmentAttendees',
  appointmentAttendeesSchema,
);
