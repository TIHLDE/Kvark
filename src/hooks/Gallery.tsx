import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { Gallery, GalleryRequired, PaginationResponse, Picture, PictureRequired, RequestResponse } from 'types';

import API from 'api/api';

export const GALLERY_QUERY_KEY = 'gallery';
export const PICTURE_QUERY_KEY = 'pictures';

export const useGalleriesById = (gallerySlug: string) =>
  useQuery<Gallery, RequestResponse>([GALLERY_QUERY_KEY, gallerySlug], () => API.getGallery(gallerySlug));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGalleries = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Gallery>, RequestResponse>(
    [GALLERY_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getGallerys({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateGallery = (): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newGallery: GalleryRequired) => API.createGallery(newGallery), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEY);
      queryClient.setQueryData([GALLERY_QUERY_KEY, data.slug], data);
    },
  });
};

export const useUpdateGallery = (gallerySlug: string): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedGallery: GalleryRequired) => API.updateGallery(gallerySlug, updatedGallery), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEY);
      queryClient.setQueryData([GALLERY_QUERY_KEY, gallerySlug], data);
    },
  });
};

export const useDeleteGallery = (gallerySlug: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteGallery(gallerySlug), {
    onSuccess: () => queryClient.invalidateQueries(GALLERY_QUERY_KEY),
  });
};

export const useGalleryPictures = (gallerySlug: string) => {
  return useInfiniteQuery<PaginationResponse<Picture>, RequestResponse>(
    [GALLERY_QUERY_KEY, gallerySlug, PICTURE_QUERY_KEY],
    ({ pageParam = 1 }) => API.getGalleryPictures(gallerySlug, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const usePictureById = (gallerySlug: string, id: string) => {
  return useQuery<Picture, RequestResponse>([GALLERY_QUERY_KEY, gallerySlug, PICTURE_QUERY_KEY, id], () => API.getPicture(gallerySlug, id));
};

export const useUploadPictures = (gallerySlug: string): UseMutationResult<RequestResponse, RequestResponse, { files: File | File[] | Blob }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((files) => API.createPicture(gallerySlug, files.files), {
    onSuccess: () => queryClient.invalidateQueries([GALLERY_QUERY_KEY, gallerySlug, PICTURE_QUERY_KEY]),
  });
};

export const useUpdatePicture = (gallerySlug: string, id: string): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPicture: PictureRequired) => API.updatePicture(gallerySlug, id, updatedPicture), {
    onSuccess: (data) => {
      queryClient.setQueryData([GALLERY_QUERY_KEY, gallerySlug, PICTURE_QUERY_KEY, id], data);
    },
  });
};

export const useDeletePicture = (gallerySlug: string, id: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deletePicture(gallerySlug, id), {
    onSuccess: () => queryClient.invalidateQueries([GALLERY_QUERY_KEY, gallerySlug]),
  });
};
