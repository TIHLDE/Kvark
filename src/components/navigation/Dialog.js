import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';

// Project components
import Paper from '../layout/Paper';

const style = (theme) => ({
  paper: {
    position: 'absolute',
    maxWidth: 460,
    minWidth: 320,
    maxHeight: '75%',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    '@media only screen and (max-width: 400px)': {
      width: '100%',
    },
  },
  heading: {
    display: 'flex',
    padding: 26,
  },
  title: {
    width: '100%',
  },
  content: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  nestedElement: {
    paddingLeft: 32,
  },
  closeButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    width: '100%',
    margin: 4,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  footer: {
    padding: 26,
    textAlign: 'center',
    display: 'flex',
  },
  text: {
    paddingBottom: 25,
    alignObject: 'flex-start',
  },
  progress: {
    margin: 26,
    position: 'relative',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginRight: -20,
  },
});

// Custom themed button
const DangerButton = withStyles((theme) => (
  {
    root: {
      color: theme.palette.error.main,
    },
  }),
)(Button);

const Dialog = (props) => {
  const {classes, message, title, onClose, status, onSubmit, submitText} = props;
  return (
    <Modal
      open={status}
      onClose={onClose}>
      <Paper className={classes.paper} noPadding >
        <div className={classes.heading}>
          <Typography className={classes.title} align='center' variant='h5'>
            {title}
          </Typography>
        </div>
        <Divider />
        <div className={classes.content}>
          <Typography>{message}</Typography>
        </div>
        <Divider />
        <div className={classes.footer}>
          <DangerButton
            className={classes.button}
            onClick={onSubmit}
            align='center'
            variant='outlined'
            color='secondary'>{submitText}</DangerButton>
          <Button
            className={classes.button}
            onClick={onClose}
            align='center'
            variant='outlined'
            color='primary'>Avbryt</Button>
        </div>
      </Paper>
    </Modal>
  );
};

Dialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  submitText: PropTypes.string,
  status: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(style)(Dialog);
