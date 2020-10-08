import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

// Icons
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

// Project components
import Paper from '../../../../components/layout/Paper';
import { getUserClass, getUserStudyShort } from '../../../../utils';

const styles = (theme) => ({
  root: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    gridAutoFlow: 'column',
    display: 'grid',
    textAlign: 'left',
    gridGap: 10,
    width: '100%',
    gridTemplateColumns: '3fr 2fr 2fr 2fr',
    gridTemplateRows: '1fr',
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '2fr 80px',
      maxHeight: 'none',
      maxWidth: '100vw',
      overflow: 'hidden',
      height: 'auto',
      gridAutoFlow: 'row',
    },
  },
  more: {
    '@media only screen and (max-width: 800px)': {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr auto auto auto',
      gridGap: '0',
      textAlign: 'left',
    },
  },
  title: {
    color: theme.palette.colors.text.main,
    minWidth: 65,
  },
  displayNone: {
    '@media only screen and (max-width: 800px)': {
      display: 'none',
    },
  },
  btn: {
    padding: 0,
  },
  activateButton: {
    color: theme.palette.colors.status.green,
    width: '48px',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      position: 'absolute',
      right: 5,
    },
  },
  paper: {
    marginBottom: 10,
  },
  deactivateButton: {
    color: theme.palette.colors.status.red,
    width: '48px',
    margin: 'auto',
    '@media only screen and (max-width: 800px)': {
      position: 'absolute',
      right: 10,
    },
  },
  moreBtn: {
    display: 'none',
    color: theme.palette.colors.text.main,
    minWidth: 48,
    position: 'absolute',
    right: 10,
    top: 10,
    '@media only screen and (max-width: 800px)': {
      display: 'inline',
    },
  },
  animate: {
    transform: 'rotate(180deg)',
  },
});

const PersonListItem = (props) => {
  const [showMore, setShowMore] = useState(false);
  const { classes, data, isMember, handleMembers } = props;
  return (
    <Paper className={classes.paper} noPadding>
      <ListItem className={classes.btn} onClick={() => setShowMore(!showMore)}>
        <Grid alignItems='center' className={!showMore ? classes.root : classNames(classes.root, classes.more)} container direction='row' wrap='nowrap'>
          <Typography className={classes.title} variant='subtitle1'>
            {data.first_name + ' ' + data.last_name}
          </Typography>
          <Typography className={!showMore ? classNames(classes.title, classes.displayNone) : classes.title} variant='subtitle1'>
            {data.user_id}
          </Typography>
          <Typography className={!showMore ? classNames(classes.title, classes.displayNone) : classes.title} variant='subtitle1'>
            <Hidden mdUp>Studie: </Hidden>
            {getUserStudyShort(data.user_study)}
          </Typography>
          <Typography className={!showMore ? classNames(classes.title, classes.displayNone) : classes.title} variant='subtitle1'>
            <Hidden mdUp>Klasse: </Hidden>
            {getUserClass(data.user_class)}
          </Typography>
        </Grid>
        {isMember ? (
          <IconButton
            className={!showMore ? classNames(classes.deactivateButton, classes.displayNone) : classes.deactivateButton}
            onClick={() => {
              handleMembers(data.user_id, false);
              setShowMore(false);
            }}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton
            className={!showMore ? classNames(classes.activateButton, classes.displayNone) : classes.activateButton}
            onClick={() => {
              handleMembers(data.user_id, true);
              setShowMore(false);
            }}>
            <ThumbUpIcon />
          </IconButton>
        )}
        <IconButton className={!showMore ? classes.moreBtn : classNames(classes.moreBtn, classes.animate)} onClick={() => setShowMore(!showMore)}>
          <ExpandIcon />
        </IconButton>
      </ListItem>
    </Paper>
  );
};

PersonListItem.propTypes = {
  classes: PropTypes.object,
  isMember: PropTypes.bool,
  data: PropTypes.object,
  onClick: PropTypes.func,
  handleMembers: PropTypes.func,
};

export default withStyles(styles)(PersonListItem);
