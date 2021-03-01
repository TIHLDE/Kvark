import { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { useBadge } from 'api/hooks/Badge';
import { useSnackbar } from 'api/hooks/Snackbar';

function BadgeInput() {
  const [flag, setFlag] = useState<string>('');
  const { createUserBadge } = useBadge();
  const showSnackbar = useSnackbar();
  const submit = () => {
    const formatedId = flag.replace(/flag{/gi, '').replace(/}/gi, '');
    createUserBadge(formatedId)
      .then((response) => showSnackbar(response.detail, 'success'))
      .catch((err) => showSnackbar(err.detail, 'error'))
      .finally(() => setFlag(''));
  };

  return (
    <Grid alignItems='center' container direction='column' justify='center'>
      <Grid item>
        <Typography variant='h2'>Velkommen til årets første CTF.</Typography>
      </Grid>
      <Grid item>
        <Typography>I år har CTF teamet hos Index gjort klart 10 flagg.</Typography>
      </Grid>
      <Grid item>
        <Typography>Under CTFen er det viktig å ha et klart hode og bruke ALLE sansene.</Typography>
      </Grid>
      <Grid item>
        <Typography>Chug ned på PKen og gjør deg klar for TIHLDEs Retro-CTF</Typography>
      </Grid>
      <Grid item>
        <Typography>Hilsen Zaim, Hermann og Mads fra Index</Typography>
      </Grid>
      <Grid item>
        <TextField
          helperText='flag{xxx-xxx-xxx-xxx-xxx}'
          id='ctf-flag-input'
          label='Send inn flagg'
          onChange={(event) => setFlag(event.target.value)}
          value={flag}
          variant='outlined'
        />
      </Grid>
      <Grid item>
        <Button color='primary' onClick={submit} variant='contained'>
          Send inn
        </Button>
      </Grid>
    </Grid>
  );
}

export default BadgeInput;
