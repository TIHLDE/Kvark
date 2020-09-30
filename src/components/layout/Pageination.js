import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import classNames from 'classnames';

const styles = (theme) => ({
  button: {
    padding: '10px',
    boxShadow: '0px 2px 4px ' + theme.palette.colors.border.main + '88',
    backgroundColor: theme.palette.colors.background.light,
  },
  fullWidth: {
    width: '100%',
  },
});

function Pageination(props) {
  const { classes, fullWidth } = props;
  return (
    <React.Fragment>
      <div>{props.children}</div>
      {props.page && (
        <ButtonBase className={fullWidth ? classNames(classes.button, classes.fullWidth) : classes.button} onClick={props.nextPage}>
          <Typography align='center'>Vis flere elementer</Typography>
        </ButtonBase>
      )}
    </React.Fragment>
  );
}

Pageination.propTypes = {
  classes: PropTypes.object,
  fullWidth: PropTypes.bool,
  children: PropTypes.node.isRequired,
  nextPage: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default withStyles(styles)(Pageination);
