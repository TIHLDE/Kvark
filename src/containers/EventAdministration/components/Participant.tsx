import React, { useState, useEffect } from 'react';
import { Registration } from 'types/Types';
import { getUserStudyShort } from 'utils';

// Material-ui
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

// Project components
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    marginBottom: 3,
    background: theme.palette.colors.background.smoke,
  },
  userName: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  deleteButton: {
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.error.main,
    },
  },
  arrowButton: {
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  actionArea: {
    display: 'flex',
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
}));

export type ParticipantProps = {
  registration: Registration;
  removeUserFromEvent: (registration: Registration) => void;
  updateRegistration: (userId: string, parameters: Partial<Registration>) => void;
  showEmail: boolean;
};

const Participant = ({ registration, removeUserFromEvent, updateRegistration, showEmail }: ParticipantProps) => {
  const classes = useStyles();
  const userInfo = registration.user_info;
  const [checkedState, setCheckedState] = useState(registration.has_attended);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCheckedState(registration.has_attended);
  }, [registration]);

  const deleteHandler = () => {
    removeUserFromEvent(registration);
    setShowModal(false);
  };

  const handleAttendedCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(event.target.checked);
    updateRegistration(registration.user_info.user_id, { has_attended: event.target.checked });
  };

  return (
    <Paper className={classes.content}>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText={`Er du sikker på at du vil fjerne ${userInfo.first_name} ${userInfo.last_name} fra arrangementet?`}
        onClose={() => setShowModal(false)}
        onConfirm={deleteHandler}
        open={showModal}
        titleText='Er du sikker?'
      />
      <div className={classes.userName}>
        <Typography>{`${userInfo.first_name} ${userInfo.last_name}`}</Typography>
        <Typography>
          {userInfo.user_class}. klasse - {getUserStudyShort(userInfo.user_study)}
        </Typography>
        <Collapse in={showEmail}>
          <Typography>{registration.user_info.email}</Typography>
        </Collapse>
        {userInfo.allergy !== '' && <Typography>Allergier: {userInfo.allergy}</Typography>}
        {registration.allow_photo && !registration.allow_photo && <Typography>Vil ikke bli tatt bilde av</Typography>}
      </div>
      <div className={classes.actionArea}>
        {!registration.is_on_wait && (
          <div className={classes.buttonContainer}>
            <FormControlLabel control={<Checkbox checked={checkedState} onChange={handleAttendedCheck} />} label='Ankommet' />
          </div>
        )}
        <div className={classes.buttonContainer}>
          {registration.is_on_wait ? (
            <ArrowUpwardIcon className={classes.arrowButton} onClick={() => updateRegistration(registration.user_info.user_id, { is_on_wait: false })} />
          ) : (
            <ArrowDownwardIcon className={classes.arrowButton} onClick={() => updateRegistration(registration.user_info.user_id, { is_on_wait: true })} />
          )}
          <Delete className={classes.deleteButton} onClick={() => setShowModal(true)} />
        </div>
      </div>
    </Paper>
  );
};

export default Participant;
