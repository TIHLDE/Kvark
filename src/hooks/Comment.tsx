import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Comment, CommentCreate, CommentUpdate, RequestResponse } from 'types';

import API from 'api/api';

export const COMMENTS_QUERY_KEY = 'comments';

export const useCreateComment = (): UseMutationResult<Comment, RequestResponse, CommentCreate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => API.createComment(data), {
    onSuccess: () => queryClient.invalidateQueries(COMMENTS_QUERY_KEY),
  });
};

export const useUpdateComment = (id: Comment['id']): UseMutationResult<Comment, RequestResponse, CommentUpdate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((data) => API.updateComment(id, data), {
    onSuccess: () => queryClient.invalidateQueries(COMMENTS_QUERY_KEY),
  });
};

export const useDeleteComment = (id: Comment['id']): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteComment(id), {
    onSuccess: () => queryClient.invalidateQueries(COMMENTS_QUERY_KEY),
  });
};
