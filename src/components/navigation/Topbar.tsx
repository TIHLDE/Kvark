import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import type { NavigationItem } from '~/components/navigation/Navigation';
import ProfileTopbarButton from '~/components/navigation/ProfileTopbarButton';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/utils';
import URLS from '~/URLS';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

const TopBarItem = (props: NavigationItem) => {
  const location = useLocation();

  if (props.type === 'link') {
    const selected = location.pathname === props.to;

    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            className={cn(
              'group inline-flex w-max items-center justify-center rounded-md text-sm font-medium transition-colors dark:text-white/80 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-white/80',
              selected && 'dark:text-white text-muted-foreground font-bold',
            )}
            to={props.to}
          >
            {props.text}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{props.text}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid gap-3 p-6 grid-cols-2 lg:grid-cols-3 md:w-[400px] lg:w-[600px]'>
          {props.items.map((item, index) => (
            <NavigationMenuListItem href={item.to} key={index} title={item.title}>
              {item.text}
            </NavigationMenuListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export type TopbarProps = {
  items: Array<NavigationItem>;
};

const Topbar = ({ items }: TopbarProps) => {
  const [isOnTop, setIsOnTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsOnTop(window.scrollY < 20);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsOnTop]);

  return (
    <>
      <header
        className={cn(
          'fixed z-30 w-full top-0 transition-all duration-150 max-md:flex max-md:items-center max-md:justify-between',
          !isOnTop &&
            'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-card/60  dark:supports-[backdrop-filter]:bg-background/60',
        )}
      >
        <nav className='flex items-center justify-between py-3 px-8 w-full'>
          <Link aria-label='Til forsiden' to={URLS.landing}>
            <TihldeLogo className='h-[28px] w-auto ml-0 text-primary' size='large' />
          </Link>
          <NavigationMenu className='max-md:hidden'>
            <NavigationMenuList>
              {items.map((item, i) => (
                <TopBarItem key={i} {...item} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className='flex justify-end'>
            <ProfileTopbarButton />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Topbar;
