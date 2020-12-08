import React, { Fragment } from 'react';
import classNames from 'classnames';
import URLS from 'URLS';
import { Link } from 'react-router-dom';

// API and store imports
import { useAuth } from 'api/hooks/Auth';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.colors.background.light,
  },
  link: {
    textDecoration: 'none',
  },
  item: {
    height: 56,
    color: theme.palette.colors.text.main,
  },
}));

type ActionLinkProps = {
  className?: string;
  label: string;
  to: string;
};

const ActionLink = ({ className, label, to }: ActionLinkProps) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Link className={classes.link} onClick={to === window.location.pathname ? () => window.location.reload() : undefined} to={to}>
        <ListItem button className={classNames(classes.item, className)} color='inherit'>
          <Grid alignItems='center' container direction='column' justify='space-between' wrap='nowrap'>
            <Typography align='center' color='inherit' variant='h3'>
              {label}
            </Typography>
          </Grid>
        </ListItem>
      </Link>
      <Divider />
    </Fragment>
  );
};

const Sidebar = () => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  return (
    <Fragment>
      <div className={classes.root}>
        <ActionLink label='Om TIHLDE' to={URLS.about} />
        <ActionLink label='Ny student' to={URLS.newStudent} />
        <ActionLink label='Arrangementer' to={URLS.events} />
        <ActionLink label='Nyheter' to={URLS.news} />
        <ActionLink label='Karriere' to={URLS.jobposts} />
        {isAuthenticated() ? <ActionLink label='Kokebok' to={URLS.cheatsheet} /> : <ActionLink label='For Bedrifter' to={URLS.company} />}
        {isAuthenticated() ? <ActionLink label='Min side' to={URLS.profile} /> : <ActionLink label='Logg inn' to={URLS.login} />}
      </div>
    </Fragment>
  );
};

export default Sidebar;
