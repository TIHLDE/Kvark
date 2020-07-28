import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Helmet from 'react-helmet';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Calendar from './components/Calendar';
import NewsListView from './components/NewsListView';
import Wave from './components/Wave';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
  },
  section: {
    padding: 48,
    maxWidth: 1000,
    width: '100%',
    margin: 'auto',
    '@media only screen and (max-width: 1200px)': {
      padding: '48px 0',
    },
  },
  topSection: {
    padding: 0,
    margin: 'unset',
    width: '100%',
    maxWidth: 'none',
    minHeight: '501px',
  },
  smoke: {
    width: '100%',
    backgroundColor: theme.colors.background.smoke,
    marginTop: '-3px',
    zIndex: '25',
  },
  header: {
    marginTop: '2px',
    marginBottom: '20px',
    color: theme.colors.text.main,
  },
});

function NewLanding({classes}) {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation footer whitesmoke fancyNavbar>
      <Helmet>
        <title>Forsiden - TIHLDE</title>
      </Helmet>
      <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
        <div className={classNames(classes.section, classes.topSection)}>
          <Wave />
        </div>
        <div className={classes.smoke}>
          <div className={classes.section}>
            <Typography variant='h4' color="inherit" align="center" className={classes.header}>Nyheter</Typography>
            <NewsListView />
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='h4' color="inherit" align="center" className={classes.header}>Arrangementer</Typography>
          <Calendar />
        </div>
      </Grid>
    </Navigation>
  );
}

NewLanding.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NewLanding);
