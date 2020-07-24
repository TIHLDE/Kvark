import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Project Components
import URLS from '../../URLS';
import Banner from '../../components/layout/Banner';
import Navigation from '../../components/navigation/Navigation';
import {getUserStudyLong, getUserStudyShort} from '../../utils';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  wrapper: {
    paddingTop: 10,
    paddingBottom: 30,
    maxWidth: 1200,
    width: '90%',
    position: 'relative',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      padding: '60px 0px 48px 0px',
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 15,
    '@media only screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr',

    },
  },
  link: {
    textDecoration: 'none',
  },
  folders: {
    textAlign: 'center',
    height: 50,
    padding: 10,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: theme.colors.background.main,
    },
  },
  text: {
    fontSize: 20,
    color: theme.colors.text.main,
  },
});

const Cheatsheet = ({classes}) => {
  return (
    <Navigation whitesmoke footer fancyNavbar>
      <Banner title='Kokebok' />
      <div className={classes.wrapper}>
        <Grid className={classes.grid}>
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              <Link key={i} className={classes.link} to={URLS.cheatsheet + ''.concat(getUserStudyShort(i), '/')}>
                <Paper className={classes.folders} noPadding shadow>
                  <Typography className={classes.text}>{getUserStudyLong(i)}</Typography>
                </Paper>
              </Link>
            );
          })}
        </Grid>
      </div>
    </Navigation>
  );
};

Cheatsheet.propTypes = {
  classes: PropTypes.object,

};

export default withStyles(styles)(Cheatsheet);

