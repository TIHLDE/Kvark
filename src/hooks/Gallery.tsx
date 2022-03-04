import { useInfiniteQuery, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { Gallery, GalleryRequired, PaginationResponse, Picture, PictureRequired, RequestResponse } from 'types';

import API from 'api/api';

export const GALLERY_QUERY_KEY = 'gallery';
export const PICTURE_QUERY_KEY = 'pictures';

export const useAlbumsById = (albumSlug: string) => {
  return useQuery<Gallery, RequestResponse>([GALLERY_QUERY_KEY, albumSlug], () => API.getAlbum(albumSlug));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAlbums = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Gallery>, RequestResponse>(
    [GALLERY_QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getAlbums({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateAlbum = (): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newAlbum: GalleryRequired) => API.createAlbum(newAlbum), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEY);
      queryClient.setQueryData([GALLERY_QUERY_KEY, data.slug], data);
    },
  });
};

export const useUpdateAlbum = (albumSlug: string): UseMutationResult<Gallery, RequestResponse, GalleryRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedAlbum: GalleryRequired) => API.updateAlbum(albumSlug, updatedAlbum), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEY);
      queryClient.setQueryData([GALLERY_QUERY_KEY, albumSlug], data);
    },
  });
};

export const useDeleteAlbum = (albumSlug: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteAlbum(albumSlug), {
    onSuccess: () => {
      queryClient.invalidateQueries(GALLERY_QUERY_KEY);
    },
  });
};

export const useAlbumPictures = (albumSlug: string) => {
  return useInfiniteQuery<PaginationResponse<Picture>, RequestResponse>(
    [GALLERY_QUERY_KEY, albumSlug, PICTURE_QUERY_KEY],
    ({ pageParam = 1 }) => API.getAlbumPictures(albumSlug, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const usePictureById = (albumSlug: string, id: string) => {
  return useQuery<Picture, RequestResponse>([GALLERY_QUERY_KEY, PICTURE_QUERY_KEY, id, albumSlug], () => API.getPicture(albumSlug, id));
};

export const useUploadPictures = (albumSlug: string): UseMutationResult<RequestResponse, RequestResponse, { files: File | File[] | Blob }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((files) => API.createPicture(albumSlug, files.files), {
    onSuccess: () => queryClient.invalidateQueries([GALLERY_QUERY_KEY, albumSlug, PICTURE_QUERY_KEY]),
  });
};

export const useUpdatePicture = (albumSlug: string, id: string): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPicture: PictureRequired) => API.updatePicture(albumSlug, id, updatedPicture), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([GALLERY_QUERY_KEY, PICTURE_QUERY_KEY, id, albumSlug]);
      queryClient.setQueryData([PICTURE_QUERY_KEY, id], data);
    },
  });
};

export const useDeletePicture = (albumSlug: string, id: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deletePicture(albumSlug, id), {
    onSuccess: () => {
      queryClient.invalidateQueries([GALLERY_QUERY_KEY, albumSlug]);
    },
  });
};
