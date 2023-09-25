import { useQuery } from 'react-query';

import { RequestResponse } from 'types';

import API from 'api/api';

export const EXPORT_EMOJI_KEY = 'emojis';

export const useUnicode = () => {
  return useQuery<string, RequestResponse>([EXPORT_EMOJI_KEY], () => API.fetchUnicode(), { enabled: true });
};
