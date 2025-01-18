import { NextFunction, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { IReqWithVerifiedUser } from '../types/user';
import { AppError } from '../utils/AppError';
import { AppointmentAttendees } from '../model/appointmentAttendees';
import { getSkip } from '../utils/utility';
import { APPOINTMENT_STATUS } from '../utils/constants';

export const getMyAppointment = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'You are not authorized'));

    const { page = 1, limit = 10 }: { page?: number; limit?: number } =
      req.query;

    const skip = getSkip(page, limit);

    const queryObj = {
      developer_id: req.user._id,
    };

    const appointments = await AppointmentAttendees.find(queryObj)
      .skip(skip)
      .limit(limit);

    const appointmentCount =
      await AppointmentAttendees.countDocuments(queryObj);

    return res.status(200).json({
      message: 'success',
      data: { appointments },
      totalCount: appointmentCount,
    });
  },
);

export const updateAppointmentStatus = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'You are not authorized'));

    const { id } = req.params;
    const { status } = req.body;

    if (!APPOINTMENT_STATUS.includes(status))
      return next(
        new AppError(
          404,
          status ? `${status} is not valid status` : 'Please select a status',
        ),
      );

    const appointment = await AppointmentAttendees.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    return res.status(200).json({ message: 'success', data: { appointment } });
  },
);
