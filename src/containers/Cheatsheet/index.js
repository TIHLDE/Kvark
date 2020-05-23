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

// Images
import CheatSheetBanner from '../../assets/img/cheatsheetbanner.jpg';

const styles = () => ({

  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    gridGap: '15px',
    paddingTop: '10px',
    paddingBottom: '30px',
    width: '90%',
    position: 'relative',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
      justifyContent: 'center',
      gridAutoFlow: 'row dense',
      padding: '60px 0px 48px 0px',
    },
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '5px',
    '@media only screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr',

    },
  },
  folders: {
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: 5,
    boxShadow: '0px 2px 4px #ddd, 0px 0px 4px #ddd',
    height: 50,
    margin: '5px 0px 5px 0px',
    overflow: 'hidden',
    backgroundColor: 'white',

  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

const Cheatsheet = ({classes}) => {
  return (
    <Navigation footer>
      <div className={classes.wrapper}>
        <Banner title='Kokebok' image={CheatSheetBanner} />
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

