import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
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
    backgroundColor: theme.colors.background.light,
  },
  item: {
    height: 56,
    color: theme.colors.text.main,
  },
});

const ActionLink = withStyles(styles)((props) => {
  const {classes} = props;
  return (
    <Fragment>
      <Link to={props.to} onClick={props.to === window.location.pathname ? () => window.location.reload() : null}>
        <ListItem className={classNames(classes.item, props.className)} button color="inherit">
          <Grid container direction='column' wrap='nowrap' alignItems='center' justify='space-between'>
            <Typography variant='h5' align='center' color='inherit'>{props.label}</Typography>
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
  const {classes} = props;

  return (

    <Fragment>
      <div className={classes.root}>
        <ActionLink to={URLS.about} label='Om TIHLDE' />
        <ActionLink to={URLS.newStudent} label='Ny student' />
        <ActionLink to={URLS.events} label='Arrangementer' />
        <ActionLink to={URLS.news} label='Nyheter' />
        <ActionLink to={URLS.jobposts} label='Karriere' />
        <ActionLink to={URLS.company} label='For Bedrifter' />
        {/* AuthService.isAuthenticated() && <ActionLink to={URLS.cheatsheet} label='Kokebok' />*/ }
        {AuthService.isAuthenticated() ?
                    <ActionLink to={URLS.profile} label='Min side' /> :
                    <ActionLink to={URLS.login} label='Logg inn' />
        }
      </div>
    </Fragment>
  );
};

SidebarContent.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SidebarContent);
