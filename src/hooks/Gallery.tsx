/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { Gallery, GalleryCreate, GalleryRequired, PaginationResponse, Picture, PictureRequired, RequestResponse } from '~/types';

export const GALLERY_QUERY_KEYS = {
  all: ['gallery'],
  list: (filters?: any) => [...GALLERY_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])],
  detail: (galleryId: Gallery['id']) => [...GALLERY_QUERY_KEYS.all, galleryId],
  pictures: {
    all: (galleryId: Gallery['id']) => [...GALLERY_QUERY_KEYS.detail(galleryId), 'pictures'],
    list: (galleryId: Gallery['id'], filters?: any) => [...GALLERY_QUERY_KEYS.pictures.all(galleryId), ...(filters ? [filters] : [])],
    detail: (galleryId: Gallery['id'], pictureId: Picture['id']) => [...GALLERY_QUERY_KEYS.pictures.all(galleryId), pictureId],
  },
} as const;

export const useGalleryById = (galleryId: Gallery['id']) =>
  useQuery({
    queryKey: GALLERY_QUERY_KEYS.detail(galleryId),
    queryFn: () => API.getGallery(galleryId),
  });

export const useGalleries = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Gallery>, RequestResponse>({
    queryKey: GALLERY_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) => API.getGalleries({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const useCreateGallery = (): UseMutationResult<Gallery, RequestResponse, GalleryCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGallery) => API.createGallery(newGallery),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.list() });
      queryClient.setQueryData(GALLERY_QUERY_KEYS.detail(data.id), data);
    },
  });
};

export const useUpdateGallery = (galleryId: Gallery['id']): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedGallery) => API.updateGallery(galleryId, updatedGallery),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.list() });
      queryClient.setQueryData(GALLERY_QUERY_KEYS.detail(galleryId), data);
    },
  });
};

// export const useUpdateNews = (id: number): UseMutationResult<News, RequestResponse, NewsRequired, unknown> => {
//   const queryClient = useQueryClient();
//   return useMutation((updatedNewsItem: NewsRequired) => API.putNewsItem(id, updatedNewsItem), {
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(EXPORT_QUERY_KEY);
//       queryClient.setQueryData([EXPORT_QUERY_KEY, id], data);
//     },
//   });
// };

export const useDeleteGallery = (galleryId: Gallery['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteGallery(galleryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.list() }),
  });
};

export const useGalleryPictures = (galleryId: Gallery['id']) =>
  useInfiniteQuery<PaginationResponse<Picture>, RequestResponse>({
    queryKey: GALLERY_QUERY_KEYS.pictures.list(galleryId),
    queryFn: ({ pageParam }) => API.getGalleryPictures(galleryId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });

export const usePictureById = (galleryId: Gallery['id'], pictureId: Picture['id']) =>
  useQuery({
    queryKey: GALLERY_QUERY_KEYS.pictures.detail(galleryId, pictureId),
    queryFn: () => API.getPicture(galleryId, pictureId),
  });

export const useUploadPictures = (galleryId: Gallery['id']): UseMutationResult<RequestResponse, RequestResponse, { files: File | File[] | Blob }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files) => API.createPicture(galleryId, files.files),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.pictures.all(galleryId) }),
  });
};

export const useUpdatePicture = (galleryId: Gallery['id'], pictureId: Picture['id']): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedPicture) => API.updatePicture(galleryId, pictureId, updatedPicture),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.pictures.all(galleryId) });
      queryClient.setQueryData(GALLERY_QUERY_KEYS.pictures.detail(galleryId, pictureId), data);
    },
  });
};

export const useDeletePicture = (galleryId: Gallery['id'], pictureId: Picture['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deletePicture(galleryId, pictureId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.pictures.all(galleryId) }),
  });
};
