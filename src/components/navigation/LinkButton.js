import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

const linkButtonStyles = (theme) => ({
  button: {
    height: '100%',
    width: '100%',
    color: theme.palette.colors.text.light,
  },
  buttonFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.colors.background.light,
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  wrapper: {
    padding: 0,
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
  },
});

const LinkButton = (props) => {
  const { classes, children, noPadding, textLeft, noText, icon: IconComponent, className } = props;

  // React router Link do not support external links
  let baseComponent;
  if (props.to.includes('http') || props.to.includes('mailto:')) {
    baseComponent = 'a';
  } else {
    baseComponent = RouterLink;
  }

  let buttonContent;
  if (noText) {
    buttonContent = children;
  } else {
    buttonContent = (
      <Typography className={classes.text} variant='subtitle1'>
        {children}
      </Typography>
    );
  }

  let target;
  if (props.target) {
    target = props.target;
  }

  return (
    <div className={classNames(classes.wrapper, noPadding ? null : classes.padding, className)}>
      <div className={classNames(classes.buttonFrame, textLeft ? classes.textLeft : classes.textCenter)}>
        <ButtonBase className={classNames('clickable', classes.button)} component={baseComponent} href={props.to} target={target} to={props.to}>
          {props.icon && (
            <div className={classes.iconContainer}>
              <IconComponent className={classes.icon} />
            </div>
          )}
          {buttonContent}
        </ButtonBase>
      </div>
    </div>
  );
};

LinkButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.object,
  to: PropTypes.string.isRequired,
  noPadding: PropTypes.bool,
  textLeft: PropTypes.bool,
  noText: PropTypes.bool,
  classes: PropTypes.object,
  target: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(linkButtonStyles)(LinkButton);
