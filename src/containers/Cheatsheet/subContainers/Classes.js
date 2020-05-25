import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Project Components
import URLS from '../../../URLS';
import LinkButton from '../../../components/navigation/LinkButton';
import Banner from '../../../components/layout/Banner';
import Navigation from '../../../components/navigation/Navigation';

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
    margin: 0,
    height: 50,
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

const Classes = (props) => {
  const {classes, match} = props;
  const {studyId} = match.params;

  return (
    <Navigation whitesmoke footer fancyNavbar>
      <Banner title='Kokebok' text={studyId} />
      <div className={classes.wrapper}>
        <Grid className={classes.grid}>
          {studyId === 'DigSam' ? [4, 5].map((i) =>
            (<div key={i} className={classes.folders}>
              <LinkButton to={URLS.cheatsheet.concat(studyId, '/', String(i), '/')}>
                <Typography className={classes.text}>{String(i).concat('. klasse')}</Typography>
              </LinkButton></div>)) :
            [1, 2, 3].map((i) =>
              (<div key ={i} className={classes.folders}>
                <LinkButton className={classes.folders} to={URLS.cheatsheet.concat(studyId, '/', String(i), '/')}>
                  <Typography className={classes.text}>{String(i).concat('. klasse')}</Typography>
                </LinkButton>
              </div>))
          }
        </Grid>
      </div>
    </Navigation>

  );
};

Classes.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(styles)(Classes);
