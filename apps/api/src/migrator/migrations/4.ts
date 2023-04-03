/* eslint-disable max-len */
import { promiseUtil } from 'utils';
import { userService } from 'resources/user';
import { imageService } from 'resources/image';
import { Migration } from 'migrator/types';

const migration = new Migration(4, 'Example');

migration.migrate = async () => {

  await imageService.insertOne({
    title: 'My each one image',
    description: 'Image made without love',
    userId: '642sdwd37cc14f2a336a874a8fd',
    imageUrl: 'https://play-lh.googleusercontent.com/jkpabs01pnEU5Jc9U3MuWdwwoWi8v7x33RZNYyLP2T8a2j1csnjOy3_-KI6JU8JntlNW',
    author: 'Claude Monet',
  });

  await imageService.insertOne({
    title: 'My image',
    description: 'Image made with smile',
    userId: '642sdwd37cc14f2a336a874a8fd',
    imageUrl: 'https://bestlifeonline.com/wp-content/uploads/sites/3/2018/04/Animal-jokes-funny-sheep.jpg?quality=82&strip=all',
    author: 'Van Gogh',
  });

  const { results: images } = await imageService.find({}, {
    page: 1,
    perPage: 20,
  });

  console.log(images);

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
