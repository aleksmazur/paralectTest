import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
const imageSchema = z.object({
  _id: z.string(),
  imageUrl: z.string(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  author: z.string().optional(),
});

const schema = z.object({
  usersImages: z.array(imageSchema).optional(),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isUserExists = await userService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { usersImages } = ctx.validatedData;

  const updatedUser = await userService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ usersImages }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
