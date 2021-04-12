import { useMutation, useQuery, useQueryClient, UseMutationResult, QueryClient } from 'react-query';
import API from 'api/api';
import { Page, PageTree, PageRequired, RequestResponse } from 'types/Types';

export const PAGES_QUERY_KEY = 'page';
export const PAGES_QUERY_KEY_TREE = `${PAGES_QUERY_KEY}/tree`;

export const usePageTree = () => {
  return useQuery<PageTree, RequestResponse>(PAGES_QUERY_KEY_TREE, () => API.getPageTree());
};

export const usePage = (path: string) => {
  const queryClient = useQueryClient();
  const response = useQuery<Page, RequestResponse>([PAGES_QUERY_KEY, path], () => API.getPage(path));
  if (response.data !== undefined) {
    const parentPath = getParentPath(path);
    queryClient.prefetchQuery([PAGES_QUERY_KEY, parentPath], () => API.getPage(parentPath)),
      response.data.children.forEach((child) => {
        const childPath = `${path}${child.slug}/`;
        queryClient.prefetchQuery([PAGES_QUERY_KEY, childPath], () => API.getPage(childPath));
      });
    queryClient.invalidateQueries(PAGES_QUERY_KEY_TREE);
  }
  return response;
};

export const useCreatePage = (): UseMutationResult<Page, RequestResponse, PageRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newPage: PageRequired) => API.createPage(newPage), {
    onSuccess: (data) => {
      queryClient.setQueryData([PAGES_QUERY_KEY, data.path], data);
      invalidate(queryClient);
    },
  });
};

export const useUpdatePage = (path: string): UseMutationResult<Page, RequestResponse, PageRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedPage: PageRequired) => API.updatePage(path, updatedPage), {
    onSuccess: (data) => {
      queryClient.setQueryData([PAGES_QUERY_KEY, data.path], data);
      invalidate(queryClient);
    },
  });
};

export const useDeletePage = (path: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deletePage(path), {
    onSuccess: () => {
      invalidate(queryClient);
    },
  });
};

const getParentPath = (path: string): string => {
  const pathArr = path.split('/');
  const parentPath = pathArr.slice(0, pathArr.length - 2).join('/');
  return parentPath.length ? `${parentPath}/` : '';
};

const invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries(PAGES_QUERY_KEY);
  queryClient.invalidateQueries(PAGES_QUERY_KEY_TREE);
};
