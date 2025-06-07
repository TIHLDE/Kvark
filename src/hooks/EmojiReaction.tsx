import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { Reaction, ReactionMutate, RequestResponse } from '~/types';

import { EVENT_QUERY_KEYS } from './Event';

const NEWS_QUERY_KEY = 'news';

export const useCreateReaction = (): UseMutationResult<Reaction, RequestResponse, ReactionMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReaction: ReactionMutate) => API.createReaction(newReaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NEWS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteReaction = (): UseMutationResult<RequestResponse, RequestResponse, Reaction['reaction_id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reactionId: Reaction['reaction_id']) => API.deleteReaction(reactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NEWS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useUpdateReaction = (): UseMutationResult<Reaction, RequestResponse, Reaction, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedReaction: Reaction) => API.updateReaction(updatedReaction.reaction_id, updatedReaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NEWS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};
