import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { ThemeType } from 'types/Enums';
import { getCookie, setCookie } from 'api/cookie';
import { getTheme } from '../theme';
import { Theme, MuiThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ContextProps {
  get: Theme;
  getEnum: () => ThemeType;
  set: (n: ThemeType | undefined) => void;
}

const ThemeContext = createContext<ContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [useLightTheme, setUseLightTheme] = useState(!prefersDarkMode);
  const updateTheme = (newThemeName: ThemeType | undefined) => {
    if (newThemeName !== undefined) {
      setUseLightTheme(newThemeName === ThemeType.AUTOMATIC ? !prefersDarkMode : newThemeName === ThemeType.LIGHT);
      setCookie(ThemeType.KEY, newThemeName);
    } else {
      setUseLightTheme(!prefersDarkMode);
      setCookie(ThemeType.KEY, ThemeType.AUTOMATIC);
    }
  };

  const getEnum = (): ThemeType => {
    const cookieValue = getCookie(ThemeType.KEY);
    if (cookieValue === ThemeType.AUTOMATIC || cookieValue === ThemeType.LIGHT || cookieValue === ThemeType.DARK) {
      return cookieValue;
    } else {
      setCookie(ThemeType.KEY, ThemeType.AUTOMATIC);
      return ThemeType.AUTOMATIC;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTheme(getCookie(ThemeType.KEY) as ThemeType), [prefersDarkMode]);

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
