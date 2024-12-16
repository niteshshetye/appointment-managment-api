import { z } from 'zod';
import { Role } from '../model/user';

export const assigneRoleBodyValidation = z.object({
  userId: z.string({ message: 'User is required to assigne role' }),
  role: z.enum([Role.DEVELOPER, Role.MANAGER, Role.HR], {
    message: 'Role must be one of developer, managers or admin',
  }),
});
