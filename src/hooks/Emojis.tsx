import { useMutation, useQueryClient } from 'react-query';
import type { User } from 'types';
import API from 'api/api';
import { useSnackbar } from 'hooks/Snackbar';


const EXPORT_QUERY_KEY = 'news';


export const addReaction = (emoji: string, newsId: number, userId?: User['user_id']) => {
  return API.addEmoji(emoji, newsId, userId);
};

export const deleteReaction = (reaction_id: string) => {
  return API.deleteEmoji(reaction_id);
};

export const changeReaction = (reaction_id: string, emoji: string, newsId: number, userId?: User['user_id']) => {
  return API.changeEmoji(reaction_id, emoji, newsId, userId);
};


export const useAddReaction = (newsId: number) => {
  const showSnackbar = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(
    (params: { emoji: string, userId?: User['user_id']} ) => API.addEmoji(params.emoji, newsId, params.userId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(EXPORT_QUERY_KEY);
        queryClient.setQueryData([EXPORT_QUERY_KEY, newsId], data);
      },
      onError: (e: { detail: string }) => {
        console.log("something went wrong")
        showSnackbar(e.detail, 'error');
      }             
    }
  );
};


export const useChangeReaction = (newsId: number) => {
  const showSnackbar = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(
    (params: { reaction_id: string, emoji: string, userId?: User['user_id'] }) => changeReaction(params.reaction_id, params.emoji, newsId, params.userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([EXPORT_QUERY_KEY, newsId]);
      },
      onError: (e: { detail: string }) => {
        showSnackbar(e.detail, 'error');
      }
    }
  );
};

export const useDeleteReaction = (newsId: number) => {
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  return useMutation(
    (reaction_id: string) => deleteReaction(reaction_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([EXPORT_QUERY_KEY, newsId]);
      },
      onError: (e: { detail: string }) => {
        showSnackbar(e.detail, 'error');
      }
    }
  );
};

