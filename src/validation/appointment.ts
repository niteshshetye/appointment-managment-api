import { z } from 'zod';

export const createAppointmentBodyValidation = z.object({
  title: z.string({ message: 'Title is required' }),
  description: z.string({ message: 'Description is required' }),
  appointment_date: z.string({ message: 'Appointment date is required' }),
  developer_ids: z
    .string({ message: 'Developers are required for appointment' })
    .array()
    .min(1, 'Atleast one developer associated with appointment'),
});

export const updateAppointmentBodyValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  appointment_date: z.string().optional(),
});
