import { useQuery } from 'react-query';

import type { RequestResponse, User } from 'types';

import API from 'api/api';

export const EXPORT_EMOJI_KEY = 'emojis';

export const getEmojies = () => {
  return useQuery<string, RequestResponse>([EXPORT_EMOJI_KEY], () => API.fetchUnicode(), { enabled: true });
};

export const addReaction = (emoji: string, newsId: number, userId?: User['user_id']) => {
  console.log('addReaction' + emoji + newsId + userId);
  return API.addEmoji(emoji, newsId);
};

export const deleteEmoji = (emoji: string, newsId: number, userId?: User['user_id']) => {
  return API.deleteEmoji(emoji, newsId, userId);
};

export const changeEmoji = (emoji: string, newsId: number, reactionId: string, userId?: User['user_id']) => {
  return API.changeEmoji(emoji, newsId, reactionId, userId);
};
