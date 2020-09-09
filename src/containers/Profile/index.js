// React
import React, { useState } from 'react';
import URLS from '../../URLS';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

// Serivce imports
import AuthService from '../../api/services/AuthService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import ProfilePaper from './components/ProfilePaper';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
  },
  top: {
    height: 260,
    background: 'radial-gradient(circle at bottom, ' + theme.colors.gradient.profile.top + ', ' + theme.colors.gradient.profile.bottom + ')',
  },
  main: {
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
    top: '-60px',
    padding: '28px',
    paddingTop: '110px',
    textAlign: 'center',
  },
  topSpacing: {
    marginTop: 10,
  },
});

function Profile(props) {
  const { classes, history } = props;
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);
    AuthService.logOut();
    history.push(URLS.landing);
  };

  return (
    <Navigation fancyNavbar footer isLoading={isLoading} whitesmoke>
      <Helmet>
        <title>Profil - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.top}></div>
        <div className={classes.main}>
          {AuthService.isAuthenticated() ? (
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
}

Profile.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withStyles(styles)(Profile);
