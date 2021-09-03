import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import API from 'api/api';
import { USER_BADGES_QUERY_KEY } from 'hooks/User';

export const useBadge = () => {
  const queryClient = useQueryClient();
  const createUserBadge = useCallback(async (badgeId: string) => {
    const response = await API.createUserBadge({ badge_id: badgeId });
    queryClient.invalidateQueries(USER_BADGES_QUERY_KEY);
    return response;
  }, []);
  return { createUserBadge };
};
