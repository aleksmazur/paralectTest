import { z } from 'zod';

import { analyticsService } from 'services';
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
type Request = {
  params: {
    id: string;
    fullName: string;
  }
};

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  console.log(ctx.validatedData);
  const {
    title,
    description,
    imageUrl,
  } = ctx.validatedData;

  const image = await imageService.insertOne({
    title,
    description,
    imageUrl,
    userId: ctx.request.params?.id,
    author: ctx.request.params?.fullName,
  });

  console.log(image);

  analyticsService.track('New image added', {
    title,
  });

  ctx.body = imageService.getPublic(image);
}

export default (router: AppRouter) => {
  router.post('/images', validateMiddleware(schema), handler);
};
