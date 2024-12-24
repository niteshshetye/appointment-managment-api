import { NextFunction, Response } from 'express';
import { Appointment } from '../model/appointment';
import { AppointmentAttendees } from '../model/appointmentAttendees';
import { IReqWithVerifiedUser } from '../types/user';
import {
  createAppointmentBodyValidation,
  updateAppointmentBodyValidation,
} from '../validation/appointment';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { todaysDate } from '../utils/utility';
import mongoose from 'mongoose';

export const createAppointment = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }

    // verify body with zod
    const result = await createAppointmentBodyValidation.parseAsync(req.body);

    // TODO we need to filter out if developer blocked manager
    // if so we filter out that user and create with others
    // but with that we have to some how notifiy to manager that
    // we have not invited to this particular developer becuase he had blocked you

    // create appointment
    const appointment = await Appointment.create({
      title: result.title,
      description: result.description,
      manager_id: req.user._id,
      appointment_date: new Date(result.appointment_date),
    });

    // create appointment attendees
    const payload = result.developer_ids.map((developer_id) => ({
      developer_id,
      appointment_id: appointment._id,
      createdby: req.user?._id || '',
    }));

    await AppointmentAttendees.create(payload);

    // TODO send email to developer with manager

    return res
      .status(201)
      .json({ status: 'success', data: { message: 'Appointment created!' } });
  },
);

export const getAppointments = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    // TODO add pagination
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }

    const appointment_date = req.body.appointment_date
      ? new Date(req.body.appointment_date)
      : new Date(todaysDate());

    const filterObj = {
      manager_id: req.user,
      appointment_date: { $eq: appointment_date },
    };

    const appointments = await Appointment.find(filterObj);

    const count = await Appointment.countDocuments(filterObj);

    res
      .status(200)
      .json({ status: 'success', data: { appointments, totalCount: count } });
  },
);

export const updateAppointment = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }
    const { id } = req.params;
    const result = await updateAppointmentBodyValidation.parseAsync(req.body);

    if (!Object.keys(result).length) {
      return next(new AppError(400, 'Invalid payload'));
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, manager_id: req.user._id },
      result,
      {
        new: true,
      },
    );

    if (!appointment) {
      return next(
        new AppError(403, 'You can only update appointment created by you'),
      );
    }

    res.status(200).json({ status: 'success', data: { appointment } });
  },
);

export const deleteAppointment = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }
    const { id } = req.params;

    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      manager_id: req.user._id,
    });

    if (!appointment) {
      return next(
        new AppError(403, 'You can only delete appointment created by you'),
      );
    }

    await AppointmentAttendees.deleteMany({
      appointment_id: id,
    });

    res
      .status(204)
      .json({ status: 'success', data: { message: 'Appointment deleted' } });
  },
);

export const getAppointment = catchAsync(
  async (req: IReqWithVerifiedUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }

    const { id } = req.params;

    const [appointment] = await Appointment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'appointmentattendees',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'appointment_attendees',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'developer_id',
                foreignField: '_id',
                as: 'developer_details',
              },
            },
            {
              $project: {
                'developer_details.password': 0,
                'developer_details._id': 0,
                'developer_details.confirmPassword': 0,
                'developer_details.createdAt': 0,
                'developer_details.modifiedAt': 0,
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    {
                      $arrayElemAt: ['$developer_details', 0],
                    },
                    '$$ROOT',
                  ],
                },
              },
            },
            {
              $project: {
                developer_details: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'manager_id',
          foreignField: '_id',
          as: 'manager_details',
        },
      },
      {
        $project: {
          'manager_details.password': 0,
          'manager_details.confirmPassword': 0,
          'manager_details.createdAt': 0,
          'manager_details.modifiedAt': 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$manager_details', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          manager_details: 0,
        },
      },
    ]);

    if (!appointment) {
      return next(new AppError(404, 'No appointment found for this id'));
    }

    res.status(200).json({ status: 'success', data: { appointment } });
  },
);
