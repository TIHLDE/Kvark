import React from 'react';
import PropTypes from 'prop-types';
import { getUserClass, getUserStudyShort } from '../../../utils';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: 10,
    paddingTop: 10,
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  innerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    color: theme.palette.colors.text.light,
    gridGap: 10,
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
  statistics: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    backgroundColor: theme.palette.colors.background.smoke,
    borderCollapse: 'collapse',
  },
});

const EventParticipants = (props) => {
  const { classes, participants } = props;

  const attendedNo = (attended) => participants.filter((x) => x.has_attended === attended).length;

  const classNo = (userClass) => {
    const no = participants.filter((x) => x.user_info.user_class === userClass).length;
    return no > 0 ? no : '0';
  };
  const studyNo = (userStudy) => {
    const no = participants.filter((x) => x.user_info.user_study === userStudy).length;
    return no > 0 ? no : '0';
  };

  return (
    <React.Fragment>
      <Typography className={classes.lightText}>Ankommet: {attendedNo(true) + ' av ' + attendedNo(false)} påmeldte</Typography>
      <div className={classes.root}>
        <div>
          <Typography className={classes.lightText}>Klasse:</Typography>
          <div className={classes.innerGrid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper className={classes.statistics} key={i} noPadding>
                <Typography variant='subtitle2'>{getUserClass(i)}</Typography>
                <Typography variant='h4'>{classNo(i)}</Typography>
              </Paper>
            ))}
          </div>
        </div>
        <div>
          <Typography className={classes.lightText}>Studie:</Typography>
          <div className={classes.innerGrid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper className={classes.statistics} key={i} noPadding>
                <Typography variant='subtitle2'>{getUserStudyShort(i)}</Typography>
                <Typography variant='h4'>{studyNo(i)}</Typography>
              </Paper>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

EventParticipants.propTypes = {
  classes: PropTypes.object,
  participants: PropTypes.array,
};

export default withStyles(styles)(EventParticipants);
