import { useMutation, useQuery } from 'react-query';

import { apiService } from 'services';
import { imageTypes } from 'resources/image';
import queryClient from 'query-client';

import { Image } from './image.types';

export function useList<T>(params: T) {
  const list = () => apiService.get('/images', params);

  interface ImagesListResponse {
    count: number;
    items: Image[];
    totalPages: number;
  }

  return useQuery<ImagesListResponse>(['images', params], list);
}

export function useAddImage<T>() {
  const add = (data: T) => apiService.post('/images', data);

  return useMutation<imageTypes.Image, unknown, T>(add, {
    onSuccess: (data) => {
      queryClient.setQueryData(['image'], data);
    },
  });
}

// export function useAddImage<T>() {
//   const addImage = (data: T) => apiService.post('/images/add-image', data);

//   interface AddImageResponse {
//     title: string;
//     description: string;
//     imageUrl: string;
//   }

//   return useMutation<AddImageResponse, unknown, T>(addImage);
// }
