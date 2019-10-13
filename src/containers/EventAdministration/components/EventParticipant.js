import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const style = (theme) => ({
  content: {
    padding: 36,
    display: 'flex',
  },
  userName: {
    flexGrow: 1,
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
});

const EventParticipant = (props) => {
  const {classes, removeUserFromEvent, toggleWaitList, event, waitList} = props;

  const deleteHandler = () => {
    removeUserFromEvent(props.user_id, event);
  };

  return (
    <Card square className={classes.content}>
      <div className={classes.userName}>
        {props.user_id}
      </div>
      <div>
        {!waitList ?
          <ArrowDownwardIcon
            className={classes.arrowButton}
            onClick={() => {toggleWaitList(props.user_id, event, true);}} />
          :
          <ArrowUpwardIcon
          className={classes.arrowButton}
          onClick={() => {toggleWaitList(props.user_id, event, false);}}/>
        }
        <Delete className={classes.deleteButton} onClick={deleteHandler} />
      </div>
    </Card>
  );
};

EventParticipant.propTypes = {
  user_id: PropTypes.string,
  classes: PropTypes.object,
  removeUserFromEvent: PropTypes.func,
  toggleWaitList: PropTypes.func,
  event: PropTypes.object,
  waitList: PropTypes.bool,
};

export default withStyles(style)(EventParticipant);
