import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
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

function Calender(props) {

  const { classes } = props;
  var spacing = "8";

  return (
    <div className={classes.root}>
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

Calender.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calender);