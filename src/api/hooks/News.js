import API from '../api';
import {useState, useEffect, useCallback, useContext} from 'react';
import {NewsContext} from '../../context/NewsContext';

export const useNews = (filters = null) => {
  const {state, dispatch} = useContext(NewsContext);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!filters && state) {
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
              if (!filters) {
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
  const {state} = useContext(NewsContext);
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
  const {dispatch} = useContext(NewsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const execute = useCallback(() => {
    (async () => {
      setIsLoading(true);
      const response = API.createNewsItem(newsData).response();
      response
          .then((data) => {
            setIsError(response.isError);
            callback(data);
            dispatch({
              type: 'ADD_NEWS',
              payload: data,
            });
          })
          .finally(() => setIsLoading(false));
    })();
  }, [newsData, callback, dispatch]);

  return [execute, isLoading, isError];
};

export const usePutNews = (id, newsData, callback) => {
  const {dispatch} = useContext(NewsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const execute = useCallback(() => {
    (async () => {
      setIsLoading(true);
      const response = API.putNewsItem(id, newsData).response();
      response
          .then((data) => {
            setIsError(response.isError);
            callback(data);
            dispatch({
              type: 'PUT_NEWS',
              payload: newsData,
            });
          })
          .finally(() => setIsLoading(false));
    })();
  }, [newsData, id, callback, dispatch]);

  return [execute, isLoading, isError];
};

export const useDeleteNews = (id, callback) => {
  const {dispatch} = useContext(NewsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const execute = useCallback(() => {
    (async () => {
      setIsLoading(true);
      const response = API.deleteNewsItem(id).response();
      response
          .then((data) => {
            setIsError(response.isError);
            callback(data);
            dispatch({
              type: 'DELETE_NEWS',
              payload: id,
            });
          })
          .finally(() => setIsLoading(false));
    })();
  }, [id, callback, dispatch]);

  return [execute, isLoading, isError];
};

export default {useNews, useNewsById, useCreateNews, usePutNews, useDeleteNews};
