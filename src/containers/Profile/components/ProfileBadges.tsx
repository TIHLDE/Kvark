import { useUser } from 'api/hooks/User';
import { Badge } from 'types/Types';
import Paper from 'components/layout/Paper';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={0}>
        <Grid alignItems='center' container item justify='center' xs={3}>
          <Grid item>
            <img alt={badge.title} src={badge.image} width={64} />
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h6'>
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
  const { data: user } = useUser();
  return (
    <div>
      {user !== undefined && Boolean(user.badges.length) ? (
        <Grid container spacing={1}>
          {user.badges.map((badge) => {
            return (
              <Grid item key={badge.id} md={6} xs={12}>
                <BadgeItem badge={badge} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography align='center' variant='subtitle1'>
          Du har ingen badges enda
        </Typography>
      )}
    </div>
  );
};

export default ProfileBadges;
