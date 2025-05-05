import API from '~/api/api';
import type { Category, RequestResponse } from '~/types';
import { useQuery } from 'react-query';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
  return useQuery<Array<Category>, RequestResponse>([CATEGORIES_QUERY_KEY], () => API.getCategories());
};
