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
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
  },
  paper: {
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    background: theme.palette.background.smoke,
  },
  wrapper: {
    alignItems: 'center',
  },
  secondaryText: {
    whiteSpace: 'break-spaces',
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export type PersonListItemProps = {
  user: User;
};

const PersonListItem = ({ user }: PersonListItemProps) => {
  const classes = useStyles();
  const updateUser = useUpdateUser();
  const showSnackbar = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const changeStatus = (newStatus: boolean) => {
    updateUser.mutate(
      {
        userId: user.user_id,
        user: { is_TIHLDE_member: newStatus },
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
    <Paper className={classes.paper} noPadding>
      <ListItem button className={classes.wrapper} onClick={() => setExpanded((prev) => !prev)}>
        <Avatar className={classes.avatar} user={user} />
        <ListItemText
          classes={{ secondary: classes.secondaryText }}
          primary={`${user.first_name} ${user.last_name}`}
          secondary={<Hidden smDown>{`${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Hidden>}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <div className={classes.content}>
          <div>
            <Hidden mdUp>
              <Typography variant='subtitle1'>{`${getUserClass(user.user_class)} ${getUserStudyShort(user.user_study)}`}</Typography>
            </Hidden>
            <Typography variant='subtitle1'>{`Brukernavn: ${user.user_id}`}</Typography>
            <Typography variant='subtitle1'>{`Epost: ${user.email}`}</Typography>
          </div>
          <Button color='primary' fullWidth onClick={user.is_TIHLDE_member ? () => setDialogOpen(true) : () => changeStatus(true)} variant='outlined'>
            {user.is_TIHLDE_member ? 'Fjern medlem' : 'Legg til medlem'}
          </Button>
        </div>
      </Collapse>
      <Dialog
        confirmText='Jeg er sikker'
        contentText='Brukeren vil miste mulighet til å logge inn, melde seg på arrangementer og se innhold som er kun for medlemmer.'
        onClose={() => setDialogOpen(true)}
        onConfirm={() => {
          changeStatus(false);
          setDialogOpen(false);
        }}
        open={dialogOpen}
        titleText='Er du sikker?'
      />
    </Paper>
  );
};

export default PersonListItem;

export const PersonListItemLoading = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} noPadding>
      <ListItem className={classes.wrapper}>
        <ListItemText
          classes={{ secondary: classes.secondaryText }}
          primary={<Skeleton width={`${160 + 40 * Math.random()}px`} />}
          secondary={
            <Hidden smDown>
              <Skeleton width={`${130 + 20 * Math.random()}px`} />
            </Hidden>
          }
        />
      </ListItem>
    </Paper>
  );
};
