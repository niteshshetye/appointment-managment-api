import mongoose from 'mongoose';
import moment from 'moment';
import { IAppointmentModal } from '../types/appointment';
import { APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE } from '../utils/constants';

const appointmentSchema = new mongoose.Schema<IAppointmentModal>({
  manager_id: {
    type: mongoose.Schema.ObjectId,
    required: [
      true,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.MANAGER_ID_REQUIRED,
    ],
    ref: 'User',
  },
  title: {
    type: String,
    required: [
      true,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.TITLE_REQUIRED,
    ],
    minlength: [
      3,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.MIN_LENGTH_TITLE,
    ],
    maxlength: [
      300,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.MAX_LENGTH_TITLE,
    ],
    trim: true,
  },
  description: {
    type: String,
    required: [
      true,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.DESCRIPTION_REQUIRED,
    ],
  },
  appointment_date: {
    type: Date,
    required: [
      true,
      APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE.APPOINTMENT_DATE_REQUIRED,
    ],
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
