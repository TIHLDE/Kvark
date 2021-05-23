import { ReactNode, ReactElement } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

// Material UI Components
import { makeStyles, Hidden } from '@material-ui/core';

// Project Components
import Footer from 'components/navigation/Footer';
import Container from 'components/layout/Container';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import ProfileTopbarButton, { ProfileTopbarButtonProps } from 'components/navigation/ProfileTopbarButton';

const useStyles = makeStyles((theme) => ({
  top: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    background: theme.palette.colors.gradient.main.top,
    zIndex: theme.zIndex.drawer,
  },
  topbar: {
    padding: theme.spacing(0.5),
    zIndex: theme.zIndex.drawer,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    width: 'auto',
    marginLeft: 0,
  },
}));

export type PageProps = {
  children?: ReactNode;
  banner?: ReactElement;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  noFooter?: boolean;
  filledTopbar?: boolean;
  title?: string;
} & ProfileTopbarButtonProps;

const Page = ({ darkColor, lightColor, filledTopbar = false, title, noFooter = false, maxWidth = 'xl', banner, children }: PageProps) => {
  const classes = useStyles();
  return (
    <>
      <Helmet>{title && <title>{`${title} · TIHLDE`}</title>}</Helmet>
      <Hidden lgUp>
        <div className={classes.topbar}>
          <Link to={URLS.landing}>
            <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
          </Link>
          <ProfileTopbarButton darkColor={darkColor} lightColor={lightColor} />
        </div>
      </Hidden>
      {banner}
      {maxWidth === false ? children : <Container maxWidth={maxWidth}>{children || <></>}</Container>}
      {!noFooter && <Footer />}
      <Hidden mdDown>{filledTopbar && <div className={classes.top} />}</Hidden>
    </>
  );
};

export default Page;
