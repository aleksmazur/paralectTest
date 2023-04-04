/* eslint-disable max-len */
import { promiseUtil } from 'utils';
import { userService } from 'resources/user';
import { imageService } from 'resources/image';
import { Migration } from 'migrator/types';

const migration = new Migration(6, 'Example');

migration.migrate = async () => {
  
  await imageService.insertOne({
    title: 'Humster',
    description: 'Humster with nut',
    userId: '642sdwd37cc14f2a346a874a8fd',
    imageUrl: 'https://www.thesprucepets.com/thmb/93KCeFOyy9MViphsujDftH6MMdc=/4089x0/filters:no_upscale():strip_icc()/close-up-of-a-hamster-eating-groundnut-635096689-5c525f88c9e77c0001d7c1fa.jpg',
    author: 'Claude Monet',
  });

  await imageService.insertOne({
    title: 'Bear',
    description: 'Nice bear shake his hand',
    userId: '642sdwd37cc14f2a236a874a8fd',
    imageUrl: 'https://www.boredpanda.com/blog/wp-content/uploads/2014/03/funny-bears-doing-human-things-coverimage.jpg',
    author: 'Van Gogh',
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
};

export default migration;
