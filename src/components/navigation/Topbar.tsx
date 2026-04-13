import { Link } from '@tanstack/react-router';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import { NavigationItem } from '~/components/navigation/Navigation';
import ProfileTopbarButton from '~/components/navigation/ProfileTopbarButton';
import {
  NavigationMenu,
  NavigationMenuArrow,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/utils';
import URLS from '~/URLS';
import React, { useEffect, useState } from 'react';

import { ExternalLink } from '../ui/external-link';

const TopBarItem = (props: NavigationItem) => {
  if (props.hidden === true) {
    return <React.Fragment />;
  }
  if (props.type === 'link') {
    const linkRender =
      props.link.type === 'internal' ? (
        <Link
          activeProps={{
            ['data-active']: true,
          }}
          activeOptions={{
            exact: false,
          }}
          {...props.link.options}
        />
      ) : (
        <ExternalLink href={props.link.href} />
      );

    return (
      <NavigationMenuItem>
        <NavigationMenuLink render={linkRender}>{props.text}</NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{props.text}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid gap-3 p-6 grid-cols-2 lg:grid-cols-3 md:w-[400px] lg:w-[600px]'>
          {props.items.map((item, index) => {
            if (item.hidden === true) {
              return <React.Fragment key={index} />;
            }

            const linkRender =
              item.link.type === 'internal' ? (
                <Link
                  activeProps={{
                    ['data-active']: true,
                  }}
                  activeOptions={{
                    exact: false,
                  }}
                  {...item.link.options}
                />
              ) : (
                <ExternalLink href={item.link.href} />
              );
            return (
              <NavigationMenuLink closeOnClick key={index} render={linkRender}>
                <div className='text-sm leading-none font-medium'>{item.title}</div>
                <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>{item.text}</p>
              </NavigationMenuLink>
            );
          })}
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
    <div>
      <header
        className={cn(
          'h-14 fixed top-0 left-0 right-0 z-30 w-full transition-colors duration-150 grid place-items-center',
          !isOnTop &&
            'border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-card/60 dark:supports-backdrop-filter:bg-background/60',
        )}>
        <nav className='grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_auto_1fr] items-center w-full px-4'>
          <Link aria-label='Til forsiden' to={URLS.landing}>
            <TihldeLogo className='h-7 w-auto ml-0 text-primary' size='large' />
          </Link>
          <NavigationMenu className='max-md:hidden'>
            <NavigationMenuList>
              {items.map((item, i) => (
                <TopBarItem key={i} {...item} />
              ))}
            </NavigationMenuList>
            <NavigationMenuPositioner>
              <NavigationMenuPopup>
                <NavigationMenuArrow />
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenu>
          <div className='flex justify-end'>
            <ProfileTopbarButton />
          </div>
        </nav>
      </header>
      {/* Shift the page content down so that the topbar doesn't cover it */}
      <div className='h-14'></div>
    </div>
  );
};

export default Topbar;
