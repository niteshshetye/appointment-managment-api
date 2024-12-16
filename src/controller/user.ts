import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { assigneRoleBodyValidation } from '../validation/user';
import { User } from '../model/user';
import { AppError } from '../utils/AppError';

export const updateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await assigneRoleBodyValidation.parseAsync(req.body);

    const user = await User.findByIdAndUpdate(result.userId, {
      role: result.role,
    });

    if (!user) {
      return next(new AppError(400, 'User not found!'));
    }

    return res
      .status(200)
      .json({ status: 'success', message: 'Role upgraded' });
  },
);
