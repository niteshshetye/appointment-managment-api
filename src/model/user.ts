import mongoose, { Query, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUserModal } from '../types/user';
import { USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE } from '../utils/constants';

export enum Role {
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  HR = 'hr',
}

const userSchema = new Schema<IUserModal>({
  firstname: {
    type: String,
    required: [
      true,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.FIRST_NAME_REQUIRED,
    ],
  },
  lastname: {
    type: String,
    required: [
      true,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.LAST_NAME_REQUIRED,
    ],
  },
  email: {
    type: String,
    required: [true, USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.EMAIL_REQUIRED],
    unique: true,
    trim: true,
    validate: [
      validator.isEmail,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.EMAIL_VALIDATE,
    ],
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.DEVELOPER,
  },
  password: {
    type: String,
    required: [
      true,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.PASSWORD_REQUIRED,
    ],
    minlength: [
      3,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.MIN_LENGTH_PASSWORD,
    ],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [
      true,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.CONFIRM_PASSWORD_REQUIRED,
    ],
    minlength: [
      3,
      USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.MIN_LENGTH_CONFIRM_PASSWORD,
    ],
    validate: {
      message:
        USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE.VALIDATE_CONFIRM_PASSWORD,
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

userSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('countDocuments', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

export const User = mongoose.model<IUserModal>('User', userSchema);
