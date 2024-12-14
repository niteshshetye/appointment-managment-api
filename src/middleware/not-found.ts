import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(404, `Can't find ${req.originalUrl} on this server!`),
  );
};
