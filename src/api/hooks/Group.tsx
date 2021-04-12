import API from 'api/api';
import { useQuery } from 'react-query';
import { Group, RequestResponse } from 'types/Types';

export const QUERY_KEY_GROUPS = 'groups';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGroups = () => {
  return useQuery<Group[], RequestResponse>([QUERY_KEY_GROUPS], () => API.getGroups());
};
