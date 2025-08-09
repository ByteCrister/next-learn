import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name is required' }),
  currentPassword: z
    .string()
    .optional(),
  newPassword: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/[A-Z]/, { message: 'Include at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Include at least one lowercase letter' })
    .regex(/\d/,     { message: 'Include at least one number' })
    .regex(/[\W_]/,  { message: 'Include at least one special character' }),
});

export type ProfileForm = z.infer<typeof profileSchema>;
