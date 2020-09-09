import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Icons

// Project components
import LinkButton from '../../../components/navigation/LinkButton';

const styles = (theme) => ({
  root: {
    padding: 16,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text.light,
  },
  icon: {
    fontSize: 100,
    marginBottom: 20,
    color: theme.colors.text.lighter,
  },
});

const Icons = (props) => {
  const { classes, data, icon: Component } = props;
  const text = data.title ? data.title : 'mangler tittel';
  return (
    <LinkButton noPadding noText to={props.to}>
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Component className={classes.icon} />
          <Typography className={classes.title} variant={'h5'}>
            {text}
          </Typography>
        </div>
      </div>
    </LinkButton>
  );
};

Icons.propTypes = {
  classes: PropTypes.object,
  to: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.object]),
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default withStyles(styles)(Icons);
