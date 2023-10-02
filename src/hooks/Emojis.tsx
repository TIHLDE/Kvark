import { useQuery } from 'react-query';

import type { RequestResponse, User } from 'types';

import API from 'api/api';

export const EXPORT_EMOJI_KEY = 'emojis';

export const getEmojies = () => {
  return useQuery<string, RequestResponse>([EXPORT_EMOJI_KEY], () => API.fetchUnicode(), { enabled: true });
};

export const addReaction = (emoji: string, newsId: number, userId?: User['user_id']) => {
  console.log('addReaction' + emoji + newsId + userId);
  return API.addEmoji(emoji, newsId, userId);
};

export const deleteEmoji = (reaction_id: string) => {
  console.log('deleteEmoji' + reaction_id);
  return API.deleteEmoji(reaction_id);
};

export const changeEmoji = (reaction_id: string, emoji: string, newsId: number, userId?: User['user_id']) => {
  return API.changeEmoji(reaction_id, emoji, newsId, userId);
};
