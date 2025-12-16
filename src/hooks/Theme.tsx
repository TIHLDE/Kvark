import { getCookie, setCookie } from '~/api/cookie';
import { createContext, use, useCallback, useState } from 'react';
import { z } from 'zod';

const UserThemeSchema = z.enum(['light', 'dark']).catch('light');

export type UserTheme = z.infer<typeof UserThemeSchema>;

const themeStorageKey = 'ui-theme';

type ThemeContextProps = {
  theme: UserTheme;
  setTheme: (theme: UserTheme) => void;
};

function getResolvedTheme(theme: unknown): UserTheme {
  const validatedTheme = UserThemeSchema.parse(theme);
  return validatedTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setThemeState] = useState<UserTheme>(() => getResolvedTheme(getCookie(themeStorageKey)));

  const setTheme = useCallback((newTheme: UserTheme) => {
    const validatedTheme = UserThemeSchema.parse(newTheme);
    setCookie(themeStorageKey, validatedTheme);
    setThemeState(validatedTheme);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
