/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { Gallery, GalleryRequired, PaginationResponse, Picture, PictureRequired, RequestResponse } from 'types';

import { GALLERY_API } from 'api/gallery';

export const GALLERY_QUERY_KEYS = {
  all: ['gallery'] as const,
  list: (filters?: any) => [...GALLERY_QUERY_KEYS.all, 'list', ...(filters ? [filters] : [])] as const,
  detail: (gallerySlug: Gallery['slug']) => [...GALLERY_QUERY_KEYS.all, gallerySlug] as const,
  pictures: {
    all: (gallerySlug: Gallery['slug']) => [...GALLERY_QUERY_KEYS.detail(gallerySlug), 'pictures'] as const,
    list: (gallerySlug: Gallery['slug'], filters?: any) => [...GALLERY_QUERY_KEYS.pictures.all(gallerySlug), ...(filters ? [filters] : [])] as const,
    detail: (gallerySlug: Gallery['slug'], pictureId: Picture['id']) => [...GALLERY_QUERY_KEYS.pictures.all(gallerySlug), pictureId] as const,
  },
};

export const useGalleryById = (gallerySlug: Gallery['slug']) =>
  useQuery<Gallery, RequestResponse>(GALLERY_QUERY_KEYS.detail(gallerySlug), () => GALLERY_API.getGallery(gallerySlug));

export const useGalleries = (filters?: any) =>
  useInfiniteQuery<PaginationResponse<Gallery>, RequestResponse>(
    GALLERY_QUERY_KEYS.list(filters),
    ({ pageParam = 1 }) => GALLERY_API.getGallerys({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const useCreateGallery = (): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newGallery: GalleryRequired) => GALLERY_API.createGallery(newGallery), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEYS.list());
      queryClient.setQueryData(GALLERY_QUERY_KEYS.detail(data.slug), data);
    },
  });
};

export const useUpdateGallery = (gallerySlug: Gallery['slug']): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedGallery) => GALLERY_API.updateGallery(gallerySlug, updatedGallery), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEYS.list());
      queryClient.setQueryData(GALLERY_QUERY_KEYS.detail(gallerySlug), data);
    },
  });
};

export const useDeleteGallery = (gallerySlug: Gallery['slug']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => GALLERY_API.deleteGallery(gallerySlug), {
    onSuccess: () => queryClient.invalidateQueries(GALLERY_QUERY_KEYS.list()),
  });
};

export const useGalleryPictures = (gallerySlug: Gallery['slug']) =>
  useInfiniteQuery<PaginationResponse<Picture>, RequestResponse>(
    GALLERY_QUERY_KEYS.pictures.list(gallerySlug),
    ({ pageParam = 1 }) => GALLERY_API.getGalleryPictures(gallerySlug, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

export const usePictureById = (gallerySlug: Gallery['slug'], pictureId: Picture['id']) =>
  useQuery<Picture, RequestResponse>(GALLERY_QUERY_KEYS.pictures.detail(gallerySlug, pictureId), () => GALLERY_API.getPicture(gallerySlug, pictureId));

export const useUploadPictures = (
  gallerySlug: Gallery['slug'],
): UseMutationResult<RequestResponse, RequestResponse, { files: File | File[] | Blob }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((files) => GALLERY_API.createPicture(gallerySlug, files.files), {
    onSuccess: () => queryClient.invalidateQueries(GALLERY_QUERY_KEYS.pictures.all(gallerySlug)),
  });
};

export const useUpdatePicture = (
  gallerySlug: Gallery['slug'],
  pictureId: Picture['id'],
): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPicture) => GALLERY_API.updatePicture(gallerySlug, pictureId, updatedPicture), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEYS.pictures.all(gallerySlug));
      queryClient.setQueryData(GALLERY_QUERY_KEYS.pictures.detail(gallerySlug, pictureId), data);
    },
  });
};

export const useDeletePicture = (
  gallerySlug: Gallery['slug'],
  pictureId: Picture['id'],
): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => GALLERY_API.deletePicture(gallerySlug, pictureId), {
    onSuccess: () => queryClient.invalidateQueries(GALLERY_QUERY_KEYS.pictures.all(gallerySlug)),
  });
};
