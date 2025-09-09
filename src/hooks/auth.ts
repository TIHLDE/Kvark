import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { authQueryOptions } from '~/api/auth';
import { env } from '~/env';
import { emailOTPClient, genericOAuthClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export function useOptionalAuth() {
  const { data: auth, ...rest } = useSuspenseQuery(authQueryOptions);
  return { ...rest, auth };
}

export function useAuth() {
  const { auth, ...rest } = useOptionalAuth();
  if (auth == null) {
    throw new Error('useAuth: used outside of auth context, consider using useOptionalAuth or useAuthQuery instead');
  }
  return { ...rest, auth };
}

export function useAuthQuery() {
  const { data: auth, ...rest } = useQuery(authQueryOptions);
  return { ...rest, auth };
}

export const authClient = createAuthClient({
  baseURL: env.PHOTON_API_URL,
  plugins: [emailOTPClient(), genericOAuthClient()],
});

export function useSession() {
  return authClient.useSession();
}
