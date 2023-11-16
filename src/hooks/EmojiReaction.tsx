import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import type { Reaction, ReactionMutate, RequestResponse } from 'types';

import API from 'api/api';

const EXPORT_QUERY_KEY = 'news';

export const useCreateReaction = (): UseMutationResult<Reaction, RequestResponse, ReactionMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newReaction: ReactionMutate) => API.createReaction(newReaction), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
    },
  });
};

export const useDeleteReaction = (): UseMutationResult<RequestResponse, RequestResponse, Reaction['reaction_id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation((reactionId: Reaction['reaction_id']) => API.deleteReaction(reactionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
    },
  });
};

export const useUpdateReaction = (): UseMutationResult<Reaction, RequestResponse, Reaction, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedReaction: Reaction) => API.updateReaction(updatedReaction.reaction_id, updatedReaction), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXPORT_QUERY_KEY);
    },
  });
};
