import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { useCreateBadge } from 'hooks/Badge';
import { useSnackbar } from 'hooks/Snackbar';

import Paper from 'components/layout/Paper';

export type BadgeInputProps = {
  flagCount: number;
  title: string;
  allBadgesFound?: boolean;
};

const BadgeInput = ({ flagCount, title, allBadgesFound = false }: BadgeInputProps) => {
  const [flag, setFlag] = useState<string>('');
  const createUserBadge = useCreateBadge();
  const showSnackbar = useSnackbar();
  const infoText = `Velkommen til TIHLDE ${title}. Vi i Index har er skjult ${flagCount} flagg rundt omkring på siden.`;
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

  return (
    <Paper sx={{ mx: 2 }}>
      <Grid alignItems='center' container direction='column' justifyContent='center'>
        <Typography align='center' gutterBottom variant='h2'>
          {title}
        </Typography>
        {allBadgesFound ? (
          <Typography align='center'>{infoText} Alle flaggene er funnet, men hvis du har lyst på kule badges så er det bare å lete</Typography>
        ) : (
          <Typography align='center'>
            {infoText} Når du finner alle flaggene, send mail til <a href='mailto:Index@tihlde.org'>index@tihlde.org</a>
          </Typography>
        )}
        <Typography align='center' gutterBottom>
          Lykke til!!
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <TextField
            helperText='flag{xxx-xxx-xxx-xxx-xxx}'
            id='ctf-flag-input'
            label='Send inn flagg'
            onChange={(event) => setFlag(event.target.value)}
            value={flag}
            variant='outlined'
          />
          <Button onClick={submit} sx={{ height: { md: 56 } }} variant='contained'>
            Send inn
          </Button>
        </Stack>
      </Grid>
    </Paper>
  );
};

export default BadgeInput;
