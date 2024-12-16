import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUserModal } from '../types/user';

export enum Role {
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  HR = 'hr',
}

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
    enum: Object.values(Role),
    default: Role.DEVELOPER,
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

userSchema.methods.generatePasswordResetToken = function (): string {
  // create randome 32bytes string (reset token).
  const resetToken = crypto.randomBytes(32).toString('hex');

  // create hash for that token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetToken = passwordResetToken;
  // only valid for 10 min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isPasswordChangedAfterLogin = function (
  jwtTimeStamp: number,
) {
  if (!this.passwordChangedAt) return false;

  const time = this.passwordChangedAt.getTime() as number;
  const changeTimeStamp: number = parseInt(`${time / 1000}`, 10);

  return jwtTimeStamp < changeTimeStamp;
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

export const User = mongoose.model<IUserModal>('User', userSchema);
