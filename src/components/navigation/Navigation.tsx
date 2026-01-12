import { linkOptions, LinkOptions } from '@tanstack/react-router';
import BottomBar from '~/components/navigation/BottomBar';
import Footer from '~/components/navigation/Footer';
import Topbar from '~/components/navigation/Topbar';
import { SHOW_NEW_STUDENT_INFO } from '~/constant';
import { useIsAuthenticated } from '~/hooks/User';
import URLS from '~/URLS';
import { ReactNode, useMemo } from 'react';

export type NavigationOptions = {
  noFooter: boolean;
  filledTopbar: boolean;
  gutterBottom: boolean;
  gutterTop: boolean;
  title: string;
  darkColor: 'white' | 'blue' | 'black';
  lightColor: 'white' | 'blue' | 'black';
};

export type SetNavigationOptions = Partial<NavigationOptions>;

export type NavigationProps = {
  children?: ReactNode;
};

type BaseNavigationItem = {
  text: string;
  hidden?: boolean;
};

type NavigationLinkItem = BaseNavigationItem & {
  type: 'link';
  link:
    | {
        type: 'internal';
        options: LinkOptions;
      }
    | {
        type: 'external';
        href: string;
      };
};

type NavigationDropdownItem = BaseNavigationItem & {
  type: 'dropdown';
  items: Array<Omit<NavigationLinkItem, 'type'> & { title: string }>;
};

export type NavigationItem = NavigationLinkItem | NavigationDropdownItem;

const NavigationContent = ({ children }: NavigationProps) => {
  const isAuthenticated = useIsAuthenticated();

  const items = useMemo<Array<NavigationItem>>(
    () => [
      {
        type: 'dropdown',
        text: 'Generelt',
        items: [
          { title: 'Wiki', text: 'Her finner du all tilgjengelig informasjon om TIHLDE', link: { type: 'external', href: URLS.external.wiki.wiki } },
          { title: 'TÖDDEL', text: 'TIHLDE sitt eget studentblad', link: { type: 'internal', options: linkOptions({ to: '/toddel' }) } },
          { title: 'Gruppeoversikt', text: 'Få oversikt over alle verv og grupper', link: { type: 'internal', options: linkOptions({ to: '/grupper' }) } },
          { title: 'Interessegrupper', text: 'Se alle interessegrupper', link: { type: 'internal', options: linkOptions({ to: '/interessegrupper' }) } },
          { title: 'Fondet', text: 'Se hvordan det ligger an med fondet vårt', link: { type: 'external', href: URLS.external.fondet } },
        ],
      },

      { type: 'link', text: 'Ny student', hidden: !SHOW_NEW_STUDENT_INFO, link: { type: 'internal', options: linkOptions({ to: '/ny-student' }) } },
      { type: 'link', text: 'Arrangementer', link: { type: 'internal', options: linkOptions({ to: '/arrangementer' }) } },
      { type: 'link', text: 'Nyheter', link: { type: 'internal', options: linkOptions({ to: '/nyheter' }) } },
      { type: 'link', text: 'Stillinger', link: { type: 'internal', options: linkOptions({ to: '/stillingsannonser' }) } },

      {
        type: 'dropdown',
        text: 'For Medlemmer',
        hidden: !isAuthenticated,
        items: [
          { title: 'Opptak', text: 'Søk verv hos TIHLDE', link: { type: 'internal', options: linkOptions({ to: '/opptak' }) } },
          { title: 'Kokebok', text: 'Få hjelp til dine øvinger', link: { type: 'internal', options: linkOptions({ to: '/kokebok/{-$studyId}/{-$classId}' }) } },
          { title: 'Link-forkorter', text: 'Forkort linker til å peke mot TIHLDE', link: { type: 'internal', options: linkOptions({ to: '/linker' }) } },
          { title: 'QR koder', text: 'Generer dine egne QR koder', link: { type: 'internal', options: linkOptions({ to: '/qr-koder' }) } },
          { title: 'Badges ledertavler', text: 'Se hvem som har flest badges', link: { type: 'internal', options: linkOptions({ to: '/badges' }) } },
          { title: 'Galleri', text: 'Se alle bilder fra TIHLDE sine arrangementer', link: { type: 'internal', options: linkOptions({ to: '/galleri' }) } },
          { title: 'Kontres', text: 'Reserver kontoret eller tilhørende utstyr', link: { type: 'external', href: URLS.external.kontRes } },
          { title: 'Endringslogg', text: 'Se changeloggen til denne nettsiden', link: { type: 'internal', options: linkOptions({ to: '/endringslogg' }) } },
        ],
      },
      { type: 'link', text: 'For Bedrifter', link: { type: 'internal', options: linkOptions({ to: '/bedrifter' }) }, hidden: isAuthenticated },
    ],
    [isAuthenticated],
  );

  return (
    <>
      <Topbar items={items} />
      <main className='bg-background text-black dark:text-white min-h-[101vh]'>{children}</main>
      <Footer />
      <BottomBar className='md:hidden' items={items} />
    </>
  );
};

const Navigation = ({ children }: NavigationProps) => <NavigationContent>{children}</NavigationContent>;

export default Navigation;
