import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {getUserStudyShort} from '../../../utils';

// Material-ui
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const style = (theme) => ({
  content: {
    padding: 20,
    display: 'flex',
    '@media only screen and (max-width: 600px)': {
      flexDirection: 'column',
    },
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88',
    borderRadius: theme.sizes.border.radius,
    marginBottom: 3,
    background: theme.colors.background.smoke,
  },
  userName: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
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
});

const EventParticipant = (props) => {
  const {
    classes,
    removeUserFromEvent,
    toggleUserEvent,
    event,
    waitList,
    attended,
  } = props;

  const [checkedState, setCheckedState] = useState(attended);
  useEffect(() => {
    setCheckedState(props.attended);
  }, [props.attended]);

  const userInfo = props.user.user_info;

  const deleteHandler = () => {
    removeUserFromEvent(props.user.user_info.user_id, event);
  };

  const handleCheck = (actionEvent) => {
    setCheckedState(actionEvent.target.checked);
    toggleUserEvent(props.user.user_info.user_id, event, {has_attended: actionEvent.target.checked});
  };

  return (
    <Card className={classes.content}>
      <div className={classes.userName}>
        <Typography>{userInfo.first_name + ' ' + userInfo.last_name}</Typography>
        <Typography>Studie: {getUserStudyShort(userInfo.user_study)}</Typography>
        <Typography>Årstrinn: {userInfo.user_class} Klasse</Typography>
        {userInfo.allergy !== '' && <Typography>Allergier: {userInfo.allergy}</Typography>}

      </div>
      <div className={classes.actionArea}>
        <div className={classes.buttonContainer}>
          <FormControlLabel
            label="Ankommet"
            control={
              <Checkbox
                onChange={
                  handleCheck
                }
                checked={checkedState} />}
          />
        </div>
        <div className={classes.buttonContainer}>
          {!waitList ?
            <ArrowDownwardIcon
              className={classes.arrowButton}
              onClick={() => {
                toggleUserEvent(props.user.user_info.user_id, event, {is_on_wait: true});
              }} /> :
            <ArrowUpwardIcon
              className={classes.arrowButton}
              onClick={() => {
                toggleUserEvent(props.user.user_info.user_id, event, {is_on_wait: false});
              }}/>
          }
          <Delete className={classes.deleteButton} onClick={deleteHandler} />
        </div>
      </div>
    </Card>
  );
};

EventParticipant.propTypes = {
  user: PropTypes.object,
  classes: PropTypes.object,
  attended: PropTypes.bool,
  removeUserFromEvent: PropTypes.func,
  toggleUserEvent: PropTypes.func,
  event: PropTypes.object,
  waitList: PropTypes.bool,
};

export default withStyles(style)(EventParticipant);
