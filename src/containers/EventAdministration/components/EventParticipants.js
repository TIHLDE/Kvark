import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const styles = {
  header: {
    display: 'flex',
    padding: 2,
    '@media only screen and (max-width: 800px)': {
        flexDirection: 'column',
    },
  },
  heading: {
    width: '100%',
  },
  numbers: {
    minWidth: 150,
    textAlign: 'end',
    display: 'flex',
    justifyContent: 'end',
    flexDirection: 'column',
    '@media only screen and (max-width: 800px)': {
        textAlign: 'start',
    },
  },
  content: {
    paddingBottom: 4,
  },
  listView: {
    minHeight: 50,
    width: '100%',
    border: 'solid 1px grey',
  },
};

const EventParticipants = (props) => {
  const {classes, event, closeParticipants} = props;
  return (
    <React.Fragment>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Typography variant='h4'>{event.title}</Typography>
        </div>
        <div className={classes.numbers}>
          <Typography>Antall påmeldte: 50</Typography>
          <Typography>Antall på venteliste: 20</Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.content}>
        <Typography variant='h5'>Påmeldte</Typography>
        <div className={classes.listView}>Ingen her</div>
        <Typography variant='h5'>Venteliste</Typography>
        <div className={classes.listView}>Ingen her</div>
      </div>
      <Button
        onClick={closeParticipants}
        variant='outlined'
        color='primary'>Tilbake</Button>
    </React.Fragment>
  );
};

EventParticipants.propTypes = {
    classes: PropTypes.object,
    event: PropTypes.object,
    closeParticipants: PropTypes.func,
};

export default withStyles(styles)(EventParticipants);
