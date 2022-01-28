// React
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Material-UI
import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

// Hooks
import { useSnackbar } from 'hooks/Snackbar';
import { useCreatePicture } from 'hooks/Gallery';

// Components
import Dialog from 'components/layout/Dialog';
import { ImageUpload } from 'components/inputs/Upload';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';

// Types
import { Picture, PictureRequired } from 'types';

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
type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

const PictureUpload = () => {
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const { handleSubmit, register, watch, formState, setValue } = useForm<FormValues>();
  const acceptedFileTypes = ['jpg', 'png'];
  const createImage = useCreatePicture();
  const { classes } = useStyles();
  const showSnackbar = useSnackbar();

  const submit: SubmitHandler<FormValues> = async (data) => {
    const Image = {
      ...data,
      title: data.title,
      image_alt: data.image_alt,
      description: data.description,
      image: data.image,
    } as PictureRequired;
    await createImage.mutate(Image, {
      onSuccess: () => {
        showSnackbar('Bildet ble lastet opp', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <Typography sx={{ fontSize: 40 }}>Last opp et bilde</Typography>
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        <ImageUpload formState={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt', { required: 'Gi bildet en alt-tekst' })} required />
        <SubmitButton className={classes.margin} formState={formState}>
          Legg til bildet
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

const PictureUploadDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box sx={{ width: '50%', m: '100px auto', padding: 2 }}>
      <Button onClick={() => setOpen(true)} variant='outlined'>
        Last opp et bilde
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <PictureUpload />
      </Dialog>
    </Box>
  );
};

export default PictureUploadDialog;
