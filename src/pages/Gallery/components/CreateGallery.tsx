import { Box, Button, MenuItem } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Gallery, GalleryRequired } from 'types';

import { useEvents } from 'hooks/Event';
import { useCreateAlbum } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles()((theme) => ({
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));
type FormValues = Omit<Gallery, 'slug'>;

const CreateAlbum = () => {
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const { handleSubmit, register, watch, formState, setValue, control } = useForm<FormValues>();
  const acceptedFileTypes = ['jpg', 'png'];
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
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
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        {/* {Boolean(events.length) && (
          <Select control={control} formState={formState} label='Kategori' name='category'>
            {events.map((value, index) => (
              <MenuItem key={index} value={value.id}>
                {value.text}
              </MenuItem>
            ))}
          </Select>
        )} */}
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
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Opprett et nytt bilde album'}>
        <CreateAlbum />
      </Dialog>
    </Box>
  );
};

export default CreateAlbumDialog;
