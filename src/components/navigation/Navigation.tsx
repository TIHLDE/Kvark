import { ReactNode, useState, useLayoutEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Helmet from 'react-helmet';
import constate from 'constate';
import URLS from 'URLS';
import { WarningType } from 'types/Enums';
import { useIsAuthenticated } from 'api/hooks/User';
import { useWarnings } from 'api/hooks/Warnings';

// Material UI Components
import { Theme, useMediaQuery, Snackbar as MaterialSnackbar, Alert, styled } from '@material-ui/core';

// Project Components
import Topbar from 'components/navigation/Topbar';
import Footer from 'components/navigation/Footer';
import BottomBar from 'components/navigation/BottomBar';
const MuiLinkify = lazy(() => import('material-ui-linkify'));

const Snackbar = styled(MaterialSnackbar)(({ theme }) => ({
  maxWidth: `calc(100% - ${theme.spacing(2)})`,
  width: theme.breakpoints.values.lg,
  top: '70px !important',
  [theme.breakpoints.down('lg')]: {
    position: 'absolute',
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'gutterTop' && prop !== 'gutterBottom' })<
  Pick<NavigationOptions, 'gutterTop' | 'gutterBottom'>
>(({ gutterTop, gutterBottom }) => ({
  minHeight: '101vh',
  ...(gutterTop && { paddingTop: 60 }),
  ...(gutterBottom && { paddingBottom: 80 }),
}));

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

const DEFAULT_OPTIONS: NavigationOptions = {
  darkColor: 'white',
  lightColor: 'white',
  noFooter: false,
  filledTopbar: false,
  title: 'TIHLDE',
  gutterBottom: false,
  gutterTop: false,
};

const useNavigationContext = () => {
  const [navigationOptions, setNavigationOptions] = useState<NavigationOptions>(DEFAULT_OPTIONS);
  const options = useMemo(() => navigationOptions, [navigationOptions]);
  const setOptions = useCallback(
    (options?: SetNavigationOptions) =>
      setNavigationOptions({
        darkColor: options?.darkColor || DEFAULT_OPTIONS.darkColor,
        lightColor: options?.lightColor || DEFAULT_OPTIONS.lightColor,
        filledTopbar: options?.filledTopbar || DEFAULT_OPTIONS.filledTopbar,
        gutterBottom: options?.gutterBottom || DEFAULT_OPTIONS.gutterBottom,
        gutterTop: options?.gutterTop || DEFAULT_OPTIONS.gutterTop,
        noFooter: options?.noFooter || DEFAULT_OPTIONS.noFooter,
        title: options?.title ? `${options?.title} · TIHLDE` : DEFAULT_OPTIONS.title,
      }),
    [],
  );
  const reset = useCallback(() => setNavigationOptions(DEFAULT_OPTIONS), []);
  return { setOptions, reset, options };
};

const [NavigationProvider, useSetOptions, useGetNavigationOptions, useResetOptions] = constate(
  useNavigationContext,
  (value) => value.setOptions,
  (value) => value.options,
  (value) => value.reset,
);

export const useSetNavigationOptions = (options?: SetNavigationOptions) => {
  const setOptions = useSetOptions();
  const resetOptions = useResetOptions();
  useLayoutEffect(() => {
    setOptions(options);
    return () => {
      resetOptions();
    };
  }, [options]);
};

export type NavigationProps = {
  children?: ReactNode;
};

export type NavigationItem = {
  items?: {
    text: string;
    to: string;
  }[];
  text: string;
  to?: string;
  type: 'dropdown' | 'link';
};

const NavigationContent = ({ children }: NavigationProps) => {
  const { data: warnings = [], closeWarning } = useWarnings();
  const isAuthenticated = useIsAuthenticated();
  const { title, darkColor, lightColor, filledTopbar, noFooter, gutterBottom, gutterTop } = useGetNavigationOptions();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const items = useMemo<Array<NavigationItem>>(
    () => [
      {
        items: [
          { text: 'Om TIHLDE', to: URLS.pages },
          { text: 'Ny student', to: URLS.newStudent },
          { text: 'Gruppeoversikt', to: URLS.groups },
        ],
        text: 'Generelt',
        type: 'dropdown',
      },
      { text: 'Ny student', to: URLS.fadderuka, type: 'link' },
      { text: 'Arrangementer', to: URLS.events, type: 'link' },
      { text: 'Nyheter', to: URLS.news, type: 'link' },
      { text: 'Karriere', to: URLS.jobposts, type: 'link' },
      isAuthenticated
        ? {
            items: [
              { text: 'Kokebok', to: URLS.cheatsheet },
              { text: 'Link-forkorter', to: URLS.shortLinks },
            ],
            text: 'For medlemmer',
            type: 'dropdown',
          }
        : { text: 'For bedrifter', to: URLS.company, type: 'link' },
    ],
    [isAuthenticated],
  );

  const warning = useMemo(() => (warnings.length ? warnings[warnings.length - 1] : undefined), [warnings]);

  return (
    <>
      <Helmet>{<title>{title}</title>}</Helmet>
      <Topbar darkColor={darkColor} filledTopbar={filledTopbar} items={items} lightColor={lightColor} />
      {warning && (
        <Suspense fallback={null}>
          <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'top' }} key={warning.id} open>
            <Alert elevation={6} onClose={() => closeWarning(warning.id)} severity={warning.type === WarningType.MESSAGE ? 'info' : 'warning'} variant='filled'>
              <MuiLinkify LinkProps={{ color: 'inherit', underline: 'always' }}>{warning.text}</MuiLinkify>
            </Alert>
          </Snackbar>
        </Suspense>
      )}
      <Main gutterBottom={gutterBottom} gutterTop={gutterTop}>
        {children}
      </Main>
      {!noFooter && <Footer />}
      {lgDown && <BottomBar items={items} />}
    </>
  );
};

const Navigation = ({ children }: NavigationProps) => (
  <NavigationProvider>
    <NavigationContent>{children}</NavigationContent>
  </NavigationProvider>
);

export default Navigation;
