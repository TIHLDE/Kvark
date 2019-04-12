import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Project componets/services
import EventService from '../../../api/services/EventService';
import CalendarListView from './CalendarListView';

// Styles
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 4, // MUI Grid requires a padding of half the given spacing.
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

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
    super(props);
    this.state = {
      events: null,
    };
  }

  componentDidMount() {
    EventService.getEvents().then((eventObject) => {

      // // Temp code for creating enough test data.
      // for (let i = 0; i < 15; i++) {
      //   eventObject.push(eventObject[0]);
      // }

     this.setState({events: eventObject});
    });
  }

  render() {
    const { classes } = this.props;
    let spacing = '8';

    return (
      <div className={classes.root}>
        <CalendarListView events={this.state.events} />
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
