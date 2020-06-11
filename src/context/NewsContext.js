import React, {useReducer, createContext} from 'react';
import PropTypes from 'prop-types';

export const NewsContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NEWS':
      return action.payload;
    case 'ADD_NEWS':
      return [...state, action.payload];
    case 'PUT_NEWS':
      return state.map((newsItem) => {
        let returnValue = {...newsItem};
        if (newsItem.id === action.payload.id) {
          returnValue = action.payload;
        }
        return returnValue;
      });
    case 'DELETE_NEWS':
      return state.filter((newsItem) => newsItem.id !== action.payload);
    default:
      throw new Error();
  }
};

export const NewsContextProvider = (props) => {
  const {children} = props;
  const [state, dispatch] = useReducer(reducer, null);

  return (
    <NewsContext.Provider value={{state, dispatch}}>
      {children}
    </NewsContext.Provider>
  );
};

NewsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
