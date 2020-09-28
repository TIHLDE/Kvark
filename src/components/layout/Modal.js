import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material-ui
import MaterialModal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
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
    color: theme.palette.colors.text.main,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

const Modal = (props) => {
  const { classes, className, open, onClose, children, header, closeText } = props;

  return (
    <MaterialModal onClose={onClose} open={open}>
      <>
        <Paper className={classNames(classes.paper, className)} noPadding>
          <div className={classes.content}>
            {header && (
              <Typography className={classes.header} variant='h4'>
                {header}
              </Typography>
            )}
            {children}
            <Button align='center' className={classes.button} color='primary' onClick={onClose}>
              {closeText}
            </Button>
          </div>
        </Paper>
      </>
    </MaterialModal>
  );
};

Modal.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
  header: PropTypes.string,
  closeText: PropTypes.string,
};

Modal.defaultProps = {
  open: false,
  closeText: 'Lukk',
};

export default withStyles(style)(Modal);
