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
      return next(new AppError(404, 'User not found!'));
    }

    return res
      .status(200)
      .json({ status: 'success', message: 'Role upgraded' });
  },
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 }: { page?: number; limit?: number } = req.query;
  // TODO fetch users role vise
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await User.countDocuments();

  return res
    .status(200)
    .json({ status: 'success', data: { users, totalCount: count } });
});

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return next(new AppError(400, 'Invalid params'));
    }

    await User.findByIdAndUpdate(userId, { active: false });

    return res
      .status(204)
      .json({ status: 'sucess', data: { message: 'User deleted' } });
  },
);
