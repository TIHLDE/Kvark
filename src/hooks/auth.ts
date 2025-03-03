import type { RootLoaderData } from '~/root';
import { useRouteLoaderData } from 'react-router';

export function useOptionalAuth() {
  const { auth } = useRouteLoaderData<RootLoaderData>('root') ?? {};
  return auth;
}

export function useAuth() {
  const auth = useOptionalAuth();
  if (!auth) {
    throw new Error('useAuth hook used when user-not logged in. Consider using useOptionalAuth instead');
  }
  return auth;
}
