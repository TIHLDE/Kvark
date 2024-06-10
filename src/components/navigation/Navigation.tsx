import { SHOW_NEW_STUDENT_INFO } from 'constant';
import { ReactNode, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import URLS from 'URLS';

import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';
import { useIsAuthenticated } from 'hooks/User';

import BottomBar from 'components/navigation/BottomBar';
import Footer from 'components/navigation/Footer';
import Topbar from 'components/navigation/Topbar';

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

export type NavigationItem =
  | {
      text: string;
      to: string;
      external?: boolean;
      type: 'link';
    }
  | {
      items: {
        external?: boolean;
        text: string;
        to: string;
        title: string;
      }[];
      text: string;
      type: 'dropdown';
    };

const NavigationContent = ({ children }: NavigationProps) => {
  const isAuthenticated = useIsAuthenticated();
  const isMediumScreen = useMediaQuery(MEDIUM_SCREEN);

  const items = useMemo<Array<NavigationItem>>(
    () => [
      {
        items: [
          { title: 'Wiki', text: 'Her finner du all tilgjengelig informasjon om TIHLDE', to: URLS.wiki },
          { title: 'TÖDDEL', text: 'TIHLDE sitt eget studentblad', to: URLS.toddel },
          { title: 'Gruppeoversikt', text: 'Få oversikt over alle verv og grupper', to: URLS.groups.index },
          { title: 'Fondet', text: 'Se hvordan det ligger an med fondet vårt', to: URLS.fondet, external: true },
        ],
        text: 'Generelt',
        type: 'dropdown',
      },
      ...(SHOW_NEW_STUDENT_INFO ? [{ text: 'Ny student', to: URLS.newStudent, type: 'link' } as NavigationItem] : []),
      { text: 'Arrangementer', to: URLS.events, type: 'link' },
      { text: 'Nyheter', to: URLS.news, type: 'link' },
      { text: 'Karriere', to: URLS.jobposts, type: 'link' },
      isAuthenticated
        ? {
            items: [
              { title: 'Kokebok', text: 'Få hjelp til dine øvinger', to: URLS.cheatsheet },
              { title: 'Link-forkorter', text: 'Forkort linker til å peke mot TIHLDE', to: URLS.shortLinks },
              { title: 'QR koder', text: 'Generer dine egne QR koder', to: URLS.qrCodes },
              { title: 'Badges ledertavler', text: 'Se hvem som har flest badges', to: URLS.badges.index },
              { title: 'Galleri', text: 'Se alle bilder fra TIHLDE sine arrangementer', to: URLS.gallery },
              { title: 'Kontres', text: 'Reserver kontoret eller tilhørende utstyr', to: URLS.kontRes, external: true },
            ],
            text: 'For medlemmer',
            type: 'dropdown',
          }
        : { text: 'For bedrifter', to: URLS.company, type: 'link' },
    ],
    [isAuthenticated],
  );

  return (
    <>
      <Helmet>
        <title>TIHLDE</title>
      </Helmet>
      <Topbar items={items} />
      <main className='min-h-[101vh]'>{children}</main>
      <Footer />
      {!isMediumScreen && <BottomBar items={items} />}
    </>
  );
};

const Navigation = ({ children }: NavigationProps) => <NavigationContent>{children}</NavigationContent>;

export default Navigation;
