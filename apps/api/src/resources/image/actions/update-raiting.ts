import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { imageService, Image } from 'resources/image';

const schema = z.object({
  _id: z.string(),
  raiting: z.number(),
});

interface ValidatedData extends z.infer<typeof schema> {
  image: Image;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const image = await imageService.findOne({ _id: ctx.validatedData._id });
  
  if (!image) return ctx.body = {};
  
  ctx.validatedData.image = image;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {

  const updatedImage = await imageService.updateOne({
    _id: ctx.validatedData.image._id,
  }, () => ({
    raiting: ctx.validatedData.image.raiting + 1,
  }));

  ctx.body = imageService.getPublic(updatedImage);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), validator, handler);
};
