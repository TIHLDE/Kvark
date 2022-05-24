import { useQuery } from 'react-query';

import { Category, RequestResponse } from 'types';

import { EVENT_API } from 'api/event';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
  return useQuery<Array<Category>, RequestResponse>([CATEGORIES_QUERY_KEY], () => EVENT_API.getCategories());
};
