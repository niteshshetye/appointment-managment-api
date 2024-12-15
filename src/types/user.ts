import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUserModal extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt: Date;
  role: 'managers' | 'developer' | 'admin';
  photoUrl?: string;
  active?: boolean;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;

  generatePasswordResetToken(): string;

  isPasswordChangedAfterLogin(jwtTimeStamp: number): boolean;
}

export interface IReqUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface IReqWithVerifiedUser extends Request {
  user?: IReqUser;
}

export interface ITokenUserPaylod {
  id: string;
  email: string;
  iat?: number; // Issued at timestamp (optional, added by JWT by default)
  exp?: number; // Expiration timestamp (optional, added by JWT by default)
}
