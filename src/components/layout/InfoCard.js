import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

const styles = (theme) => ({
  root: {
    padding: 40,
    '@media only screen and (max-width: 950px)': {
      margin: '0 5px',
    },
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    '@media only screen and (max-width: 1100px)': {
      flexDirection: 'column',
    },
  },
  image: {
    maxWidth: 160,
    maxHeight: 160,
  },
  margin: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 30,

    '@media only screen and (max-width: 1100px)': {
      margin: '0 30px 30px 30px',
      minHeight: 160,
    },
  },
  padding: {
    padding: '10px 0px',
  },
  cover: {
    flex: '1',
  },
  header: {
    marginBottom: 10,
    color: theme.colors.text.main,
  },
  subheader: {
    color: theme.colors.text.main,
  },
  text: {
    color: theme.colors.text.light,
  },
  grow: {
    flexGrow: 1,
  },
  children: {},
});

const InfoCard = (props) => {
  const {classes} = props;

  return (
    <div className={classNames(classes.root, props.className)}>
      <div className={classes.wrapper}>
        {props.src &&
          <div className={classes.margin}>
            <img className={classNames(classes.image, props.imageClass)} src={props.src} alt={props.alt}/>
          </div>
        }
        <Grid className={(props.justifyText) ? classes.cover : ''} container direction='column' nowrap='nowrap' justify='flex-start'>
          <Typography className={classes.header} variant='h5' align='left'><strong>{props.header}</strong></Typography>
          {props.text && <Typography className={classes.text} component='p'>{parser(props.text)}</Typography>}

          {props.subText &&
            <Fragment>
              <Typography className={classNames(classes.padding, classes.subheader)} variant='subtitle1'><strong>{props.subheader}</strong></Typography>
              <Typography className={classes.text} component='p'>{parser(props.subText)}</Typography>
            </Fragment>
          }
          {props.children && (
            <div className={classNames(classes.grow, classes.padding, props.classes.children)}>
              {props.children}
            </div>
          )}
        </Grid>
      </div>
    </div>
  );
};

InfoCard.propTypes = {
  classes: PropTypes.object,
  header: PropTypes.string,
  text: PropTypes.string,
  src: PropTypes.any,
  alt: PropTypes.string,
  justifyText: PropTypes.bool,
  subheader: PropTypes.string,
  subText: PropTypes.string,
  className: PropTypes.string,
  elevation: PropTypes.number,
  imageClass: PropTypes.string,

  children: PropTypes.node,
};

InfoCard.defaultProps = {
  elevation: 1,
};

export default withStyles(styles)(InfoCard);
