import React, { createContext, useContext, useReducer, useCallback } from 'react';
import API from 'api/api';
import { Category, Warning, CompaniesEmail } from 'types/Types';

export type Action =
  | { type: 'set redirect-url'; payload: string | null }
  | { type: 'set warnings'; payload: Array<Warning> }
  | { type: 'set categories'; payload: Array<Category> };
export type Dispatch = (action: Action) => void;
export type State = { categories: Array<Category> | null; warnings: Array<Warning> | null; redirectUrl: string | null };
export type MiscProviderProps = { children: React.ReactNode };

const MiscStateContext = createContext<State | undefined>(undefined);
const MiscDispatchContext = createContext<Dispatch | undefined>(undefined);

const miscReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set redirect-url': {
      return { ...state, redirectUrl: action.payload };
    }
    case 'set warnings': {
      return { ...state, warnings: action.payload };
    }
    case 'set categories': {
      return { ...state, categories: action.payload };
    }
  }
};

export const MiscProvider = ({ children }: MiscProviderProps) => {
  const [state, dispatch] = useReducer(miscReducer, { warnings: null, redirectUrl: null, categories: null });
  return (
    <MiscStateContext.Provider value={state}>
      <MiscDispatchContext.Provider value={dispatch}>{children}</MiscDispatchContext.Provider>
    </MiscStateContext.Provider>
  );
};

const useMiscState = () => {
  const context = useContext(MiscStateContext);
  if (context === undefined) {
    throw new Error('useMiscState must be used within a MiscProvider');
  }
  return context;
};

const useMiscDispatch = () => {
  const context = useContext(MiscDispatchContext);
  if (context === undefined) {
    throw new Error('useMiscDispatch must be used within a MiscProvider');
  }
  return context;
};

export const useMisc = () => {
  const misc = useMiscState();
  const dispatch = useMiscDispatch();

  const getWarnings = useCallback(async () => {
    if (misc.warnings) {
      return Promise.resolve(misc.warnings);
    } else {
      return API.getWarning().then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({ type: 'set warnings', payload: response.data });
          return Promise.resolve(response.data);
        }
      });
    }
  }, [dispatch, misc.warnings]);

  const postEmail = useCallback(async (data: CompaniesEmail) => {
    return API.emailForm(data).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const setLogInRedirectURL = useCallback(
    (redirectUrl) => {
      dispatch({ type: 'set redirect-url', payload: redirectUrl });
    },
    [dispatch],
  );

  const getLogInRedirectURL = useCallback(() => {
    return misc.redirectUrl;
  }, [misc.redirectUrl]);

  const getCategories = useCallback(async () => {
    if (misc.categories) {
      return Promise.resolve(misc.categories);
    } else {
      return API.getCategories().then((response) => {
        if (response.isError) {
          return Promise.reject(response.data);
        } else {
          dispatch({ type: 'set categories', payload: response.data });
          return Promise.resolve(response.data);
        }
      });
    }
  }, [dispatch, misc.categories]);

  return { getWarnings, postEmail, setLogInRedirectURL, getLogInRedirectURL, getCategories };
};
