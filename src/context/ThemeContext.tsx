import { useCallback, useState, useLayoutEffect, useContext, createContext, ReactNode } from 'react';
import { getCookie, setCookie } from 'api/cookie';
import { getTheme, themes, ThemeTypes } from '../theme';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

const THEME_COOKIE = 'theme-cookie';

interface ContextProps {
  getThemeFromStorage: () => ThemeTypes;
  set: (n: ThemeTypes | undefined) => void;
}

const ThemeContext = createContext<ContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [selectedTheme, setSelectedTheme] = useState<ThemeTypes>('automatic');

  const getThemeType = useCallback((name: ThemeTypes | string | undefined) => {
    if (themes.includes(name as ThemeTypes)) {
      return name as ThemeTypes;
    } else {
      return undefined;
    }
  }, []);

  const updateTheme = useCallback(
    (newTheme: ThemeTypes | string | undefined) => {
      const value = getThemeType(newTheme);
      if (value !== undefined) {
        setSelectedTheme(value);
        setCookie(THEME_COOKIE, value);
      } else {
        setSelectedTheme('automatic');
        setCookie(THEME_COOKIE, 'automatic');
      }
    },
    [getThemeType],
  );

  const getThemeFromStorage = useCallback((): ThemeTypes => {
    const value = getThemeType(getCookie(THEME_COOKIE));
    if (value !== undefined) {
      return value;
    } else {
      setCookie(THEME_COOKIE, 'automatic');
      return 'automatic';
    }
  }, [getThemeType]);

  const themeStore = { getThemeFromStorage: getThemeFromStorage, set: updateTheme };

  useLayoutEffect(() => updateTheme(getThemeFromStorage()), [getThemeFromStorage, updateTheme]);

  console.log(getTheme(selectedTheme, prefersDarkMode));
  return (
    <ThemeContext.Provider value={themeStore}>
      <MuiThemeProvider theme={getTheme(selectedTheme, prefersDarkMode)}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

const useThemeSettings = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useThemeSettings };
