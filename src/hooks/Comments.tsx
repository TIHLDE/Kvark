import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Comment, CommentCreate, PaginationResponse, RequestResponse } from 'types';

import API from 'api/api';

export const COMMENTS_QUERY_KEY = 'comments';

export const useComments = (
  options?: UseInfiniteQueryOptions<PaginationResponse<Comment>, RequestResponse, PaginationResponse<Comment>, PaginationResponse<Comment>, QueryKey>,
) => {
  /*   return useInfiniteQuery<PaginationResponse<Comment>, RequestResponse>(
    TODDEL_QUERY_KEYS.all,
    ({ pageParam = 1 }) => getComments({ page: pageParam }),
    {
      ...options,
      getNextPageParam: (lastPage) => lastPage.next,
    },
  ); */
};

export const useCreateComment = (): UseMutationResult<Comment, RequestResponse, CommentCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => API.createComment(data), {
    onSuccess: () => queryClient.invalidateQueries(COMMENTS_QUERY_KEY),
  });
};

/* export const useUpdateComment = (id: Comment['edition']): UseMutationResult<Comment, RequestResponse, CommentCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => COMMENT_API.updateComment(id, data), {
    onSuccess: () => queryClient.invalidateQueries(TODDEL_QUERY_KEYS.all),
  });
};

export const useDeleteComment = (id: Comment['edition']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => COMMENT_API.deleteComment(id), {
    onSuccess: () => queryClient.invalidateQueries(TODDEL_QUERY_KEYS.all),
  });
};
 */
