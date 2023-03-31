import { z } from 'zod';

const imageSchema = z.object({
  _id: z.string(),
  imageUrl: z.string(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  author: z.string().optional(),
});

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  lastRequest: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  passwordHash: z.string().nullable().optional(),
  signupToken: z.string().nullable().optional(),
  resetPasswordToken: z.string().nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  avatarUrl: z.string().nullable().optional(),
  oauth: z.object({
    google: z.boolean().default(false),
  }).optional(),
  usersImages: z.array(imageSchema).optional(),
}).strict();

export default schema;
