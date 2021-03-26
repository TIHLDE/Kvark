import { useCallback } from 'react';
import API from 'api/api';
import { useRefreshUser } from 'api/hooks/User';

export const useBadge = () => {
  const refreshUser = useRefreshUser();
  const createUserBadge = useCallback(async (badgeId: string) => {
    const response = await API.createUserBadge({ badge_id: badgeId });
    refreshUser();
    return response;
  }, []);
  return { createUserBadge };
};
