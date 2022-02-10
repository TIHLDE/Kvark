// React
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Material-UI
import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

// Hooks
import { useSnackbar } from 'hooks/Snackbar';
import { useCreateAlbum } from 'hooks/Gallery';

// Components
import Dialog from 'components/layout/Dialog';
import { ImageUpload } from 'components/inputs/Upload';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { BannerButton } from 'components/layout/Banner';

// Types
import { Gallery, GalleryRequired } from 'types';

const useStyles = makeStyles()((theme) => ({
  uploadInput: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
      gridGap: 0,
      gridTemplateColumns: '1fr',
    },
  },
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  expansionPanel: {
    border: '1px solid ' + theme.palette.divider,
    background: theme.palette.background.smoke,
  },
}));
type FormValues = Omit<Gallery, 'slug'>;

const CreateAlbum = () => {
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const { handleSubmit, register, watch, formState, setValue } = useForm<FormValues>();
  const acceptedFileTypes = ['jpg', 'png'];
  const createAlbum = useCreateAlbum();
  const { classes } = useStyles();
  const showSnackbar = useSnackbar();

  const submit: SubmitHandler<FormValues> = async (data) => {
    const gallery = {
      ...data,
      slug: '_',
      title: data.title,
      description: data.description,
      image: data.image,
      image_alt: data.image_alt,
    } as GalleryRequired;
    await createAlbum.mutate(gallery, {
      onSuccess: () => {
        showSnackbar('Albumet ble lagt til', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <Typography sx={{ fontSize: 40 }}>Opprett et nytt bilde album</Typography>
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        <ImageUpload formState={formState} label='Velg display bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Alt-tekst til bildet' {...register('image_alt', { required: 'Gi bildet en alt-tekst' })} required />
        <SubmitButton className={classes.margin} formState={formState}>
          Opprett nytt album
        </SubmitButton>
      </form>
      <Dialog
        contentText={acceptedFileTypes.join(', ').toUpperCase()}
        onClose={() => setAcceptedFileTypesOpen(false)}
        open={acceptedFileTypesOpen}
        titleText='Godkjente filtyper'
      />
    </Box>
  );
};

const CreateAlbumDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <BannerButton onClick={() => setOpen(true)} variant='outlined'>
        Opprett nytt album
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <CreateAlbum />
      </Dialog>
    </Box>
  );
};

export default CreateAlbumDialog;
