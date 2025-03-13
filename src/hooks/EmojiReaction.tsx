import API from '~/api/api';
import type { Reaction, ReactionMutate, RequestResponse } from '~/types';
import { useMutation, type UseMutationResult, useQueryClient } from 'react-query';

import { EVENT_QUERY_KEYS } from './Event';

const NEWS_QUERY_KEY = 'news';

export const useCreateReaction = (): UseMutationResult<Reaction, RequestResponse, ReactionMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newReaction: ReactionMutate) => API.createReaction(newReaction), {
    onSuccess: () => {
      queryClient.invalidateQueries(NEWS_QUERY_KEY);
      queryClient.invalidateQueries(EVENT_QUERY_KEYS.all);
    },
  });
};

export const useDeleteReaction = (): UseMutationResult<RequestResponse, RequestResponse, Reaction['reaction_id'], unknown> => {
  const queryClient = useQueryClient();
  return useMutation((reactionId: Reaction['reaction_id']) => API.deleteReaction(reactionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(NEWS_QUERY_KEY);
      queryClient.invalidateQueries(EVENT_QUERY_KEYS.all);
    },
  });
};

export const useUpdateReaction = (): UseMutationResult<Reaction, RequestResponse, Reaction, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedReaction: Reaction) => API.updateReaction(updatedReaction.reaction_id, updatedReaction), {
    onSuccess: () => {
      queryClient.invalidateQueries(NEWS_QUERY_KEY);
      queryClient.invalidateQueries(EVENT_QUERY_KEYS.all);
    },
  });
};
