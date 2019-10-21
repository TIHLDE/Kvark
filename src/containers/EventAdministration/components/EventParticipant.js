import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Material-ui
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const style = (theme) => ({
  content: {
    padding: 36,
    display: 'flex',
    '@media only screen and (max-width: 600px)': {
        flexDirection: 'column',
    },
  },
  userName: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
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
      color: theme.palette.error.main,
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

  const deleteHandler = (event) => {
    removeUserFromEvent(props.user_id, event);
  };

  const handleCheck = (actionEvent) => {
    setCheckedState(actionEvent.target.checked);
    toggleUserEvent(props.user_id, event, {has_attended: actionEvent.target.checked});
  };

  // toggleUserEvent(props.user_id, event, {has_attended: !attended})

  return (
    <Card square className={classes.content}>
      <div className={classes.userName}>
        {props.user_id}
      </div>
      <div className={classes.actionArea}>
        <div>
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
              onClick={() => {toggleUserEvent(props.user_id, event, {is_on_wait: true});}} />
            :
            <ArrowUpwardIcon
            className={classes.arrowButton}
            onClick={() => {toggleUserEvent(props.user_id, event, {is_on_wait: false});}}/>
          }
          <Delete className={classes.deleteButton} onClick={deleteHandler} />
        </div>
      </div>
    </Card>
  );
};

EventParticipant.propTypes = {
  user_id: PropTypes.string,
  classes: PropTypes.object,
  attended: PropTypes.bool,
  removeUserFromEvent: PropTypes.func,
  toggleUserEvent: PropTypes.func,
  event: PropTypes.object,
  waitList: PropTypes.bool,
};

export default withStyles(style)(EventParticipant);
