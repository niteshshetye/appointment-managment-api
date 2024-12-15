import mongoose from 'mongoose';

export interface IAppointmentAttendeesModal {
  appointment_id: typeof mongoose.Schema.ObjectId;
  developer_id: typeof mongoose.Schema.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'DECLIEND';
  response_date?: Date;
}
