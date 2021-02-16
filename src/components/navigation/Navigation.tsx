import { ReactNode, ReactElement, useState, useEffect } from 'react';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import { Warning } from 'types/Types';
import { WarningType } from 'types/Enums';

// API and store imports
import { useMisc } from 'api/hooks/Misc';
import { getCookie, setCookie } from 'api/cookie';
import { WARNINGS_READ } from 'constant';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

// Project Components
import Footer from 'components/navigation/Footer';
import Topbar from 'components/navigation/Topbar';
import Snack from 'components/navigation/Snack';
import Container from 'components/layout/Container';

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: '101vh',
    backgroundColor: theme.palette.background.default,
  },
  normalMain: {
    paddingTop: 64,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 56,
    },
  },
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

const Navigation = ({ fancyNavbar = false, isLoading = false, noFooter = false, maxWidth, banner, children }: NavigationProps) => {
  const classes = useStyles();
  const { getWarnings } = useMisc();
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

  return (
    <>
      <Helmet>
        <title>TIHLDE</title>
      </Helmet>
      <Topbar fancyNavbar={fancyNavbar} />
      {warning && (
        <Snack
          className={classNames(classes.snack, classes.grow, warning.type === WarningType.MESSAGE ? classes.snackMessage : classes.snackWarning)}
          message={warning.text}
          onClose={() => closeSnackbar(warning)}
          open={Boolean(warning)}
        />
      )}
      <main className={classNames(classes.main, !fancyNavbar && classes.normalMain)}>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            {banner}
            {maxWidth === false ? <>{children}</> : <Container maxWidth={maxWidth || 'xl'}>{children || <></>}</Container>}
          </>
        )}
      </main>
      {!noFooter && !isLoading && <Footer />}
    </>
  );
};

export default Navigation;
