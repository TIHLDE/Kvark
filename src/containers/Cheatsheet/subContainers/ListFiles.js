import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

// Project components
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '15px',
    width: '100%',
    textAlign: 'left',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '2fr 1fr 1fr',

    '@media only screen and (max-width: 800px)': {
      maxHeight: 'none',
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '100vw',
      overflow: 'hidden',
      height: 'auto',
      gridAutoFlow: 'row',
      gridGap: '0',
      textAlign: 'center',
    },
  },
  title: {
    color: theme.colors.text.main,
  },
  btn: {
    width: '100%',
    '&:hover': {
      backgroundColor: theme.colors.background.main,
    },
  },
  hide: {
    '@media only screen and (max-width: 800px)': {
      display: 'none',
    },
  },
});

const ListFiles = (props) => {
  const {classes, data, onClick} = props;
  return (
    <Paper className={classes.btn} noPadding>
      <ListItem onClick={onClick}>
        <Grid className={classes.root} container direction='row' wrap='nowrap' alignItems='center'>
          <Typography className={classes.title} variant='subtitle1'><strong>{data.title}</strong></Typography>
          <Typography className={classNames(classes.title, classes.hide)} variant='subtitle1'>{data.creator}</Typography>
          <Typography className={classes.title} variant='subtitle1'>{data.course}</Typography>
        </Grid>
      </ListItem>
    </Paper>
  );
};

ListFiles.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  onClick: PropTypes.object,
};

export default withStyles(styles)(ListFiles);
