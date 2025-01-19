import mongoose from 'mongoose';
import { IBlockedUsersModal } from '../types/blockedUsers';
import { BLOCKED_USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE } from '../utils/constants';

const blockedUsersSchema = new mongoose.Schema<IBlockedUsersModal>({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [
      true,
      BLOCKED_USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.USER_ID_REQUIRED,
    ],
  },
  blocked_user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [
      true,
      BLOCKED_USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.BLOCKED_USER_ID_REQUIRED,
    ],
  },
  createdAt: { type: Date, default: Date.now() },
});

export const BlockedUsers = mongoose.model<IBlockedUsersModal>(
  'BlockedUsers',
  blockedUsersSchema,
);
