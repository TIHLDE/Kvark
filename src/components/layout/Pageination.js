import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = {

};

function Pageination(props) {
  return (
    <React.Fragment>
      <div>{props.children}</div>
      <ButtonBase onClick={props.nextPage}>
        <Typography align="center">Vis flere elementer</Typography>
      </ButtonBase>
    </React.Fragment>
  );
}

Pageination.propTypes = {
  children: PropTypes.element,
  nextPage: PropTypes.function,
};

export default withStyles(styles)(Pageination);
