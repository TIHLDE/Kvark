import React from 'react';
import PropTypes from 'prop-types';

// Material-ui
import Modal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Components
import QRCode from 'qrcode.react';

const style = {
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
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
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
  button: {
    width: '100%',
    marginTop: 20,
  },
};

const MemberProof = (props) => {
  const { classes, userId } = props;

  return (
    <Modal
      open={props.status}
      onClose={props.onClose}>
      <div className={classes.paper}>
        <div className={classes.content}>
          <QRCode value={userId} size={280} />
          <Button
            className={classes.button}
            color='primary'
            onClick={props.onClose}
            align='center'>Lukk</Button>
        </div>
      </div>
    </Modal>
  );
};

MemberProof.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  status: PropTypes.bool,
  userId: PropTypes.string,
};

export default withStyles(style)(MemberProof);
