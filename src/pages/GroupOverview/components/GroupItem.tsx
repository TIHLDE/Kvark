import { Link } from 'react-router-dom';
import { Group } from 'types';
import URLS from 'URLS';

// Material UI
import { makeStyles } from 'makeStyles';
import { Theme, Skeleton, ButtonBase, Typography } from '@mui/material';

// Icons
import MembersIcon from '@mui/icons-material/PersonRounded';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 90,
  },
  leader: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
    },
  },
  name: {
    marginLeft: theme.spacing(1),
    fontSize: '0.8rem',
  },
}));

export type GroupItemProps = {
  group: Group;
  background?: keyof Theme['palette']['background'];
};

const GroupItem = ({ group, background = 'paper' }: GroupItemProps) => {
  const { classes } = useStyles();

  return (
    <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
      <ButtonBase className={classes.container} component={Link} focusRipple to={`${URLS.groups}${group.slug}/`}>
        <Typography variant='h3'>{group.name}</Typography>
        {group.leader && (
          <div className={classes.leader}>
            <MembersIcon className={classes.icon} />
            <Typography className={classes.name}>
              {group.leader.first_name} {group.leader.last_name}
            </Typography>
          </div>
        )}
      </ButtonBase>
    </Paper>
  );
};

export default GroupItem;

export const GroupItemLoading = ({ background = 'paper' }: Pick<GroupItemProps, 'background'>) => {
  const { classes } = useStyles();
  return (
    <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
      <ButtonBase className={classes.container} focusRipple>
        <Skeleton width={100} />
        <div className={classes.leader}>
          <MembersIcon className={classes.icon} />
          <Skeleton className={classes.name} width={120} />
        </div>
      </ButtonBase>
    </Paper>
  );
};
