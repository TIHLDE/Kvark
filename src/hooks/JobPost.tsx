import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import API from '~/api/api';
import type { JobPost, JobPostRequired, PaginationResponse, RequestResponse } from '~/types';

export const JOBPOST_QUERY_KEY = 'jobpost';

export const useJobPostById = (id: number) => {
  return useQuery({
    queryKey: [JOBPOST_QUERY_KEY, id],
    queryFn: () => API.getJobPost(id),
    enabled: id !== -1,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useJobPosts = (filters?: any) => {
  return useInfiniteQuery<PaginationResponse<JobPost>, RequestResponse>({
    queryKey: [JOBPOST_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => API.getJobPosts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
  });
};

export const useCreateJobPost = (): UseMutationResult<JobPost, RequestResponse, JobPostRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newJobPost: JobPostRequired) => API.createJobPost(newJobPost),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [JOBPOST_QUERY_KEY],
      });
      queryClient.setQueryData([JOBPOST_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateJobPost = (id: number): UseMutationResult<JobPost, RequestResponse, JobPostRequired, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedJobPost: JobPostRequired) => API.putJobPost(id, updatedJobPost),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [JOBPOST_QUERY_KEY],
      });
      queryClient.setQueryData([JOBPOST_QUERY_KEY, id], data);
    },
  });
};

export const useDeleteJobPost = (id: number): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => API.deleteJobPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [JOBPOST_QUERY_KEY],
      });
    },
  });
};
