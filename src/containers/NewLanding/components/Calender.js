import React, {useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import CalendarToday from '@material-ui/icons/CalendarToday';

// Project componets/services
import EventService from '../../../api/services/EventService';

import Image from "../../../assets/img/glad.jpg"; // Remove this after testing

// Styles
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  eventListRow: {
    display: 'flex',
    backgroundColor: 'white',
    maxHeight: 70,
    overflow: 'hidden'
  },
  eventListContainer: {
    padding: 1,
    display: 'grid',
    gridGap: '1px',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  eventImageContainer: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    display: 'inline-flex'
  },
  eventImage: {
    objectFit: 'cover',
  },
  eventTitle: {
    flexGrow: 1,
    padding: 5,
  },
  eventInfo: {
    paddingRight: '20px',
    textAlign: 'center',
  },
  eventContainer: {
    display: 'flex',
    flexGrow: 1,
    '@media only screen and (max-width: 700px)': {
      display: 'block'
    }
  },
  hiddenOnMobile: {
    '@media only screen and (max-width: 700px)': {
      display: 'none'
    }
  }
});


function CalendarListItem(props) {
  const {classes} = props
  //props.eventData.image

  const start = moment(props.eventData.start, ['YYYY-MM-DD HH:mm'], 'nb');

  return (
    <div className={classes.eventListRow}>
      <div className={classes.eventImageContainer}>
        <img className={classes.eventImage} src={Image} alt={props.eventData.image_alt} />
      </div>
      <div className={classes.eventContainer}>
        <div className={classes.eventTitle}>
          <Typography align="center" variant="title">{props.eventData.title}</Typography>
        </div>
        <div className={classes.eventInfo}>
          <div><CalendarToday/> {start.format('DD.MM.YYYY')}</div>
          <div className={classes.hiddenOnMobile}>{start.format('HH:mm')}</div>
          <div className={classes.hiddenOnMobile}>{props.eventData.location}</div>
        </div>
      </div>
    </div>
  )
}

function CalendarListView(props) {
  const {classes} = props
  return (
    <Paper className={classes.eventListContainer}>
      {props.events && props.events.map((eventData) => {
        return (<CalendarListItem classes={classes} eventData={eventData} />);
      })}
    </Paper>
  )
}

function FormRow(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
      <Grid item xs={1}>
        <Paper className={classes.paper}>item</Paper>
      </Grid>
    </React.Fragment>
  );
}

FormRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

class Calender extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      events: null
    }
  }

  componentDidMount() {
    EventService.getEvents().then((eventObject) => {
     this.setState({events: eventObject});
    });
  }

  render() {
    const { classes } = this.props;
    var spacing = "8";

    return (
      <div className={classes.root}>
        <CalendarListView classes={classes} events={this.state.events} />
        <br/>
        <Grid container spacing={Number(spacing)}>
          <Grid container justify="center" alignItems="center" item xs={12} spacing={Number(spacing)}>
            <FormRow classes={classes} />
          </Grid>
          <Grid container justify="center" alignItems="center" item xs={12} spacing={Number(spacing)}>
            <FormRow classes={classes} />
          </Grid>
          <Grid container justify="center" alignItems="center" item xs={12} spacing={Number(spacing)}>
            <FormRow classes={classes} />
          </Grid>
          <Grid container justify="center" alignItems="center" item xs={12} spacing={Number(spacing)}>
            <FormRow classes={classes} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Calender.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calender);
