import { Fragment, useEffect, useMemo, useState } from 'react';
import { useGroups } from 'api/hooks/Group';
import { Group } from 'types/Types';
import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Icons
import WaitingIcon from '@material-ui/icons/PlaylistAddRounded';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import GroupItem from './components/GroupItem';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 220,
    background: theme.palette.colors.gradient.main.top,
  },
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  groupContainer: {
    display: 'grid',
    gridGap: theme.spacing(3),
    gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
    gridAutoRows: '7rem',
    marginBottom: theme.spacing(5),
  },
  undertitle: {
    fontSize: '1.6rem',
  },
  marginMed: {
    marginBottom: theme.spacing(5),
  },
  marginSm: {
    marginBottom: theme.spacing(3),
  },
}));

interface Map {
  [key: string]: string | undefined;
}

const groupTypes: Map = {
  BOARD: 'Hovedstyret',
  SUBGROUP: 'Undergrupper',
  COMMITTEE: 'Komitéer',
};

const GroupOverview = () => {
  const classes = useStyles();
  const { data } = useGroups();

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Gruppeoversikt</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography className={classes.marginMed} variant='h1'>
          Gruppeoversikt
        </Typography>
        {[...new Set(data?.map((group) => group.type))].map((groupType) => {
          return (
            <div key={groupType}>
              <Typography className={[classes.marginSm, classes.undertitle].join(' ')} variant='h4'>
                {groupTypes[groupType]}
              </Typography>
              <div className={classes.groupContainer}>
                {data
                  ?.filter((group) => group.type === groupType)
                  .map((group) => {
                    return <GroupItem group={group} key={group.name} />;
                  })}
              </div>
            </div>
          );
        })}
      </Paper>
    </Navigation>
  );
};

export default GroupOverview;
