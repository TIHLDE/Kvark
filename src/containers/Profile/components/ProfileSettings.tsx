import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { getUserStudyLong, getUserClass } from 'utils';
import { User } from 'types/Types';
import { useUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  mt: {
    marginTop: theme.spacing(2),
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
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  selectBox: {
    flex: 1,
    textAlign: 'left',
  },
  centerSelect: {
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 1, 1),
    },
  },
}));

export interface IFormInput {
  cell: number;
  study: string;
  class: string;
  gender: string;
  tool: string;
  allergy: string;
}

const ProfileSettings = () => {
  const classes = useStyles();
  const { getUserData, updateUserData } = useUser();
  const showSnackbar = useSnackbar();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserData().then((user) => {
      if (user) {
        setUserData(user);
      }
    });
  }, [getUserData]);

  const updateData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    if (userData) {
      setIsLoading(true);
      updateUserData(userData.user_id, userData, true)
        .then(() => showSnackbar('Bruker oppdatert', 'success'))
        .catch((error) => showSnackbar(error.detail, 'error'))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      {userData && (
        <form onSubmit={updateData}>
          <Grid container direction='column'>
            <TextField
              className={classes.inputWidth}
              InputProps={{ type: 'number' }}
              label='Telefon'
              margin='normal'
              onChange={(e) => setUserData({ ...userData, cell: Number(e.target.value) })}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, Number(e.target.value)).toString().slice(0, 8);
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
                onChange={(e) => setUserData({ ...userData, user_study: Number(e.target.value) })}
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
                onChange={(e) => setUserData({ ...userData, user_class: Number(e.target.value) })}
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
                onChange={(e) => setUserData({ ...userData, gender: Number(e.target.value) })}
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
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => (e.target.value = e.target.value.slice(0, 250))}
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
    </>
  );
};

export default ProfileSettings;
