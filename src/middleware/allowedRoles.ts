import { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { IReqWithVerifiedUser } from '../types/user';

export const allowedRoles = (...roles: string[]) => {
  return (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user?.role || '')) {
      next(new AppError(403, 'You dont have permission'));
    }

    next();
  };
};
