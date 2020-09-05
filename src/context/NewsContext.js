import React, { useReducer, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const NewsStateContext = createContext();
const NewsDispatchContext = createContext();

const newsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NEWS':
      return action.payload;
    case 'ADD_NEWS':
      return [...state, action.payload].sort((a, b) => b.id - a.id);
    case 'PUT_NEWS':
      return state.map((newsItem) => {
        let returnValue = { ...newsItem };
        if (newsItem.id === action.payload.id) {
          returnValue = action.payload;
        }
        return returnValue;
      });
    case 'DELETE_NEWS':
      return state.filter((newsItem) => newsItem.id !== action.payload);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const NewsProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(newsReducer, null);
  return (
    <NewsStateContext.Provider value={state}>
      <NewsDispatchContext.Provider value={dispatch}>{children}</NewsDispatchContext.Provider>
    </NewsStateContext.Provider>
  );
};

NewsProvider.propTypes = {
  children: PropTypes.node.isRequired,
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

const useNewsContext = () => {
  return [useNewsState(), useNewsDispatch()];
};

export { NewsProvider, useNewsState, useNewsDispatch, useNewsContext };
