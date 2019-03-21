import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
import {withStyles} from '@material-ui/core/styles'

const linkButtonStyles = {
  button: {
    height: '100%',
    width: '100%'
  },
  buttonFrame: {
    width: '100%',
    height: '100%',
    //borderRight: '1px solid rgba(0,0,0,0.12)',
    //borderLeft: '1px solid rgba(0,0,0,0.12)',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  wrapper: {
    padding: 0,
    paddingLeft: 1,
    paddingRight: 1,
    backgroundColor: 'rgba(0,0,0,0.12)'
  }
}

const LinkButton = (props) => {
  const {classes, children} = props
  return (
    <div className={classes.wrapper}>
      <div className={classes.buttonFrame}>
        <ButtonBase className={classes.button} component={RouterLink} to={props.to}>{children}</ButtonBase>
      </div>
    </div>
  );
};

LinkButton.propTypes = {
  children: PropTypes.node,
  to: ()=> {}
};

export default withStyles(linkButtonStyles)(LinkButton);
