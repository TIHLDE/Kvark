import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

// Icons
import MembersIcon from '@material-ui/icons/PlaylistAddCheck';
import WaitingIcon from '@material-ui/icons/PlaylistAdd';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';
import Members from './tabs/Members';

const styles = (theme) => ({
  top: {
    height: 220,
    background: theme.colors.gradient.main.top,
    paddingBottom: 5,
  },
  root: {
    minHeight: '100vh',
    maxWidth: 1200,
    margin: 'auto',
    paddingBottom: 30,
  },
  content: {
    width: '90%',
    maxWidth: 1200,
    margin: '-60px auto',
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 30,
    padding: '28px 10px',
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  tabs: {
    marginTop: '10px',
    marginBottom: 1,
    backgroundColor: theme.colors.background.light,
    color: theme.colors.text.light,
    width: '100%',
  },
  header: {
    color: theme.colors.text.main,
  },
});

function UserAdmin(props) {
  const { classes } = props;
  const [tab, setTab] = useState(0);

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation fancyNavbar whitesmoke>
      <Helmet>
        <title>Brukeradmin - TIHLDE</title>
      </Helmet>
      <div className={classes.top}></div>
      <Paper className={classes.content}>
        <Grid alignItems='center' className={classes.root} container direction='column' wrap='nowrap'>
          <Typography className={classes.header} variant='h4'>
            Brukeradmin
          </Typography>
          <Tabs centered className={classes.tabs} onChange={(e, newTab) => setTab(newTab)} scrollButtons='on' value={tab} variant='fullWidth'>
            <Tab icon={<MembersIcon />} id='0' label='Medlemmer' />
            <Tab icon={<WaitingIcon />} id='1' label='Ventende' />
          </Tabs>
          {tab === 0 && <Members isMember />}
          {tab === 1 && <Members />}
        </Grid>
      </Paper>
    </Navigation>
  );
}

UserAdmin.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(UserAdmin);
