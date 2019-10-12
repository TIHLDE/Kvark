import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// Icons
import Delete from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
  const {classes, removeUserFromEvent, event} = props;

  const deleteHandler = () => {
    removeUserFromEvent(props.user_id, event);
  };

  return (
    <Card square className={classes.content}>
      <div className={classes.userName}>
        {props.user_id}
      </div>
      <div>
        <ArrowDownwardIcon className={classes.arrowButton} />
        <Delete className={classes.deleteButton} onClick={deleteHandler} />
      </div>
    </Card>
  );
};

EventParticipant.propTypes = {
  user_id: PropTypes.string,
  classes: PropTypes.object,
  removeUserFromEvent: PropTypes.func,
  event: PropTypes.object,
};

export default withStyles(style)(EventParticipant);
