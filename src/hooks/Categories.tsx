import { useQuery } from '@tanstack/react-query';
import API from '~/api/api';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => API.getCategories(),
  });
};
