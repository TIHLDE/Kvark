import { useCallback } from 'react';
import API from 'api/api';

export const useBadge = () => {
  const createUserBadge = useCallback(async (badgeId: string) => {
    return API.createUserBadge({ badge_id: badgeId }).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  return { createUserBadge };
};
