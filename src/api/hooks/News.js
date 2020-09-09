import API from '../api';
import { useState, useEffect, useCallback } from 'react';
import { useNewsContext, useNewsState, useNewsDispatch } from '../../context/NewsContext';

export const useNews = (filters = null) => {
  const [state, dispatch] = useNewsContext();
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if ((!filters || Object.keys(filters).length === 0) && state) {
      setNews(state);
      setIsLoading(false);
    } else {
      (async () => {
        setIsLoading(true);
        const response = API.getNewsItems(filters).response();
        response
          .then((data) => {
            data = data || [];
            setIsError(response.isError);
            setNews(data);
            if (!filters || Object.keys(filters).length === 0) {
              dispatch({
                type: 'SET_NEWS',
                payload: data,
              });
            }
          })
          .finally(() => setIsLoading(false));
      })();
    }
  }, [filters, dispatch, state]);

  return [news, isLoading, isError];
};

export const useNewsById = (id) => {
  const state = useNewsState();
  const [newsData, setNewsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const newsItem = state?.find((item) => item.id === Number(id));
    if (newsItem) {
      setNewsData(newsItem);
    } else {
      (async () => {
        setIsLoading(true);
        const response = API.getNewsItem(id).response();
        response
          .then((data) => {
            data = data || [];
            setIsError(response.isError);
            setNewsData(data);
          })
          .finally(() => setIsLoading(false));
      })();
    }
  }, [id, state]);

  return [newsData, isLoading, isError];
};

export const useCreateNews = (newsData, callback) => {
  const dispatch = useNewsDispatch();

  const execute = useCallback(() => {
    (async () => {
      const response = API.createNewsItem(newsData).response();
      response.then((data) => {
        callback(data, response.isError);
        if (!response.isError) {
          dispatch({
            type: 'ADD_NEWS',
            payload: data,
          });
        }
      });
    })();
  }, [newsData, callback, dispatch]);

  return execute;
};

export const usePutNews = (id, newsData, callback) => {
  const dispatch = useNewsDispatch();

  const execute = useCallback(() => {
    (async () => {
      const response = API.putNewsItem(id, newsData).response();
      response.then((data) => {
        callback(data, response.isError);
        if (!response.isError) {
          dispatch({
            type: 'PUT_NEWS',
            payload: newsData,
          });
        }
      });
    })();
  }, [newsData, id, callback, dispatch]);

  return execute;
};

export const useDeleteNews = (id, callback) => {
  const dispatch = useNewsDispatch();

  const execute = useCallback(() => {
    (async () => {
      const response = API.deleteNewsItem(id).response();
      response.then((data) => {
        callback(data, response.isError);
        if (!response.isError) {
          dispatch({
            type: 'DELETE_NEWS',
            payload: id,
          });
        }
      });
    })();
  }, [id, callback, dispatch]);

  return execute;
};

export default { useNews, useNewsById, useCreateNews, usePutNews, useDeleteNews };
