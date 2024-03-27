import { MoonStarIcon, SunIcon } from 'lucide-react';
import { useState } from 'react';
import { ThemeTypes } from 'theme';

import { useThemeSettings } from 'hooks/Theme';
import { useAnalytics } from 'hooks/Utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components/ui/dropdown-menu';

const ThemeSettings = () => {
  const { event } = useAnalytics();
  const themeSettings = useThemeSettings();
  const [themeName, setThemeName] = useState(themeSettings.getThemeFromStorage());

  const changeTheme = (newThemeName: ThemeTypes) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      themeSettings.set(newThemeName);
      event('switch', 'theme', newThemeName);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {themeName === 'light' ? (
          <SunIcon className='cursor-pointer stroke-[1.5px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white' />
        ) : (
          <MoonStarIcon className='cursor-pointer stroke-[1.5px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white' />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => changeTheme('light')}>Lyst</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme('dark')}>Mørkt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme('automatic')}>Automatisk</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSettings;
