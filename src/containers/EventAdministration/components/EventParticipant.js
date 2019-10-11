import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const style = {
  content: {
    padding: 36,
  },
};

const EventParticipant = (props) => {
  const {classes, removeUserFromEvent, event} = props;
  return (
    <Card square className={classes.content}>
      {props.user_id}
      <button onClick={() => removeUserFromEvent(props.user_id, event)}>Slett</button>
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
