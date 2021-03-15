import URLS from 'URLS';
import { Link, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useIsAuthenticated, useLogout } from 'api/hooks/User';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from 'components/navigation/Navigation';
import ProfilePaper from 'containers/Profile/components/ProfilePaper';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 260,
    background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
  },
  paper: {
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
  const isAuthenticated = useIsAuthenticated();
  const logOut = useLogout();

  const logout = () => {
    logOut();
    navigate(URLS.landing);
  };

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Profil - TIHLDE</title>
      </Helmet>
      <div>
        {isAuthenticated ? (
          <ProfilePaper logoutMethod={logout} />
        ) : (
          <Paper className={classes.paper} noPadding>
            <Typography variant='h3'>Du må være logget inn for å se profilen din</Typography>
            <Link to={URLS.login}>
              <Button className={classes.topSpacing} color='primary' variant='contained'>
                Logg inn
              </Button>
            </Link>
          </Paper>
        )}
      </div>
    </Navigation>
  );
};

export default Profile;
