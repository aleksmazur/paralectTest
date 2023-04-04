import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import imageService from '../image.service';

const schema = z.object({
  id: z.string(),
  raiting: z.number(),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isImageExists = await imageService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isImageExists, 'Image not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { id, raiting } = ctx.validatedData;

  const updatedImage = await imageService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ raiting }),
  );

  ctx.body = imageService.getPublic(updatedImage);
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
