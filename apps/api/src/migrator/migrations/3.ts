import { promiseUtil } from 'utils';
import { userService } from 'resources/user';
import { imageService } from 'resources/image';
import { Migration } from 'migrator/types';

const migration = new Migration(3, 'Example');

migration.migrate = async () => {

  await imageService.insertOne({
    title: 'My best image',
    description: 'Image made with love',
    userId: '642437cc14f2a336a874a8fd',
    // eslint-disable-next-line max-len
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/young-seal-smiles-and-waves-royalty-free-image-1585073751.jpg',
    author: 'Claude Monet',
  });

  await imageService.insertOne({
    title: 'My best image 2',
    description: 'Image made with love and magic',
    userId: '642437cc14f2a336a874a8fd',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/squirrel-nature-photos-1537973822.jpg',
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
