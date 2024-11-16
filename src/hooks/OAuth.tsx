import { useMutation, useQuery } from 'react-query';

import API from 'api/api';

const OAUTH_GET_APP_KEY = 'oauth_get_app';

export const useOAuthApp = (clientId?: string) => {
  return useQuery([OAUTH_GET_APP_KEY, clientId], () => (clientId ? API.getOAuthApp(clientId) : undefined));
};

export const useCreateOAuthCode = () => {
  return useMutation((newOAuthCode: { clientId: string; redirectUri: string }) => API.createOAuthCode(newOAuthCode.clientId, newOAuthCode.redirectUri));
};
