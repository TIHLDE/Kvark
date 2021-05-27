import { ReactNode, useState, useLayoutEffect, useEffect, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import constate from 'constate';
import { Warning } from 'types/Types';
import URLS from 'URLS';
import { WarningType } from 'types/Enums';
import { useIsAuthenticated } from 'api/hooks/User';
import { useMisc } from 'api/hooks/Misc';
import { getCookie, setCookie } from 'api/cookie';
import { WARNINGS_READ } from 'constant';

// Material UI Components
import { makeStyles, Hidden } from '@material-ui/core';

// Project Components
import Topbar from 'components/navigation/Topbar';
import Footer from 'components/navigation/Footer';
import BottomBar from 'components/navigation/BottomBar';
import Snack from 'components/navigation/Snack';

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: '101vh',
  },
  snack: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    flexWrap: 'nowrap',
    alignItems: 'center',
    position: 'absolute',
    top: 62,
    maxWidth: 'none',
    minHeight: 48,
    width: '100vw',
    height: 'auto',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      top: 56,
    },
  },
  snackWarning: {
    backgroundColor: theme.palette.error.main,
  },
  snackMessage: {
    backgroundColor: theme.palette.colors.tihlde,
  },
  gutterTop: {
    paddingTop: 60,
  },
  gutterBottom: {
    paddingBottom: 80,
  },
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
        title: `${options?.title} · TIHLDE` || DEFAULT_OPTIONS.title,
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
  const classes = useStyles();
  const { getWarnings } = useMisc();
  const isAuthenticated = useIsAuthenticated();
  const [warning, setWarning] = useState<Warning | null>(null);
  const { title, darkColor, lightColor, filledTopbar, noFooter, gutterBottom, gutterTop } = useGetNavigationOptions();

  useEffect(() => {
    let subscribed = true;
    getWarnings().then((data: Array<Warning>) => {
      const warningsRead = getCookie(WARNINGS_READ);
      const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
      if (data?.length && !readArray.includes(data[data.length - 1].id) && subscribed) {
        setWarning(data[data.length - 1]);
      }
    });
    return () => {
      subscribed = false;
    };
  }, [getWarnings]);

  const closeSnackbar = (warning: Warning) => {
    const warningsRead = getCookie(WARNINGS_READ);
    const readArray = (warningsRead === undefined ? [] : warningsRead) as number[];
    readArray.push(warning.id);
    setCookie(WARNINGS_READ, JSON.stringify(readArray));
    setWarning(null);
  };

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

  return (
    <>
      <Helmet>{<title>{title}</title>}</Helmet>
      <Topbar darkColor={darkColor} filledTopbar={filledTopbar} items={items} lightColor={lightColor} />
      {warning && (
        <Snack
          className={classnames(classes.snack, warning.type === WarningType.MESSAGE ? classes.snackMessage : classes.snackWarning)}
          message={warning.text}
          onClose={() => closeSnackbar(warning)}
          open={Boolean(warning)}
        />
      )}
      <main className={classnames(classes.main, gutterTop && classes.gutterTop, gutterBottom && classes.gutterBottom)}>{children}</main>
      {!noFooter && <Footer />}
      <Hidden lgUp>
        <BottomBar items={items} />
      </Hidden>
    </>
  );
};

const Navigation = ({ children }: NavigationProps) => (
  <NavigationProvider>
    <NavigationContent>{children}</NavigationContent>
  </NavigationProvider>
);

export default Navigation;
