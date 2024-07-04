import { cn } from 'lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';

import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';

import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import { NavigationItem } from 'components/navigation/Navigation';
import ProfileTopbarButton from 'components/navigation/ProfileTopbarButton';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuTrigger,
} from 'components/ui/navigation-menu';

const TopBarItem = (props: NavigationItem) => {
  const location = useLocation();

  if (props.type === 'link') {
    const selected = location.pathname === props.to;

    return (
      <NavigationMenuItem>
        <Link to={props.to}>
          <NavigationMenuLink
            className={cn(
              'group inline-flex w-max items-center justify-center rounded-md text-sm font-medium transition-colors dark:text-white/80 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-white/80',
              selected && 'dark:text-white text-muted-foreground font-bold',
            )}>
            {props.text}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{props.text}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid gap-3 p-6 grid-cols-2 md:w-[400px] lg:w-[500px]'>
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
  const [scrollLength, setScrollLength] = useState(0);
  const isMediumScreen = useMediaQuery(MEDIUM_SCREEN);

  const handleScroll = () => setScrollLength(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOnTop = useMemo(() => scrollLength < 20, [scrollLength]);

  if (!isMediumScreen) {
    return (
      <header
        className={cn(
          'fixed z-30 w-full top-0 transition-all duration-150 p-2 flex items-center justify-between',
          !isOnTop && 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}>
        <Link aria-label='Til forsiden' to={URLS.landing}>
          <TihldeLogo className='h-[24px] w-auto ml-0 text-primary' size='large' />{' '}
        </Link>
        <ProfileTopbarButton />
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          'fixed z-30 w-full top-0 transition-all duration-150',
          !isOnTop &&
            'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-card/60  dark:supports-[backdrop-filter]:bg-background/60',
        )}>
        <nav className='flex items-center justify-between py-3 px-8'>
          <Link aria-label='Til forsiden' to={URLS.landing}>
            <TihldeLogo className='h-[28px] w-auto ml-0 text-primary' size='large' />{' '}
          </Link>
          <NavigationMenu>
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
