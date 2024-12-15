import mongoose from 'mongoose';

export interface IAppointmentModal {
  manager_id: typeof mongoose.Schema.ObjectId;
  title: string;
  description: string;
  appointment_date: Date;
  createdAt: Date;
  modifiedAt: Date;
}
