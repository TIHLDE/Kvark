import { useQuery } from 'react-query';
import API from 'api/api';
import { RequestResponse } from 'types';
import { GROUPS_QUERY_KEY } from 'hooks/Group';
import { GroupForm } from 'types/Form';

export const GROUP_FORMS_QUERY_KEY = `${GROUPS_QUERY_KEY}_forms`;

export const useGroupForms = (groupSlug: string, filters?: any) => {
  return useQuery<Array<GroupForm>, RequestResponse>([GROUP_FORMS_QUERY_KEY, groupSlug], () => API.getGroupForms(groupSlug, { ...filters }));
};
