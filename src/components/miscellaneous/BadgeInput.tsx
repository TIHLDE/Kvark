import { Button, Grid, TextField } from '@material-ui/core';
import React from 'react';
import { useBadge } from 'api/hooks/Badge';

function BadgeInput() {
  const [flag, setFlag] = React.useState<string>('');
  const { createUserBadge } = useBadge();

  const submit = () => {
    const formatedId = flag.replaceAll('flag{', '').replaceAll('}', '');
    createUserBadge(formatedId)
      // TODO: Add snackbar
      .then(() => null)
      .catch(() => null);
  };

  return (
    <Grid alignItems='center' container direction='column' justify='center'>
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
