import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '../model/user';
import { IUserModal } from '../types/user';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { signInJwt } from '../middleware/verifyToken';
import {
  forgotPasswordBodyValidation,
  resetPasswordBodyValidation,
  signinBodyValidation,
  signupBodyValidation,
} from '../validation/auth';

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await signupBodyValidation.parseAsync(req.body);

    const user: IUserModal = await User.create({
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      password: result.password,
      confirmPassword: result.confirmPassword,
    });

    const tokens = signInJwt({ id: user._id as string, email: user.email });

    return res.status(201).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          createdAt: user.createdAt,
        },
        ...tokens,
      },
    });
  },
);

const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await signinBodyValidation.parseAsync(req.body);

    const user: IUserModal | null = await User.findOne({
      email: result.email,
    }).select('+password');

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    const isPasswordMatched = await user.comparePassword(
      result.password,
      user.password,
    );

    if (!isPasswordMatched) {
      return next(new AppError(404, 'Invalid credentials'));
    }

    const tokens = signInJwt({ id: user._id as string, email: user.email });

    return res.status(201).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          createdAt: user.createdAt,
        },
        ...tokens,
      },
    });
  },
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await forgotPasswordBodyValidation.parseAsync(req.body);

    const user = await User.findOne({ email: result.email });

    if (!user) {
      return next(new AppError(404, 'User not found!'));
    }

    const passwordResetToken = user.generatePasswordResetToken();
    await user.save();

    // link to reset the token
    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${passwordResetToken}`;

    // TODO: send link via email

    res.status(200).json({ status: 'success', data: { resetLink } });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token: resetToken } = req.params;
    const result = await resetPasswordBodyValidation.parseAsync(req.body);

    // becuase we saved token in database hashed
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError(
          404,
          'Reset token is expired, please retry with new reset token',
        ),
      );
    }

    user.password = result.password;
    user.confirmPassword = result.confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    const tokens = signInJwt({ id: user._id as string, email: user.email });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          createdAt: user.createdAt,
        },
        ...tokens,
      },
    });
  },
);

export const authController = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
