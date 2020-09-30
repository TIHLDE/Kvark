import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getUserStudyLong, getUserClass } from '../../../utils';

// API and store import
import UserService from '../../../api/services/UserService';
import store from '../../../store/store';
import * as UserActions from '../../../store/actions/UserActions';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const styles = (theme) => ({
  mt: {
    marginTop: '16px',
  },
  inputWidth: {
    maxWidth: '100%',
    textAlign: 'left',
    '& input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button': {
      appearance: 'none',
      margin: 0,
    },
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    '@media only screen and (max-width: 600px)': {
      flexDirection: 'column',
    },
  },
  selectBox: {
    flex: 1,
    textAlign: 'left',
  },
  centerSelect: {
    '@media only screen and (min-width: 600px)': {
      margin: '16px 5px 8px 5px',
    },
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.palette.colors.background.smoke,
    color: theme.palette.colors.text.main,
  },
});

function ProfileSettings(props) {
  const { classes } = props;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadUserData = () => {
    UserService.getUserData().then((user) => {
      if (user) {
        setUserData(user);
      }
    });
  };

  useEffect(() => loadUserData(), []);

  const updateData = (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    UserService.updateUserData(userData.user_id, userData, (isError, data) => {
      if (!isError) {
        setSnackbarMessage('Oppdateringen var vellykket!');
        UserActions.setUserData([data])(store.dispatch);
      } else {
        setSnackbarMessage('Noe gikk galt');
      }
      setSnackbarOpen(true);
      setIsLoading(false);
    });
  };

  return (
    <div>
      {userData && (
        <form onSubmit={updateData}>
          <Grid container direction='column'>
            <TextField
              className={classes.inputWidth}
              InputProps={{ type: 'number' }}
              label='Telefon'
              margin='normal'
              onChange={(e) => setUserData({ ...userData, cell: e.target.value })}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 8);
              }}
              value={userData.cell}
              variant='outlined'
            />
            <div className={classes.selectContainer}>
              <TextField
                className={classNames(classes.inputWidth, classes.selectBox)}
                disabled
                label='Studie'
                margin='normal'
                onChange={(e) => setUserData({ ...userData, user_study: e.target.value })}
                select={true}
                value={userData.user_study}
                variant='outlined'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <MenuItem key={i} value={i}>
                    {getUserStudyLong(i)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className={classNames(classes.inputWidth, classes.selectBox, classes.centerSelect)}
                disabled
                label='Klasse'
                margin='normal'
                onChange={(e) => setUserData({ ...userData, user_class: e.target.value })}
                select={true}
                value={userData.user_class}
                variant='outlined'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <MenuItem key={i} value={i}>
                    {getUserClass(i)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className={classNames(classes.inputWidth, classes.selectBox)}
                label='Kjønn'
                margin='normal'
                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                select={true}
                value={userData.gender}
                variant='outlined'>
                <MenuItem value={1}>Mann</MenuItem>
                <MenuItem value={2}>Kvinne</MenuItem>
                <MenuItem value={3}>Annet</MenuItem>
              </TextField>
            </div>
            <TextField
              className={classes.inputWidth}
              label='Kjøkkenredskap'
              margin='normal'
              onChange={(e) => setUserData({ ...userData, tool: e.target.value })}
              value={userData.tool}
              variant='outlined'
            />
            <TextField
              className={classes.inputWidth}
              label='Evt allergier og annen info'
              margin='normal'
              multiline={true}
              onChange={(e) => setUserData({ ...userData, allergy: e.target.value })}
              onInput={(e) => (e.target.value = e.target.value.slice(0, 250))}
              rows={3}
              value={userData.allergy}
              variant='outlined'
            />
            <Button className={classes.mt} color='primary' disabled={isLoading} type='submit' variant='contained'>
              Oppdater
            </Button>
          </Grid>
        </form>
      )}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} open={snackbarOpen}>
        <SnackbarContent className={classes.snackbar} message={snackbarMessage} />
      </Snackbar>
    </div>
  );
}

ProfileSettings.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ProfileSettings);
