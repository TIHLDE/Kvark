import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

const styles = (theme) => ({
  root: {
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '15px',
    width: '100%',
    textAlign: 'left',

    '@media only screen and (max-width: 600px)': {
      maxHeight: 'none',
      maxWidth: '100vw',
      overflow: 'hidden',
      height: 'auto',
      gridAutoFlow: 'row',
    },
  },
  activated: {
    gridTemplateRows: '1fr',

    '@media only screen and (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gridGap: '0',
      textAlign: 'center',
    },
  },
  title: {
    color: theme.colors.text.main,
  },
  id: {
    minWidth: '60px',
  },
});

const ListFiles = (props) => {
  const {classes, data, onClick} = props;
  return (
    <div>
      <ListItem className={classes.btn} onClick={onClick}>
        <Grid className={classNames(classes.root, classes.activated)} container direction='row' wrap='nowrap' alignItems='center'>
          <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'><strong>{data.title}</strong></Typography>
          <Typography className={classes.title} variant='subtitle1'>{data.desc}</Typography>
          <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>{data.creator}</Typography>
          <Typography className={classes.title} variant='subtitle1'>{data.course}</Typography>
        </Grid>
      </ListItem>
    </div>
  );
};

ListFiles.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  onClick: PropTypes.object,
};

export default withStyles(styles)(ListFiles);
