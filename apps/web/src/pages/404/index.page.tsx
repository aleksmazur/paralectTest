import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';

import { handleError } from 'utils';

import { imageApi } from 'resources/image';
import queryClient from 'query-client';
import { showNotification } from '@mantine/notifications';

const schema = z.object({
  title: z.string().min(1, 'Please enter Title').max(100),
  description: z.string().min(1, 'Please enter Description').max(100),
  imageUrl: z.string().min(1, 'Please enter image url'),
});

type ImageParams = z.infer<typeof schema>;

const AddImage: NextPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ImageParams>({
    resolver: zodResolver(schema),
  });

  const { mutate: useAddImage, isLoading: isImageAddLoading } = imageApi.useAddImage<ImageParams>();

  const onSubmit = (dataImage: ImageParams) => useAddImage(dataImage, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      showNotification({
        title: 'Success',
        message: 'Your image has been successfully added.',
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });
};

export default AddImage;
