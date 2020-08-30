import React from 'react';
import MaterialPaper from '@material-ui/core/Paper';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  main: {
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
    overflow: 'hidden',
  },
  padding: {
    padding: 28,
  },
  noBorder: {
    border: 'none',
  },
});

const Paper = (props) => {
  const {classes, shadow, noPadding, children, className} = props;
  return (
    <MaterialPaper elevation={shadow ? 2 : 0} className={classnames(classes.main, !noPadding && classes.padding, shadow && classes.noBorder, className)}>
      {children}
    </MaterialPaper>
  );
};
Paper.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  shadow: PropTypes.bool,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
};

export default withStyles(styles)(Paper);

