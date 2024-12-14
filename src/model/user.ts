import mongoose, { Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { IUserModal } from '../types/user';

const userSchema = new Schema<IUserModal>({
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is requried'],
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Provide valid email'],
  },
  role: {
    type: String,
    enum: ['managers', 'developer', 'admin'],
    default: 'developer',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [3, 'Password must be atleast 3 char long'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required'],
    minlength: [3, 'Confirm password must be atleast 3 char long'],
    validate: {
      message: 'Password does not match with confirm password',
      validator: function (value: string): boolean {
        return value === this.password; // this will only run when we save
      },
    },
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photoUrl: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// instance methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// query middelware
userSchema.pre('save', async function (next) {
  // if password is not modified than dont do anything
  if (!this.isModified('password')) return next();

  // if document is not new
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

export const User: Model<IUserModal> = mongoose.model<IUserModal>(
  'User',
  userSchema,
);
