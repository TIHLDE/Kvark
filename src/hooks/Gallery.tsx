import { useMutation, useQuery, useQueryClient, UseMutationResult, useInfiniteQuery } from 'react-query';
import API from 'api/api';
import { Gallery, GalleryRequired, Picture, PictureRequired, PaginationResponse, RequestResponse } from 'types';

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
    [GALLERY_QUERY_KEY, albumSlug],
    ({ pageParam = 1 }) => API.getAlbumPictures(albumSlug, { page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreatePicture = (): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newPicture: PictureRequired) => API.createPicture(newPicture), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(PICTURE_QUERY_KEY);
      queryClient.setQueryData([PICTURE_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdatePicture = (id: string): UseMutationResult<Picture, RequestResponse, PictureRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPicture: PictureRequired) => API.updatePicture(id, updatedPicture), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(PICTURE_QUERY_KEY);
      queryClient.setQueryData([PICTURE_QUERY_KEY, id], data);
    },
  });
};

export const useDeletePicture = (id: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deletePicture(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(PICTURE_QUERY_KEY);
    },
  });
};
