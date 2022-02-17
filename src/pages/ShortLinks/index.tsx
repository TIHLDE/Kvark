import DeleteIcon from '@mui/icons-material/DeleteRounded';
import ShareIcon from '@mui/icons-material/ShareRounded';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ShortLink } from 'types';

import { useCreateShortLink, useDeleteShortLink, useShortLinks } from 'hooks/ShortLink';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics, useShare } from 'hooks/Utils';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { FileUpload } from 'components/inputs/Upload';
import Banner from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
      order: 1,
    },
  },
  create: {
    display: 'grid',
    gridGap: theme.spacing(2),
    position: 'sticky',
    top: 80,

    [theme.breakpoints.down('lg')]: {
      order: 0,
      position: 'static',
      top: 0,
    },
  },
  adornment: {
    marginRight: 0,
  },
  shortLink: {
    padding: theme.spacing(2, 3),
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  header: {
    margin: 'auto 0',
  },
}));

type ShortLinkItemProps = {
  shortLink: ShortLink;
};

const ShortLinkItem = ({ shortLink }: ShortLinkItemProps) => {
  const { classes } = useStyles();
  const { event } = useAnalytics();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const deleteShortLink = useDeleteShortLink();
  const showSnackbar = useSnackbar();
  const { share, hasShared } = useShare(
    {
      title: shortLink.name,
      url: `https://s.tihlde.org/${shortLink.name}`,
    },
    'Linken ble kopiert til utklippstavlen',
    () => event(`share-shortlink`, 'share', `https://s.tihlde.org/${shortLink.name}`),
  );
  const remove = () => {
    deleteShortLink.mutate(shortLink.name, {
      onSuccess: () => {
        showSnackbar('Linken ble slettet', 'success');
        event('delete', 'short-link', `Delete ${shortLink.name}`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Paper className={classes.shortLink}>
      <div className={classes.row}>
        <Typography className={classes.header} variant='h3'>
          {shortLink.name}
        </Typography>
        <IconButton color='primary' disabled={hasShared} onClick={share}>
          <ShareIcon />
        </IconButton>
      </div>
      <MuiTextField fullWidth label='Link' margin='dense' size='small' value={`https://s.tihlde.org/${shortLink.name}`} variant='outlined' />
      <MuiTextField fullWidth label='Leder til' margin='dense' size='small' value={shortLink.url} variant='outlined' />
      <Button color='error' endIcon={<DeleteIcon />} fullWidth onClick={() => setRemoveDialogOpen(true)}>
        Slett link
      </Button>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Andre medlemmer vil kunne opprette en link med dette navnet etter at linken er slettet.'
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={remove}
        open={removeDialogOpen}
        titleText='Er du sikker?'
      />
    </Paper>
  );
};

const ShortLinks = () => {
  const { classes } = useStyles();
  const { event } = useAnalytics();
  const { data, error, isFetching } = useShortLinks();
  const createShortLink = useCreateShortLink();
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, setError, reset } = useForm<ShortLink>();

  const create = (data: ShortLink) => {
    createShortLink.mutate(data, {
      onSuccess: () => {
        showSnackbar('Linken ble opprettet', 'success');
        reset();
        event('create', 'short-link', `Created ${data.name}`);
      },
      onError: (e) => {
        setError('name', { message: typeof e.detail === 'string' ? e.detail : JSON.stringify(e.detail) });
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Page banner={<Banner text='Opprett, se og slett dine korte linker' title='Link-forkorter' />} options={{ title: 'Link-forkorter' }}>
      <div className={classes.grid}>
        <div className={classes.list}>
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <>
              {!data?.length && <NotFoundIndicator header='Fant ingen linker' />}
              {data.map((shortLink) => (
                <ShortLinkItem key={shortLink.name} shortLink={shortLink} />
              ))}
            </>
          )}
        </div>
        <div className={classes.create}>
          <Paper>
            <form onSubmit={handleSubmit(create)}>
              <Typography variant='h2'>Ny link</Typography>
              <TextField
                disabled={isFetching}
                formState={formState}
                inputProps={{
                  startAdornment: (
                    <InputAdornment className={classes.adornment} position='start'>
                      s.tihlde.org/
                    </InputAdornment>
                  ),
                }}
                label='Navn'
                {...register('name', { required: 'Du må gi linken et navn' })}
                required
              />
              <TextField disabled={isFetching} formState={formState} label='URL' {...register('url', { required: 'Du må oppgi en link' })} required />
              <SubmitButton disabled={isFetching} formState={formState}>
                Opprett
              </SubmitButton>
            </form>
          </Paper>
          <Paper>
            <Typography variant='h3'>Filopplastning</Typography>
            <Typography variant='subtitle2'>
              Last opp filer og få en link du kan dele med andre. Bruk link-forkorteren hvis du vil ha enda kortere linker.
            </Typography>
            <FileUpload />
          </Paper>
        </div>
      </div>
    </Page>
  );
};

export default ShortLinks;
