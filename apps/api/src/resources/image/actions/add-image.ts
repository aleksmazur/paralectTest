import { z } from 'zod';

import { analyticsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';
import { imageService, Image } from 'resources/image';
import { userService } from 'resources/user';

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

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;
  
  ctx.assertClientError(file, {
    global: 'File cannot be empty',
  });
  
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
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
    userId: ctx.state.user._id,
    author: ctx.state.user.fullName,
  });

  console.log(image);

  analyticsService.track('New image added', {
    title,
  });
  const { user } = ctx.state;
  
  const updatedUser = await userService.updateOne(
    { _id: user._id },
    () => ({ usersImages: [...user.usersImages, image] }),
  );

  ctx.body = imageService.getPublic(image);
  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.post('/add-image', validateMiddleware(schema), validator, handler);
};
