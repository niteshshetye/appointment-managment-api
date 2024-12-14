import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { User } from '../model/user';
import {
  IReqUser,
  IReqWithVerifiedUser,
  ITokenUserPaylod,
} from '../types/user';

export const signInJwt = (user: ITokenUserPaylod) => {
  const tokenSecret = process.env.JWT_SECRET || '';

  const access_token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    tokenSecret,
    { expiresIn: process.env.JWT_TOKEN_EXPIRESIN },
  );

  const refresh_token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    tokenSecret,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRESIN },
  );

  return { access_token, refresh_token };
};

export const verifyToken = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    // check headers authorization present or not
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    )
      return next(new AppError(401, 'Unathorized user'));

    // extract token
    const token = req.headers.authorization.split(' ')[1];

    // check token is present or not
    if (!token) return next(new AppError(401, 'Unathorized user'));

    // verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || '',
    ) as ITokenUserPaylod;

    // fetch user
    const user: IReqUser | null = await User.findById(payload.id, {
      active: true,
    });

    // check user present or not
    if (!user) return next(new AppError(404, 'User not found'));

    req.user = user;

    next();
  },
);
