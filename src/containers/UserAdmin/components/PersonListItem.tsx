import { useState } from 'react';
import { User } from 'types/Types';
import { useUpdateUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';
import { getUserClass, getUserStudyShort } from 'utils';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
  },
  content: {},
}));

export type PersonListItemProps = {
  user: User;
};

const PersonListItem = ({ user }: PersonListItemProps) => {
  const classes = useStyles();
  const updateUser = useUpdateUser();
  const showSnackbar = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const changeStatus = () => {
    updateUser.mutate(
      {
        userId: user.user_id,
        user: { is_TIHLDE_member: !user.is_TIHLDE_member },
      },
      {
        onSuccess: () => {
          showSnackbar('Oppdateringen var vellykket', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.wrapper}>
        <Typography variant='subtitle1'>
          <b>{`${user.first_name} ${user.last_name}`}</b>
          <Hidden smDown>{` - ${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Hidden>
        </Typography>
        <IconButton onClick={() => setExpanded((prev) => !prev)}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
      </div>
      <Collapse in={expanded}>
        <div>
          <Hidden mdUp>
            <Typography variant='subtitle1'>{`${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Typography>
          </Hidden>
        </div>
        <Button color='primary' fullWidth onClick={changeStatus} variant='outlined'>
          {user.is_TIHLDE_member ? 'Fjern medlem' : 'Legg til medlem'}
        </Button>
      </Collapse>
    </Paper>
  );
};

export default PersonListItem;

export const PersonListItemLoading = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.wrapper}>
        <Skeleton height={48} width={`${150 + 20 * Math.random()}px`} />
      </div>
    </Paper>
  );
};
