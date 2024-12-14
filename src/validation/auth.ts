import { z } from 'zod';

// Define Zod schema for validation
export const signupBodyValidation = z.object({
  firstname: z.string({ message: 'Firstname is required' }),
  lastname: z.string({ message: 'Lastname is required' }),
  email: z
    .string({ message: 'Email is required' })
    .email('Provide a valid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(3, 'Password must be at least 3 characters long'),
  confirmPassword: z
    .string({ message: 'Confirm password is required' })
    .min(3, 'Confirm password must be at least 3 characters long'),
});

export const signinBodyValidation = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email('Provide a valid email'),
  password: z.string({ message: 'Password is required' }),
});
