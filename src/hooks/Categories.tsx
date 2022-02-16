import { useQuery } from 'react-query';

import { Category, RequestResponse } from 'types';

import API from 'api/api';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
  return useQuery<Array<Category>, RequestResponse>([CATEGORIES_QUERY_KEY], () => API.getCategories());
};
