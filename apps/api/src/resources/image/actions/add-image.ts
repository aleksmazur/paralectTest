import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { imageService, Image } from 'resources/image';

const schema = z.object({
  title: z.string().min(1, 'Please enter Title').max(100),
  description: z.string().min(1, 'Please enter Description').max(100),
  imageUrl: z.string().min(1, 'Please enter image url'),
  userId: z.string(),
  author: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  image: Image;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    title,
    description,
    imageUrl,
  } = ctx.validatedData;

  const image = await imageService.insertOne({
    title,
    description,
    imageUrl,
    userId: ctx.state.user._id,
    author: ctx.state.user.fullName,
  });

  ctx.body = imageService.getPublic(image);
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
