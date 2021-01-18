import { useCallback } from 'react';
import API from 'api/api';

export const useBadge = () => {
  const createUserBadge = useCallback((badgeId: string) => API.createUserBadge({ badge_id: badgeId }), []);
  return { createUserBadge };
};
