import { Link } from 'react-router-dom';
import { GroupList } from 'types/Types';
import URLS from 'URLS';

// Material UI
import { ButtonBase, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import MembersIcon from '@material-ui/icons/PersonRounded';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    border: `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 90,
    '&:hover > h3': {
      transform: 'scale(1.1)',
    },
  },
  group: {
    transition: 'transform .2s',
  },
  leader: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    [theme.breakpoints.down('sm')]: {
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
    <ButtonBase className={classes.container} component={Link} to={`${URLS.groups}${group.slug}/`}>
      <Typography className={classes.group} variant='h3'>
        {group.name}
      </Typography>
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
