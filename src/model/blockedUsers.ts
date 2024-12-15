import mongoose from 'mongoose';
import { IBlockedUsersModal } from '../types/blockedUsers';

const blockedUsersSchema = new mongoose.Schema<IBlockedUsersModal>({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  blocked_user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Blocked User is required'],
  },
  createdAt: { type: Date, default: Date.now() },
});

export const BlockedUsers = mongoose.model<IBlockedUsersModal>(
  'BlockedUsers',
  blockedUsersSchema,
);
