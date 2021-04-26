import { useNavigate } from 'react-router-dom';
import { Group } from 'types/Types';

import MembersIcon from '@material-ui/icons/PersonRounded';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    border: `${theme.palette.borderWidth} solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
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
    marginLeft: theme.spacing(1),
    fontSize: '0.8rem',
  },
}));

export type GroupItemProps = {
  group: Group;
};

const GroupItem = ({ group }: GroupItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <ButtonBase className={classes.container} onClick={() => navigate(`/grupper/${group.slug}`)}>
      <Typography className={classes.group} variant='h3'>
        {group.name}
      </Typography>
      {group.leader && (
        <div className={classes.leader}>
          <MembersIcon />
          <Typography className={classes.name}>
            {group.leader.first_name} {group.leader.last_name}
          </Typography>
        </div>
      )}
    </ButtonBase>
  );
};

export default GroupItem;
