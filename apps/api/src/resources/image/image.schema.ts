import { z } from 'zod';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  lastRequest: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  imageUrl: z.string(),
  author: z.string(),
  raiting: z.number().optional().default(0),
}).strict();

export default schema;
