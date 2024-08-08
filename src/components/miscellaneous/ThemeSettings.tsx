import { Moon, Sun } from 'lucide-react';

import { useTheme } from 'hooks/Theme';

import { Button } from 'components/ui/button';

const ThemeSettings = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      className='text-black dark:text-white w-auto h-auto p-0 bg-inherit hover:bg-inherit'
      onClick={() => {
        if (theme === 'dark') {
          setTheme('light');
        } else {
          setTheme('dark');
        }
      }}>
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
};

export default ThemeSettings;
