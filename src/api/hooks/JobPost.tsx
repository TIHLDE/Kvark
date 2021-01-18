import { createContext, ReactNode, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import API from 'api/api';
import { JobPost, JobPostRequired, RequestResponse } from 'types/Types';

export type Action =
  | { type: 'set'; payload: Array<JobPost> }
  | { type: 'add'; payload: JobPost }
  | { type: 'update'; payload: JobPost }
  | { type: 'remove'; payload: number };

export type Dispatch = (action: Action) => void;
export type JobPostProviderProps = { children: ReactNode };

const JobPostStateContext = createContext<Array<JobPost> | undefined>(undefined);
const JobPostDispatchContext = createContext<Dispatch | undefined>(undefined);

const jobPostReducer = (state: Array<JobPost>, action: Action): Array<JobPost> => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    case 'add': {
      if (state.find((item) => item.id === action.payload.id)) {
        return state.map((jobPostItem) => {
          let returnValue = { ...jobPostItem };
          if (jobPostItem.id === action.payload.id) {
            returnValue = { ...returnValue, ...action.payload };
          }
          return returnValue;
        });
      } else {
        return [...state, action.payload];
      }
    }
    case 'update': {
      return state.map((jobPostItem) => {
        let returnValue = { ...jobPostItem };
        if (jobPostItem.id === action.payload.id) {
          returnValue = { ...returnValue, ...action.payload };
        }
        return returnValue;
      });
    }
    case 'remove': {
      return state.filter((jobPostItem) => jobPostItem.id !== action.payload);
    }
  }
};

export const JobPostProvider = ({ children }: JobPostProviderProps) => {
  const [state, dispatch] = useReducer(jobPostReducer, []);
  return (
    <JobPostStateContext.Provider value={state}>
      <JobPostDispatchContext.Provider value={dispatch}>{children}</JobPostDispatchContext.Provider>
    </JobPostStateContext.Provider>
  );
};

const useJobPostState = () => {
  const context = useContext(JobPostStateContext);
  if (context === undefined) {
    throw new Error('useJobPostState must be used within a JobPostProvider');
  }
  return context;
};

const useJobPostDispatch = () => {
  const context = useContext(JobPostDispatchContext);
  if (context === undefined) {
    throw new Error('useJobPostDispatch must be used within a JobPostProvider');
  }
  return context;
};

export const useJobPostById = (id: number) => {
  const { getJobPostById } = useJobPost();
  const jobPost = useJobPostState();
  const [jobPostData, setJobPostData] = useState<JobPost | null>(null);
  const [error, setError] = useState<RequestResponse | null>(null);

  useEffect(() => {
    getJobPostById(id)
      .then((data) => {
        setJobPostData(data);
        setError(null);
      })
      .catch((error: RequestResponse) => {
        setError(error);
        setJobPostData(null);
      });
  }, [id, getJobPostById, jobPost]);

  return [jobPostData, error] as const;
};

export const useJobPost = () => {
  const jobPost = useJobPostState();
  const dispatch = useJobPostDispatch();

  const getJobPosts = useCallback((filters = null) => API.getJobPosts(filters), []);

  const getExpiredJobPosts = useCallback(() => API.getExpiredJobPosts(), []);

  const getJobPostById = useCallback(
    async (id: number): Promise<JobPost> => {
      const jobPostItem = jobPost.find((item) => item.id === Number(id));
      if (jobPostItem) {
        return Promise.resolve(jobPostItem);
      } else {
        return API.getJobPost(id).then((data) => {
          dispatch({ type: 'add', payload: data });
          return data;
        });
      }
    },
    [jobPost, dispatch],
  );

  const createJobPost = useCallback(
    (jobPostData: JobPostRequired) =>
      API.createJobPost(jobPostData).then((data) => {
        dispatch({
          type: 'add',
          payload: data,
        });
        return data;
      }),
    [dispatch],
  );

  const updateJobPost = useCallback(
    (id: number, jobPostData: JobPostRequired) =>
      API.putJobPost(id, jobPostData).then((data) => {
        dispatch({
          type: 'update',
          payload: data,
        });
        return data;
      }),
    [dispatch],
  );

  const deleteJobPost = useCallback(
    (id: number) =>
      API.deleteJobPost(id).then((data) => {
        dispatch({
          type: 'remove',
          payload: id,
        });
        return data;
      }),
    [dispatch],
  );

  return { JobPostProvider, getJobPosts, getExpiredJobPosts, getJobPostById, createJobPost, updateJobPost, deleteJobPost };
};
