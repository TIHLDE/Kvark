import { ReactNode, ReactElement, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import { Warning } from 'types/Types';
import URLS from 'URLS';
import { WarningType } from 'types/Enums';
import { useIsAuthenticated } from 'api/hooks/User';
import { useMisc } from 'api/hooks/Misc';
import { getCookie, setCookie } from 'api/cookie';
import { WARNINGS_READ } from 'constant';

// Material UI Components
import { makeStyles, LinearProgress, Hidden } from '@material-ui/core';

// Project Components
import Footer from 'components/navigation/Footer';
import Topbar from 'components/navigation/Topbar';
import BottomBar from 'components/navigation/BottomBar';
import Snack from 'components/navigation/Snack';
import Container from 'components/layout/Container';

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: '101vh',
    paddingTop: 64,
    [theme.breakpoints.down('md')]: {
      paddingTop: 0,
      paddingBottom: 64,
    },
  },
  normalMain: {},
  grow: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  snack: {
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
}));

export type NavigationProps = {
  children?: ReactNode;
  banner?: ReactElement;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  noFooter?: boolean;
  fancyNavbar?: boolean;
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

const Navigation = ({ children }: NavigationProps) => {
  const classes = useStyles();
  const { getWarnings } = useMisc();
  const isAuthenticated = useIsAuthenticated();
  const [warning, setWarning] = useState<Warning | null>(null);

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
      <Helmet>
        <title>TIHLDE</title>
      </Helmet>
      <Hidden mdDown>
        <Topbar items={items} />
      </Hidden>
      {warning && (
        <Snack
          className={classNames(classes.snack, classes.grow, warning.type === WarningType.MESSAGE ? classes.snackMessage : classes.snackWarning)}
          message={warning.text}
          onClose={() => closeSnackbar(warning)}
          open={Boolean(warning)}
        />
      )}
      <main className={classes.main}>{children}</main>
      <Hidden lgUp>
        <BottomBar />
      </Hidden>
    </>
  );
};

export default Navigation;
