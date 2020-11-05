import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserStudyShort } from '../../../utils';

// Material-ui
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

// Project components
import Modal from '../../../components/layout/Modal';

const style = (theme) => ({
  content: {
    padding: 20,
    display: 'flex',
    '@media only screen and (max-width: 600px)': {
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
    marginRight: 8,
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
    marginTop: 20,
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
});

const EventParticipant = (props) => {
  const { classes, user, removeUserFromEvent, toggleUserEvent, waitList, showEmail } = props;
  const userInfo = user.user_info;
  const [checkedState, setCheckedState] = useState(user.has_attended);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCheckedState(user.has_attended);
  }, [user]);

  const deleteHandler = () => {
    removeUserFromEvent(user);
    setShowModal(false);
  };

  const handleCheck = (event) => {
    setCheckedState(event.target.checked);
    toggleUserEvent(user.user_info.user_id, { has_attended: event.target.checked });
  };

  return (
    <Card className={classes.content} elevation={2}>
      {showModal && (
        <Modal closeText='Avbryt' header='Er du sikker?' onClose={() => setShowModal(false)} open={showModal}>
          <Typography className={classes.lightText} variant='h6'>
            Er du sikker på at du vil fjerne {userInfo.first_name + ' ' + userInfo.last_name} fra arrangementet?
          </Typography>
          <Button align='center' className={classes.button} color='primary' onClick={deleteHandler} variant='contained'>
            Ja
          </Button>
        </Modal>
      )}
      <div className={classes.userName}>
        <Typography>{userInfo.first_name + ' ' + userInfo.last_name}</Typography>
        <Typography>
          {userInfo.user_class}. klasse - {getUserStudyShort(userInfo.user_study)}
        </Typography>
        <Collapse in={showEmail}>
          <Typography>{userInfo.email}</Typography>
        </Collapse>
        {userInfo.allergy !== '' && <Typography>Allergier: {userInfo.allergy}</Typography>}
        {user.allow_photo && !user.allow_photo && <Typography>Vil ikke bli tatt bilde av</Typography>}
      </div>
      <div className={classes.actionArea}>
        <div className={classes.buttonContainer}>
          <FormControlLabel control={<Checkbox checked={checkedState} onChange={handleCheck} />} label='Ankommet' />
        </div>
        <div className={classes.buttonContainer}>
          {waitList ? (
            <ArrowUpwardIcon className={classes.arrowButton} onClick={() => toggleUserEvent(user.user_info.user_id, { is_on_wait: false })} />
          ) : (
            <ArrowDownwardIcon className={classes.arrowButton} onClick={() => toggleUserEvent(user.user_info.user_id, { is_on_wait: true })} />
          )}
          <Delete className={classes.deleteButton} onClick={() => setShowModal(true)} />
        </div>
      </div>
    </Card>
  );
};

EventParticipant.propTypes = {
  user: PropTypes.object,
  classes: PropTypes.object,
  removeUserFromEvent: PropTypes.func,
  toggleUserEvent: PropTypes.func,
  waitList: PropTypes.bool,
  showEmail: PropTypes.bool,
};

export default withStyles(style)(EventParticipant);
