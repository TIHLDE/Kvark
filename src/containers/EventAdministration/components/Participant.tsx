import { useState, useEffect } from 'react';
import { Registration } from 'types/Types';
import { getUserStudyShort, formatDate, getUserClass } from 'utils';
import { useDeleteEventRegistration, useUpdateEventRegistration } from 'api/hooks/Event';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-ui
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Icons
import Delete from '@material-ui/icons/DeleteRounded';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpwardRounded';

// Project components
import Avatar from 'components/miscellaneous/Avatar';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginRight: theme.spacing(2),
  },
  paper: {
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    background: theme.palette.background.smoke,
  },
  wrapper: {
    paddingRight: theme.spacing(8),
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
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  deleteButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
}));

export type ParticipantProps = {
  eventId: number;
  registration: Registration;
};

const Participant = ({ registration, eventId }: ParticipantProps) => {
  const classes = useStyles();
  const updateRegistration = useUpdateEventRegistration(eventId);
  const deleteRegistration = useDeleteEventRegistration(eventId);
  const showSnackbar = useSnackbar();
  const [checkedState, setCheckedState] = useState(registration.has_attended);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setCheckedState(registration.has_attended);
  }, [registration]);

  const deleteHandler = async () => {
    await deleteRegistration.mutate(registration.user_info.user_id, {
      onSuccess: () => {
        showSnackbar(`Deltageren ble fjernet`, 'success');
      },
    });
    setShowModal(false);
  };

  const handleAttendedCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(event.target.checked);
    updateRegistration.mutate(
      { registration: { has_attended: event.target.checked }, userId: registration.user_info.user_id },
      {
        onSuccess: () => {
          showSnackbar(`Deltageren ble satt til ${!event.target.checked ? 'ikke ' : ''}ankommet`, 'success');
        },
        onError: () => {
          setCheckedState(!event.target.checked);
        },
      },
    );
  };

  const changeList = (onWait: boolean) => {
    updateRegistration.mutate({ registration: { is_on_wait: onWait }, userId: registration.user_info.user_id });
  };

  return (
    <Paper className={classes.paper} noPadding>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText={`Er du sikker på at du vil fjerne ${registration.user_info.first_name} ${registration.user_info.last_name} fra arrangementet?`}
        onClose={() => setShowModal(false)}
        onConfirm={deleteHandler}
        open={showModal}
        titleText='Er du sikker?'
      />
      <ListItem button className={classes.wrapper} onClick={() => setExpanded((prev) => !prev)}>
        <Hidden smDown>
          <Avatar className={classes.avatar} user={registration.user_info} />
        </Hidden>
        <ListItemText
          classes={{ secondary: classes.secondaryText }}
          primary={`${registration.user_info.first_name} ${registration.user_info.last_name}`}
          secondary={`${getUserClass(registration.user_info.user_class)} - ${getUserStudyShort(registration.user_info.user_study)}${
            registration.user_info.allergy !== '' ? `\nAllergier: ${registration.user_info.allergy}` : ''
          }${!registration.allow_photo ? `\nVil ikke bli tatt bilde av` : ''}`}
        />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        <ListItemSecondaryAction>{!registration.is_on_wait && <Checkbox checked={checkedState} onChange={handleAttendedCheck} />}</ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded}>
        <Divider />
        <div className={classes.content}>
          <div>
            <Typography variant='subtitle1'>{`Epost: ${registration.user_info.email}`}</Typography>
            <Typography variant='subtitle1'>{`Påmeldt: ${formatDate(parseISO(registration.created_at))}`}</Typography>
          </div>
          <div className={classes.actions}>
            {registration.is_on_wait ? (
              <Button fullWidth onClick={() => changeList(false)} startIcon={<ArrowUpwardIcon />} variant='outlined'>
                Flytt til påmeldte
              </Button>
            ) : (
              <Button fullWidth onClick={() => changeList(true)} startIcon={<ArrowDownwardIcon />} variant='outlined'>
                Flytt til venteliste
              </Button>
            )}
            <Button className={classes.deleteButton} fullWidth onClick={() => setShowModal(true)} startIcon={<Delete />} variant='outlined'>
              Fjern deltager
            </Button>
          </div>
        </div>
      </Collapse>
    </Paper>
  );
};

export default Participant;
