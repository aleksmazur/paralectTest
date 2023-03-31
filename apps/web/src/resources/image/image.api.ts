import { useMutation, useQuery } from 'react-query';

import { apiService } from 'services';

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

export function useMyList<T>(params: T) {
  const list = () => apiService.get('/images/current', params);

  interface ImagesListResponse {
    count: number;
    items: Image[];
    totalPages: number;
  }

  return useQuery<ImagesListResponse>(['images', params], list);
}

export function useAddImage<T>() {
  const addImage = (data: T) => apiService.post('/images', data);

  return useMutation<{}, unknown, T>(addImage);
}
