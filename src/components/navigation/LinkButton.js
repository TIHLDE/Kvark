import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography';

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
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
  padding: {
    paddingLeft: 1,
    paddingRight: 1,
  },
  iconContainer: {
    marginLeft: 5,
  },
  icon: {
    fontSize: 25,
  },
  text: {
    width: '100%',
    padding: 10,
  }
}

const LinkButton = (props) => {
  const {classes, children, noPadding, icon: IconComponent} = props

  // React router Link do not support external links
  let baseComponent;
  if (props.to.includes('http')){
    baseComponent = 'a';
  }else {
    baseComponent = RouterLink
  }

  return (
    <div className={classNames(classes.wrapper, noPadding ? null: classes.padding)}>
      <div className={classes.buttonFrame}>
        <ButtonBase
          className={classes.button}
          component={baseComponent}
          to={props.to}
          href={props.to}>
            {props.icon && <div className={classes.iconContainer}>
              <IconComponent className={classes.icon} />
            </div>}
            <Typography variant="subtitle1" className={classes.text}>
              {children}
            </Typography>
        </ButtonBase>
      </div>
    </div>
  );
};

LinkButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.func,
  to: PropTypes.string
};

export default withStyles(linkButtonStyles)(LinkButton);
