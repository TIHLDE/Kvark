import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { THEME } from 'types/Enums';
import { getCookie, setCookie } from 'api/cookie';
import { getTheme } from '../theme';
import { Theme, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ContextProps {
  get: Theme;
  getEnum: () => THEME;
  set: (n: string) => void;
}

const ThemeContext = createContext<ContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [useLightTheme, setUseLightTheme] = useState(true);
  const updateTheme = (newThemeName: string) => {
    setUseLightTheme(newThemeName === THEME.AUTOMATIC ? !prefersDarkMode : newThemeName === THEME.LIGHT);
    setCookie(THEME.KEY, newThemeName);
  };

  const getEnum = (): THEME => {
    const cookieValue = getCookie(THEME.KEY);
    if (cookieValue === THEME.AUTOMATIC || cookieValue === THEME.LIGHT || cookieValue === THEME.DARK) {
      return cookieValue;
    } else {
      setCookie(THEME.KEY, THEME.AUTOMATIC);
      return THEME.AUTOMATIC;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTheme(getCookie(THEME.KEY)), [prefersDarkMode]);

  const themeStore = { get: getTheme(useLightTheme), getEnum: getEnum, set: updateTheme };

  return (
    <ThemeContext.Provider value={themeStore}>
      <MuiThemeProvider theme={getTheme(useLightTheme)}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
export { ThemeProvider, useTheme };
