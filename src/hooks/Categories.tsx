import { useQuery } from '@tanstack/react-query';
import API from '~/api/api';
import type { Category, RequestResponse } from '~/types';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
  return useQuery<Array<Category>, RequestResponse>([CATEGORIES_QUERY_KEY], () => API.getCategories());
};
