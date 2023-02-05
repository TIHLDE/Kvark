import { Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCreateBadge } from 'hooks/Badge';
import { useSnackbar } from 'hooks/Snackbar';

const BadgesGet = () => {
  const { badgeId } = useParams();
  const [flag, setFlag] = useState<string>(badgeId ? badgeId : '');
  const createUserBadge = useCreateBadge();
  const showSnackbar = useSnackbar();

  const submit = () => {
    const formatedId = flag.replace(/flag{/gi, '').replace(/}/gi, '');
    createUserBadge.mutate(formatedId, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setFlag('');
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });
  };

  useEffect(() => {
    if (badgeId) {
      submit();
    }
  }, [badgeId]);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        helperText='flag{xxx-xxx-xxx-xxx-xxx}'
        id='ctf-flag-input'
        label='Send inn flagg'
        onChange={(event) => setFlag(event.target.value)}
        value={flag}
        variant='outlined'
      />
      <Button onClick={submit} sx={{ height: { md: 56 }, minWidth: 120 }} variant='contained'>
        Send inn
      </Button>
    </Stack>
  );
};

export default BadgesGet;
