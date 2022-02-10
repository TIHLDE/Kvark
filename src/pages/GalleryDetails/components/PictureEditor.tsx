// React
import { useCallback, useState, useEffect } from 'react';
import { SubmitHandler, useForm, UseFormGetValues } from 'react-hook-form';

// Material-UI
import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

// Hooks
import { useUpdatePicture, useDeletePicture, usePictureById } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

//Types
import { Picture, PictureRequired } from 'types';

// Components
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles()((theme) => ({
  dialog: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));

type PictureEditorProps = {
  id: string;
  slug: string;
};

type FormValues = Pick<Picture, 'title' | 'image' | 'description' | 'image_alt'>;

const PictureEditor = ({ id, slug }: PictureEditorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { classes } = useStyles();
  const { data, isLoading } = usePictureById(slug, id);
  const editPicture = useUpdatePicture(slug, id);
  const deletePicture = useDeletePicture(slug, id);
  const showSnackbar = useSnackbar();
  const { handleSubmit, register, watch, control, formState, getValues, reset, setValue } = useForm<FormValues>();
  const setValues = useCallback(
    (newValues: Picture | null) => {
      reset({
        title: newValues?.title || '',
        image: newValues?.image || '',
        description: newValues?.description || '',
        image_alt: newValues?.image_alt || '',
      });
    },
    [reset],
  );

  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  const remove = async () => {
    deletePicture.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const picture = {
      ...data,
    } as PictureRequired;
    if (id) {
      await editPicture.mutate(picture, {
        onSuccess: () => {
          showSnackbar('Bildet ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } // else {
    //   await .mutate(picture, {
    //     onSuccess: (newEvent) => {
    //       showSnackbar('Arrangementet ble opprettet', 'success');
    //       goToEvent(newEvent.id);
    //     },
    //     onError: (e) => {
    //       showSnackbar(e.detail, 'error');
    //     },
    //   });
    // }
  };

  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  return (
    <Box sx={{ mt: '100px', padding: '10' }}>
      <Dialog onClose={() => setOpen(false)} open={open}></Dialog>
    </Box>
  );
};

export default PictureEditor;
