import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = {
  button: {
    padding: '10px',
    boxShadow: '0px 2px 4px #ddd',
    borderRadius: 5,
    backgroundColor: 'white',
  },
};

function Pageination(props) {
  const {classes} = props;
  return (
    <React.Fragment>
      <div>{props.children}</div>
      {props.page && <ButtonBase className={classes.button} onClick={props.nextPage}>
        <Typography align="center">Vis flere elementer</Typography>
      </ButtonBase>}
    </React.Fragment>
  );
}

Pageination.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node.isRequired,
  nextPage: PropTypes.func,
  page: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default withStyles(styles)(Pageination);
