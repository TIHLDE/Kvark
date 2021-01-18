import { useState } from 'react';
import URLS from 'URLS';
import { Link, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useAuth } from 'api/hooks/Auth';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from 'components/navigation/Navigation';
import ProfilePaper from 'containers/Profile/components/ProfilePaper';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '101vh',
    width: '100%',
    paddingBottom: theme.spacing(3),
  },
  top: {
    height: 260,
    background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
  },
  main: {
    width: 'calc(100% - 20px)',
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
  },
  paper: {
    width: '90%',
    maxWidth: 750,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: -60,
    padding: theme.spacing(4),
    paddingTop: theme.spacing(13),
    textAlign: 'center',
  },
  topSpacing: {
    marginTop: theme.spacing(1),
  },
}));

const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { logOut, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);
    logOut();
    navigate(URLS.landing);
  };

  return (
    <Navigation fancyNavbar isLoading={isLoading}>
      <Helmet>
        <title>Profil - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          {isAuthenticated() ? (
            <ProfilePaper logoutMethod={logout} />
          ) : (
            <Paper className={classes.paper} noPadding>
              <Typography variant='h6'>Du må være logget inn for å se profilen din</Typography>
              <Link to={URLS.login}>
                <Button className={classes.topSpacing} color='primary' variant='contained'>
                  Logg inn
                </Button>
              </Link>
            </Paper>
          )}
        </div>
      </div>
    </Navigation>
  );
};

export default Profile;
