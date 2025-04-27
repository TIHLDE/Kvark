import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { authQueryOptions } from '~/api/auth';

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
