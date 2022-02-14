import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'makeStyles';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Badge } from 'types';

import { useUserBadges } from 'hooks/User';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const useStyles = makeStyles()((theme) => ({
  paper: {
    padding: theme.spacing(2, 1),
    textAlign: 'start',
    minHeight: 110,
    height: '100%',
  },
  completion_percentage: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
  percent: {
    color: theme.palette.error.main,
  },
}));

type BadgeItemProps = {
  badge: Badge;
};

const BadgeItem = ({ badge }: BadgeItemProps) => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={0}>
        <Grid alignItems='center' container item justifyContent='center' xs={3}>
          <Grid item>
            <img alt={badge.title} loading='lazy' src={badge.image} width={64} />
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h3'>
            <strong>{badge.title}</strong>
          </Typography>
          <Grid alignItems='center' container direction='row' wrap='nowrap'>
            <Typography variant='body2'>{badge.description}</Typography>
          </Grid>
          <Typography className={classes.completion_percentage} variant='subtitle2'>
            <span className={classes.percent}>{badge.total_completion_percentage.toFixed(1)}%</span> av medlemmer har denne badgen
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ProfileBadges = () => {
  const { userId } = useParams();
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserBadges(userId);
  const badges = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);
  if (!data) {
    return null;
  } else if (!badges.length) {
    return <NotFoundIndicator header='Fant ingen badges' subtitle={`${userId ? 'Brukeren' : 'Du'} har ingen badges enda`} />;
  }
  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere badges' nextPage={() => fetchNextPage()}>
      <Grid container spacing={1}>
        {badges.map((badge) => (
          <Grid item key={badge.id} md={6} xs={12}>
            <BadgeItem badge={badge} />
          </Grid>
        ))}
      </Grid>
    </Pagination>
  );
};

export default ProfileBadges;
