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
import { Email } from '../utils/Email';

const sendTokenInResponse = (
  user: IUserModal,
  res: Response,
  status: number,
) => {
  const tokens = signInJwt({ id: user._id as string, email: user.email });

  return res.status(status).json({
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
};

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

    const homeRouteLink = `${req.protocol}://${req.get('host')}`;

    const email = new Email(
      { email: user.email, firstname: user.firstname },
      homeRouteLink,
    );

    email
      .sendWelcome()
      .catch((error) => console.log('error while sending email', error));

    sendTokenInResponse(user, res, 201);
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

    sendTokenInResponse(user, res, 200);
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

    try {
      const email = new Email(
        { email: user.email, firstname: user.firstname },
        resetLink,
      );
      await email.sendResetPassword();
      return res
        .status(200)
        .json({ status: 'success', message: 'Link send to your email' });
    } catch (error) {
      console.log(error);
      return next(
        new AppError(
          500,
          'Something went wrong while sending email! please try again.',
        ),
      );
    }
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

    sendTokenInResponse(user, res, 200);
  },
);

export const authController = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
