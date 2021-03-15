import { Fragment, useEffect, useMemo, useState } from 'react';
import { useUsers } from 'api/hooks/User';
import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Icons
import MembersIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import WaitingIcon from '@material-ui/icons/PlaylistAddRounded';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 220,
    background: theme.palette.colors.gradient.main.top,
  },
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const GroupOverview = () => {
  const classes = useStyles();

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Gruppeoversikt</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography variant='h1'>Gruppeoversikt</Typography>
      </Paper>
    </Navigation>
  );
};

export default GroupOverview;
