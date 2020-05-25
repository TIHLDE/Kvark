import React from 'react';

import PropTypes from 'prop-types';

// Material-UI
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

const style = (theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    '& div': {
      width: '100%',
      padding: 5,
    },
  },
  icon: {
    display: 'flex',
    width: '30px !important',
    paddingRight: '50px !important',
  },
  unread: {
    backgroundColor: theme.colors.tihlde.light,
  },
  text: {
    color: theme.colors.text.main,
  },
});

const Message = (props) => {
  const {classes, message, updateNotificationReadState} = props;

  let elementClass = classes.message;
  if (!message.read) {
    elementClass = classNames(classes.message, classes.unread);
    updateNotificationReadState(message.id, !message.read);
  }

  return (
    <>
      <div className={elementClass}>
        <div className={classes.icon}>
          <InfoIcon />
        </div>
        <Typography className={classes.text} color={'inherit'} align={'left'}>{message.message}</Typography>
      </div>
    </>
  );
};

const ProfileNotifications = (props) => {
  const {classes, messages, isLoading, updateNotificationReadState} = props;

  let messageList = <Typography className={classes.text} align='center' variant='subtitle1'>Ingen notifikasjoner.</Typography>;
  if (messages.length > 0) {
    messageList = messages.map((message, index) => {
      return <Message
        key={index}
        message={message}
        classes={classes}
        updateNotificationReadState={updateNotificationReadState} />;
    });
  }

  return (
    <React.Fragment>
      {!isLoading ? messageList :
        <Typography className={classes.text} align='center' variant='subtitle1'>Laster notifikasjoner.</Typography>
      }
    </React.Fragment>
  );
};

Message.propTypes = {
  classes: PropTypes.object,
  message: PropTypes.object,
  updateNotificationReadState: PropTypes.func,
};

ProfileNotifications.propTypes = {
  classes: PropTypes.object,
  messages: PropTypes.array,
  isLoading: PropTypes.bool,
  updateNotificationReadState: PropTypes.func,
};

export default withStyles(style)(ProfileNotifications);
