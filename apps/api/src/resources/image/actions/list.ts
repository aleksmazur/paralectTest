import { z } from 'zod';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { imageService } from 'resources/image';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    raiting: z.string(),
  }).default({ raiting: 'desc' }),
  filter: z.object({
    createdOn: z.object({
      sinceDate: z.string(),
      dueDate: z.string(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & {
  sort: { [name: string]: SortDirection };
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, filter,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const images = await imageService.find(
    {
      $and: [
        {
          $or: [
            { title: { $regex: regExp } },
            { description: { $regex: regExp } },
          ],
        },
        filter?.createdOn ? {
          createdOn: {
            $gte: new Date(filter.createdOn.sinceDate as string),
            $lt: new Date(filter.createdOn.dueDate as string),
          },
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: images.results,
    totalPages: images.pagesCount,
    count: images.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
