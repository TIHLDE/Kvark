import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Icons

// Project components
import LinkButton from '../../../components/navigation/LinkButton';

const styles = {
  btnBase: {
    // backgroundColor: 'white',
  },
  root: {
    // backgroundColor: 'white',
    padding: 16,
    '@media only screen and (max-width: 600px)': {

    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  icon: {
    fontSize: 100,
    marginBottom: 20,
    color: 'rgba(0, 0, 0, 0.6)',
  },
};

const Icons = (props) => {
  const {classes, data, icon: Component} = props;
  const text = (data.title)? data.title : 'mangler tittel';
  return (
    <LinkButton to={props.to} noPadding noText>
      <div className={classes.root}>

        <div className={classes.wrapper}>
          <Component className={classes.icon} />
          <Typography variant={'h5'}>{text}</Typography>
        </div>
      </div>
    </LinkButton>
  );
};

Icons.propTypes = {
  classes: PropTypes.object,
  to: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default withStyles(styles)(Icons);
