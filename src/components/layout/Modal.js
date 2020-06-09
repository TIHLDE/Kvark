import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import MaterialModal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from './Paper';

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
    'overflow-y': 'auto',
    transform: 'translate(-50%,-50%)',
    outline: 'none',
    '@media only screen and (max-width: 400px)': {
      width: '100%',
    },
  },
  content: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    'overflow-y': 'auto',
  },
  header: {
    color: theme.colors.text.main,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

const Modal = (props) => {
  const {classes, open, onClose, children, header, closeText} = props;

  return (
    <MaterialModal
      open={open}
      onClose={onClose}>
      <Paper className={classes.paper} noPadding>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h4'>{header}</Typography>
          {children}
          <Button
            className={classes.button}
            color='primary'
            onClick={onClose}
            align='center'>{closeText}</Button>
        </div>
      </Paper>
    </MaterialModal>
  );
};

Modal.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  header: PropTypes.string.isRequired,
  closeText: PropTypes.string,
};

Modal.defaultProps = {
  open: false,
  closeText: 'lukk',
};

export default withStyles(style)(Modal);
