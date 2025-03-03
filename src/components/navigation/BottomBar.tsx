import Logo from '~/components/miscellaneous/TihldeLogo';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import { NavigationItem } from '~/components/navigation/Navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/components/ui/drawer';
import { useIsAuthenticated } from '~/hooks/User';
import { cn } from '~/lib/utils';
import { BriefcaseBusiness, Calendar, Menu, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { href, Link } from 'react-router';

import NavLink from '../ui/navlink';

type Item = {
  icon: JSX.Element;
  text: string;
  to: string;
};

export type BottomBarProps = {
  items: Array<NavigationItem>;
  className?: string;
};

const BottomBar = ({ items, className }: BottomBarProps) => {
  const isAuthenticated = useIsAuthenticated();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const actions: Array<Item> = [
    {
      icon: <Logo className='w-auto h-5' size='small' />,
      text: 'Hjem',
      to: href('/'),
    },
    {
      icon: <Calendar className='h-5 stroke-[1.5px] mx-auto' />,
      text: 'Arrangementer',
      to: href('/arrangementer'),
    },
    {
      icon: <Newspaper className='h-5 stroke-[1.5px] mx-auto' />,
      text: 'Nyheter',
      to: href('/nyheter'),
    },
    {
      icon: <BriefcaseBusiness className='h-5 stroke-[1.5px] mx-auto' />,
      text: 'Karriere',
      to: href('/karriere'),
    },
  ];

  return (
    <div
      className={cn(
        'fixed w-full z-30 rounded-t-md border-t bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}>
      <div className='flex items-center justify-between px-8 py-2'>
        {actions.map((action, index) => (
          <Link className='text-center' key={index} to={action.to}>
            {action.icon}
            <p className='text-xs'>{action.text}</p>
          </Link>
        ))}

        <Drawer onOpenChange={setMenuOpen} open={menuOpen}>
          <DrawerTrigger asChild>
            <div className='text-center'>
              <Menu className='mx-auto h-5 stroke-[1.5px]' />
              <p className='text-xs'>Meny</p>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                <TihldeLogo className='w-auto h-12' size='small' />
              </DrawerTitle>
            </DrawerHeader>
            <Accordion className='px-8 space-y-4 mb-32 text-xl' collapsible type='single'>
              <div className='space-y-4 pb-4'>
                {items.map((item, index) => (
                  <div key={index}>
                    {item.type === 'link' && (
                      <Link onClick={() => setMenuOpen(false)} to={item.to}>
                        {item.text}
                      </Link>
                    )}

                    {item.type === 'dropdown' && (
                      <AccordionItem className='border-none' value={index.toString()}>
                        <AccordionTrigger className='py-0 data-[state=open]:pb-2'>{item.text}</AccordionTrigger>
                        <AccordionContent>
                          <div className='space-y-2 px-2 text-lg'>
                            {item.items.map((subItem, subIndex) => (
                              <Link className='block' key={subIndex} onClick={() => setMenuOpen(false)} to={subItem.to}>
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </div>
                ))}
              </div>

              {isAuthenticated && (
                <NavLink onClick={() => setMenuOpen(false)} to='/profil/:userId?'>
                  Min profil
                </NavLink>
              )}

              {!isAuthenticated && (
                <NavLink onClick={() => setMenuOpen(false)} to='/logg-inn'>
                  Logg inn
                </NavLink>
              )}
            </Accordion>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default BottomBar;
