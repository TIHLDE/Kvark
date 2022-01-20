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
import { Mail } from '@mui/icons-material';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 90,
  },
  listcontainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  leader: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'left',
  },
  mail: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  icon: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
    },
  },
  text: {
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
      <ButtonBase className={classes.container} component={Link} focusRipple to={URLS.groups.details(group.slug)}>
        <Typography variant='h3'>{group.name}</Typography>
        <div className={classes.listcontainer}>
          {group.leader && (
            <div className={classes.leader}>
              <MembersIcon className={classes.icon} />
              <Typography className={classes.text}>
                {group.leader.first_name} {group.leader.last_name}
              </Typography>
            </div>
          )}
          {group.contact_email && (
            <div className={classes.mail}>
              <Mail className={classes.icon} />
              <Typography className={classes.text}>{group.contact_email}</Typography>
            </div>
          )}
        </div>
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
        <div className={classes.listcontainer}>
          <div className={classes.leader}>
            <MembersIcon className={classes.icon} />
            <Skeleton className={classes.text} width={120} />
          </div>
          <div className={classes.mail}>
            <Mail className={classes.icon} />
            <Skeleton className={classes.text} width={120} />
          </div>
        </div>
      </ButtonBase>
    </Paper>
  );
};
