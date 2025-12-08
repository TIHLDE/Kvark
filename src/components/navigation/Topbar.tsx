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
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-30 w-full top-0 transition-all duration-150 max-md:flex max-md:items-center max-md:justify-between',
          !isOnTop &&
            'border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-card/60  dark:supports-backdrop-filter:bg-background/60',
        )}>
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
    </>
  );
};

export default Topbar;
