import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { RoutePath } from 'routes';
import router from 'next/router';
import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';

import { handleError } from 'utils';

import { showNotification } from '@mantine/notifications';
import { useQueryClient } from 'react-query';
import { imageApi } from 'resources/image';
import { accountApi } from 'resources/account';

const schema = z.object({
  title: z.string().min(1, 'Please enter Title').max(100),
  description: z.string().min(1, 'Please enter Description').max(100),
  imageUrl: z.string().min(1, 'Please enter image url'),
  userId: z.string(),
  author: z.string(),
});

type ImageParams = z.infer<typeof schema>;

const AddImage: NextPage = () => {
  const queryClient = useQueryClient();

  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ImageParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: account?._id,
      author: account?.fullName,
    },
  });

  const {
    mutate: addImage,
    isLoading: isUpdateLoading,
  } = imageApi.useAddImage<ImageParams>();

  const onSubmit = (submitData: ImageParams) => addImage(submitData, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      showNotification({
        title: 'Success',
        message: 'Your image has been successfully added.',
        color: 'green',
      });
      router.push(RoutePath.MyImages);
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Add image</title>
      </Head>
      <Group position="center">
        <Stack sx={{ width: '408px' }} spacing="lg">
          <Stack spacing={34}>
            <Title order={1}>Add image</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={20}>
                <TextInput
                  {...register('title')}
                  label="Title"
                  maxLength={100}
                  placeholder="Title"
                  error={errors.title?.message}
                />
                <TextInput
                  {...register('description')}
                  label="Description"
                  maxLength={100}
                  placeholder="Description"
                  error={errors.description?.message}
                />
                <TextInput
                  {...register('imageUrl')}
                  label="Image URL"
                  placeholder="Image URL"
                  error={errors.imageUrl?.message}
                />
              </Stack>
              <Button
                type="submit"
                loading={isUpdateLoading}
                fullWidth
                mt={34}
              >
                Add in gallery
              </Button>
            </form>
          </Stack>
        </Stack>
      </Group>

    </>
  );
};

export default AddImage;
