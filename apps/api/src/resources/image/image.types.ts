import { z } from 'zod';

import schema from './image.schema';

export type Image = z.infer<typeof schema>;
