import { Group } from 'types/Types';

import MembersIcon from '@material-ui/icons/PersonRounded';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    border: '1px solid #aaa',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-evenly',
    padding: theme.spacing(2),
    '&:hover > h3': {
      transform: 'scale(1.1)',
    },
  },
  group: {
    transition: 'transform .2s',
    marginLeft: theme.spacing(1),
    fontSize: '1.6rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  },
  leader: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      '& > *': {
        fontSize: '0.8rem',
      },
    },
  },
  name: {
    marginLeft: '.3rem',
  },
}));

export type GroupItemProps = {
  group: Group;
};

const GroupItem = ({ group }: GroupItemProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.group} variant='h3'>
        {group.name}
      </Typography>
      <div className={classes.leader}>
        <MembersIcon />
        <Typography className={classes.name}>
          {group.leader.first_name} {group.leader.last_name}
        </Typography>
      </div>
    </div>
  );
};

export default GroupItem;
