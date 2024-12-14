import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const allowedRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user?.role || '')) {
      next(new AppError(403, 'You dont have permission'));
    }
  };
};
