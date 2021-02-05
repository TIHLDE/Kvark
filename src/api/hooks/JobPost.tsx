import { useMutation, useInfiniteQuery, useQuery, useQueryClient, UseMutationResult } from 'react-query';
import API from 'api/api';
import { getParameterByName } from 'utils';
import { JobPost, JobPostRequired, PaginationResponse, RequestResponse } from 'types/Types';

const QUERY_KEY = 'jobpost';

export const useJobPostById = (id: number) => {
  return useQuery<JobPost, RequestResponse>([QUERY_KEY, id], () => API.getJobPost(id), { enabled: id !== -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useJobPosts = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<JobPost>, RequestResponse>(
    [QUERY_KEY, filters],
    ({ pageParam = 1 }) => API.getJobPosts({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => getParameterByName('page', lastPage.next),
    },
  );
};

export const useCreateJobPost = (): UseMutationResult<JobPost, RequestResponse, JobPostRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newJobPost: JobPostRequired) => API.createJobPost(newJobPost), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateJobPost = (id: number): UseMutationResult<JobPost, RequestResponse, JobPostRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((updatedJobPost: JobPostRequired) => API.putJobPost(id, updatedJobPost), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEY);
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
};

export const useDeleteJobPost = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => API.deleteJobPost(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
    },
  });
};
