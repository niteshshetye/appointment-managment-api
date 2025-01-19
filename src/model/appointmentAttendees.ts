import mongoose from 'mongoose';
import moment from 'moment';
import { IAppointmentAttendeesModal } from '../types/appointmentAttendees';
import {
  APPOINTMENT_ATTENDEES_SCHEMA_DATABASE_VALIDATION_MESSAGE,
  APPOINTMENT_STATUS,
} from '../utils/constants';

const appointmentAttendeesSchema =
  new mongoose.Schema<IAppointmentAttendeesModal>({
    appointment_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [
        true,
        APPOINTMENT_ATTENDEES_SCHEMA_DATABASE_VALIDATION_MESSAGE.APPOINTMENT_ID_REQUIRED,
      ],
    },
    developer_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [
        true,
        APPOINTMENT_ATTENDEES_SCHEMA_DATABASE_VALIDATION_MESSAGE.DEVELOPER_ID_REQUIRED,
      ],
    },
    createdby: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [
        true,
        APPOINTMENT_ATTENDEES_SCHEMA_DATABASE_VALIDATION_MESSAGE.CREATED_BY_REQUIRED,
      ],
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUS,
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
