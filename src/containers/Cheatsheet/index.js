import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Project Components
import URLS from '../../URLS';
import LinkButton from '../../components/navigation/LinkButton';
import Banner from '../../components/layout/Banner';
import Navigation from '../../components/navigation/Navigation';
import {getUserStudyLong, getUserStudyShort} from '../../utils';

const styles = (theme) => ({
  wrapper: {
    paddingTop: 10,
    maxWidth: 1200,
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
  folders: {
    textAlign: 'center',
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88, 0px 0px 4px ' + theme.colors.border.main + '88',
    height: 50,
    margin: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.light,
    '&:hover': {
      borderColor: theme.colors.background.light + 'bb',
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
              <div className={classes.folders} key = {i}>
                <LinkButton className={classes.folders} to={URLS.cheatsheet + ''.concat(getUserStudyShort(i), '/')}>
                  <Typography className={classes.text}>{getUserStudyLong(i)}</Typography>
                </LinkButton>
              </div>
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

