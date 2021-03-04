import { useQuery } from 'react-query';
import API from 'api/api';
import { Membership } from 'types/Types';

const QUERY_KEY = 'membership';
export const useMemberships = (slug: string) => {
  return useQuery<Membership[]>([QUERY_KEY, slug], () => API.getMemberships(slug));
};
