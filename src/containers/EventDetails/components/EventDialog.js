import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Text
import Text from '../../../text/EventText';

// Material-ui
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';

// Iconst
import AccountCircle from '@material-ui/icons/AccountCircle';
import Email from '@material-ui/icons/Email';
import Fastfood from '@material-ui/icons/Fastfood';
import Close from '@material-ui/icons/Close';

const style = {
  heading: {
    display: 'flex',
  },
  title: {
    width: '100%',
    paddingLeft: 40,
  },
  content: {
    padding: 8,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  nestedElement: {
    paddingLeft: 32,
  },
  imgContainer: {
    paddingRight: 8,
    display: 'flex',
  },
  closeButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
};

const EventDialog = (props) => {
  const {classes} = props;

  // TODO: Load in data for the actual user
  const [userData, setUserData] = useState(
    {
      first_name: 'Bob',
      last_name: 'Kåre',
      email: 'bob.kare@tihlde.localdomain',
      allergy: 'Masse alergier. Blant annet gluten, laktose, hund, katt, python',
    }
  );
  const [confirmed, setConfirmed] = useState(false);

  const confirmHandle = () => {
    setConfirmed(!confirmed);
  };

  return (
    <Dialog
      open={props.status}
      onClose={props.onClose}>
      <div className={classes.heading}>
        <Typography className={classes.title} align='center' variant='h5'>
          {Text.signUp}
        </Typography>
        <ButtonBase className={classes.closeButton} onClick={props.onClose}>
          <Close />
        </ButtonBase>
      </div>
      <Divider />
      <div className={classes.content}>
        <Typography>{Text.confirmData}</Typography>
        <List>
          <ListItem>
            <div className={classes.imgContainer}>
              <AccountCircle />
            </div>
            <Typography>
            Navn: {userData.first_name + ' ' + userData.last_name}
            </Typography>
          </ListItem>
          <ListItem>
            <div className={classes.imgContainer}>
              <Email />
            </div>
            <Typography>
            E-post: {userData.email}
            </Typography>
          </ListItem>
          <ListItem>
            <div className={classes.imgContainer}>
              <Fastfood />
            </div>
            <Typography>
            Alergier: {userData.allergy}
            </Typography>
          </ListItem>
        </List>
      </div>
      <Divider />
      <div className={classes.content}>
        <FormControlLabel
          control={
            <Checkbox
              color='primary'
              checked={confirmed}
              onChange={confirmHandle} />
          }
          label={Text.confirmation}
        />
        <Button disabled={!confirmed} align='center' variant='contained' color='primary'>{Text.signUp}</Button>
      </div>
    </Dialog>
  );
};

EventDialog.propTypes = {
  status: PropTypes.bool,
  onClose: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(style)(EventDialog);
