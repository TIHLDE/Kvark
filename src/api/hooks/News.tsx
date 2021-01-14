import { createContext, ReactNode, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import API from 'api/api';
import { News, NewsRequired, RequestResponse } from 'types/Types';

export type Action =
  | { type: 'set'; payload: Array<News> }
  | { type: 'add'; payload: News }
  | { type: 'update'; payload: News }
  | { type: 'remove'; payload: number };

export type Dispatch = (action: Action) => void;
export type NewsProviderProps = { children: ReactNode };

const NewsStateContext = createContext<Array<News> | undefined>(undefined);
const NewsDispatchContext = createContext<Dispatch | undefined>(undefined);

const newsReducer = (state: Array<News>, action: Action): Array<News> => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    case 'add': {
      if (state.find((item) => item.id === action.payload.id)) {
        return state.map((newsItem) => {
          let returnValue = { ...newsItem };
          if (newsItem.id === action.payload.id) {
            returnValue = { ...returnValue, ...action.payload };
          }
          return returnValue;
        });
      } else {
        return [...state, action.payload];
      }
    }
    case 'update': {
      return state.map((newsItem) => {
        let returnValue = { ...newsItem };
        if (newsItem.id === action.payload.id) {
          returnValue = { ...returnValue, ...action.payload };
        }
        return returnValue;
      });
    }
    case 'remove': {
      return state.filter((newsItem) => newsItem.id !== action.payload);
    }
  }
};

export const NewsProvider = ({ children }: NewsProviderProps) => {
  const [state, dispatch] = useReducer(newsReducer, []);
  return (
    <NewsStateContext.Provider value={state}>
      <NewsDispatchContext.Provider value={dispatch}>{children}</NewsDispatchContext.Provider>
    </NewsStateContext.Provider>
  );
};

const useNewsState = () => {
  const context = useContext(NewsStateContext);
  if (context === undefined) {
    throw new Error('useNewsState must be used within a NewsProvider');
  }
  return context;
};

const useNewsDispatch = () => {
  const context = useContext(NewsDispatchContext);
  if (context === undefined) {
    throw new Error('useNewsDispatch must be used within a NewsProvider');
  }
  return context;
};

export const useNewsById = (id: number) => {
  const { getNewsById } = useNews();
  const news = useNewsState();
  const [newsData, setNewsData] = useState<News | null>(null);
  const [error, setError] = useState<RequestResponse | null>(null);

  useEffect(() => {
    getNewsById(id)
      .then((data) => {
        setNewsData(data);
        setError(null);
      })
      .catch((error: RequestResponse) => {
        setError(error);
        setNewsData(null);
      });
  }, [id, getNewsById, news]);

  return [newsData, error] as const;
};

export const useNews = () => {
  const news = useNewsState();
  const dispatch = useNewsDispatch();

  const getNews = useCallback(async () => {
    return API.getNewsItems().then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const getNewsById = useCallback(
    async (id: number) => {
      const newsItem = news.find((item) => item.id === Number(id));
      if (newsItem) {
        return Promise.resolve(newsItem);
      } else {
        return API.getNewsItem(id).then((response) => {
          if (response.isError) {
            return Promise.reject(response.data);
          } else {
            dispatch({ type: 'add', payload: response.data });
            return Promise.resolve(response.data);
          }
        });
      }
    },
    [news, dispatch],
  );

  const createNews = useCallback(
    async (newsData: NewsRequired) => {
      return API.createNewsItem(newsData).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'add',
            payload: response.data,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  const updateNews = useCallback(
    async (id: number, newsData: NewsRequired) => {
      return API.putNewsItem(id, newsData).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'update',
            payload: response.data,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  const deleteNews = useCallback(
    async (id: number) => {
      return API.deleteNewsItem(id).then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({
            type: 'remove',
            payload: id,
          });
          return Promise.resolve(response.data);
        }
      });
    },
    [dispatch],
  );

  return { NewsProvider, getNews, getNewsById, createNews, updateNews, deleteNews };
};
