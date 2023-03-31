import { z } from 'zod';
import { promiseUtil } from 'utils';

import { analyticsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
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
  
  const { results: images } = await imageService.find({}, {
    page: 1,
    perPage: 20,
  });

  const userIds = await userService.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (userId: string) => userService.atomic.updateOne(
    { _id: userId },
    { $set: { usersImages: images } },
  );

  await promiseUtil.promiseLimit(userIds, 50, updateFn);

  ctx.body = imageService.getPublic(image);
  ctx.redirect('/my-images');
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
