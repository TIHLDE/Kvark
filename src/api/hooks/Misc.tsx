import { createContext, ReactNode, useContext, useReducer, useCallback } from 'react';

export type Action = { type: 'set redirect-url'; payload: string | null };
export type Dispatch = (action: Action) => void;
export type State = { redirectUrl: string | null };
export type MiscProviderProps = { children: ReactNode };

const MiscStateContext = createContext<State | undefined>(undefined);
const MiscDispatchContext = createContext<Dispatch | undefined>(undefined);

const miscReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set redirect-url': {
      return { ...state, redirectUrl: action.payload };
    }
  }
};

export const MiscProvider = ({ children }: MiscProviderProps) => {
  const [state, dispatch] = useReducer(miscReducer, { redirectUrl: null });
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

  const setLogInRedirectURL = useCallback(
    (redirectUrl) => {
      dispatch({ type: 'set redirect-url', payload: redirectUrl });
    },
    [dispatch],
  );

  const getLogInRedirectURL = useCallback(() => {
    return misc.redirectUrl;
  }, [misc.redirectUrl]);

  return { setLogInRedirectURL, getLogInRedirectURL };
};
