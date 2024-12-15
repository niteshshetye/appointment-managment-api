import mongoose from 'mongoose';

export interface IBlockedUsersModal {
  user_id: typeof mongoose.Schema.ObjectId;
  blocked_user_id: typeof mongoose.Schema.ObjectId;
  createdAt: Date;
}
