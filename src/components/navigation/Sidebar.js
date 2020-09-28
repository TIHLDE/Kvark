import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import URLS from '../../URLS';

// API and store imports
import AuthService from '../../api/services/AuthService';

// Material UI Components
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Project Components
import Link from './Link';

const styles = (theme) => ({
  root: {
    zIndex: 10000,
    backgroundColor: theme.palette.colors.background.light,
  },
  item: {
    height: 56,
    color: theme.palette.colors.text.main,
  },
});

const ActionLink = withStyles(styles)((props) => {
  const { classes } = props;
  return (
    <Fragment>
      <Link onClick={props.to === window.location.pathname ? () => window.location.reload() : null} to={props.to}>
        <ListItem button className={classNames(classes.item, props.className)} color='inherit'>
          <Grid alignItems='center' container direction='column' justify='space-between' wrap='nowrap'>
            <Typography align='center' color='inherit' variant='h5'>
              {props.label}
            </Typography>
          </Grid>
        </ListItem>
      </Link>
      <Divider className={classes.divider} />
    </Fragment>
  );
});

ActionLink.propTypes = {
  to: PropTypes.string.isRequired,
};

const SidebarContent = (props) => {
  const { classes } = props;

  return (
    <Fragment>
      <div className={classes.root}>
        <ActionLink label='Om TIHLDE' to={URLS.about} />
        <ActionLink label='Ny student' to={URLS.newStudent} />
        <ActionLink label='Arrangementer' to={URLS.events} />
        <ActionLink label='Nyheter' to={URLS.news} />
        <ActionLink label='Karriere' to={URLS.jobposts} />
        <ActionLink label='For Bedrifter' to={URLS.company} />
        {/* AuthService.isAuthenticated() && <ActionLink to={URLS.cheatsheet} label='Kokebok' />*/}
        {AuthService.isAuthenticated() ? <ActionLink label='Min side' to={URLS.profile} /> : <ActionLink label='Logg inn' to={URLS.login} />}
      </div>
    </Fragment>
  );
};

SidebarContent.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SidebarContent);
