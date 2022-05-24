import { JobPost, JobPostRequired, PaginationResponse, RequestResponse } from 'types';

import { IFetch } from 'api/fetch';

import { JOBPOSTS_ENDPOINT } from './api';

export const JOBPOST_API = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJobPosts: (filters: any = {}) => IFetch<PaginationResponse<JobPost>>({ method: 'GET', url: `${JOBPOSTS_ENDPOINT}/`, data: filters }),
  getJobPost: (id: number) => IFetch<JobPost>({ method: 'GET', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/` }),
  createJobPost: (item: JobPostRequired) => IFetch<JobPost>({ method: 'POST', url: `${JOBPOSTS_ENDPOINT}/`, data: item }),
  putJobPost: (id: number, item: JobPostRequired) => IFetch<JobPost>({ method: 'PUT', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/`, data: item }),
  deleteJobPost: (id: number) => IFetch<RequestResponse>({ method: 'DELETE', url: `${JOBPOSTS_ENDPOINT}/${String(id)}/` }),
};
