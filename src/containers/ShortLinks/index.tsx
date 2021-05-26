import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useShare from 'use-share';
import { useShortLinks, useCreateShortLink, useDeleteShortLink } from 'api/hooks/ShortLink';
import { useSnackbar } from 'api/hooks/Snackbar';
import { ShortLink } from 'types/Types';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiTextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

// Icons
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import ShareIcon from '@material-ui/icons/ShareRounded';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import TextField from 'components/inputs/TextField';
import SubmitButton from 'components/inputs/SubmitButton';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      order: 1,
    },
  },
  create: {
    display: 'grid',
    gridGap: theme.spacing(1),
    position: 'sticky',
    top: 88,

    [theme.breakpoints.down('md')]: {
      order: 0,
      position: 'static',
      top: 0,
    },
  },
  adornment: {
    marginRight: 0,
  },
  delete: {
    color: theme.palette.error.main,
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
  const classes = useStyles();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const deleteShortLink = useDeleteShortLink();
  const showSnackbar = useSnackbar();
  const { share, hasShared } = useShare({
    title: shortLink.name,
    url: `https://s.tihlde.org/${shortLink.name}`,
  });
  const remove = () => {
    deleteShortLink.mutate(shortLink.name, {
      onSuccess: () => {
        showSnackbar('Linken ble slettet', 'success');
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
      <Button className={classes.delete} endIcon={<DeleteIcon />} fullWidth onClick={() => setRemoveDialogOpen(true)}>
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
  const classes = useStyles();
  const { data, error, isFetching } = useShortLinks();
  const createShortLink = useCreateShortLink();
  const showSnackbar = useSnackbar();
  const { register, errors, handleSubmit, setError, reset } = useForm<ShortLink>();

  const create = (data: ShortLink) => {
    createShortLink.mutate(data, {
      onSuccess: () => {
        showSnackbar('Linken ble opprettet', 'success');
        reset();
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
        <Paper className={classes.create}>
          <form onSubmit={handleSubmit(create)}>
            <Typography variant='h2'>Ny link</Typography>
            <TextField
              disabled={isFetching}
              errors={errors}
              InputProps={{
                startAdornment: (
                  <InputAdornment className={classes.adornment} position='start'>
                    s.tihlde.org/
                  </InputAdornment>
                ),
              }}
              label='Navn'
              name='name'
              register={register}
              rules={{ required: 'Du må gi linken et navn' }}
            />
            <TextField disabled={isFetching} errors={errors} label='URL' name='url' register={register} rules={{ required: 'Du må oppgi en link' }} />
            <SubmitButton disabled={isFetching} errors={errors}>
              Opprett
            </SubmitButton>
          </form>
        </Paper>
      </div>
    </Page>
  );
};

export default ShortLinks;
