import { Link } from 'react-router-dom';
import { GroupList } from 'types/Types';
import URLS from 'URLS';

// Material UI
import { makeStyles } from '@material-ui/styles';
import { Skeleton, ButtonBase, Typography } from '@material-ui/core';

// Icons
import MembersIcon from '@material-ui/icons/PersonRounded';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
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
  group: GroupList;
};

const GroupItem = ({ group }: GroupItemProps) => {
  const classes = useStyles();

  return (
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
  );
};

export default GroupItem;

export const GroupItemLoading = () => {
  const classes = useStyles();
  return (
    <ButtonBase className={classes.container} focusRipple>
      <Skeleton width={100} />
      <div className={classes.leader}>
        <MembersIcon className={classes.icon} />
        <Skeleton className={classes.name} width={120} />
      </div>
    </ButtonBase>
  );
};
