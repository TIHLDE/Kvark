import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { News } from 'types';

import { useCreateNews, useDeleteNews, useNewsById, useUpdateNews } from 'hooks/News';
import { useSnackbar } from 'hooks/Snackbar';

import NewsRenderer from 'pages/NewsDetails/components/NewsRenderer';

import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import UserSearch from 'components/inputs/UserSearch';
import VerifyDialog from 'components/layout/VerifyDialog';
import RendererPreview from 'components/miscellaneous/RendererPreview';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const useStyles = makeStyles()((theme) => ({
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
}));

export type NewsEditorProps = {
  newsId: number | null;
  goToNews: (newNews: number | null) => void;
};

type FormValues = Pick<News, 'title' | 'header' | 'body' | 'image' | 'image_alt' | 'creator'> & {
  allowEmojis: boolean;
};

const NewsEditor = ({ newsId, goToNews }: NewsEditorProps) => {
  const showSnackbar = useSnackbar();
  const { classes } = useStyles();
  const { control, handleSubmit, register, formState, getValues, reset, watch } = useForm<FormValues>();
  const { data, isError, isLoading } = useNewsById(newsId || -1);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(newsId || -1);
  const deleteNews = useDeleteNews(newsId || -1);
  const isUpdating = useMemo(
    () => createNews.isLoading || updateNews.isLoading || deleteNews.isLoading,
    [createNews.isLoading, updateNews.isLoading, deleteNews.isLoading]
  );

  useEffect(() => {
    !isError || goToNews(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: News | null) => {
      reset({
        title: newValues?.title || '',
        header: newValues?.header || '',
        creator: newValues?.creator || null,
        body: newValues?.body || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        allowEmojis: newValues?.allowEmojis ?? false
      });
    },
    [reset]
  );

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const remove = async () => {
    deleteNews.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        goToNews(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit = async (data: FormValues) => {
    const payload = {
      ...data,
      creator: data.creator?.user_id || null,
    };
    newsId
      ? updateNews.mutate(payload, {
          onSuccess: () => {
            showSnackbar('Nyheten ble oppdatert', 'success');
          },
          onError: (err) => {
            showSnackbar(err.detail, 'error');
          },
        })
      : createNews.mutate(payload, {
          onSuccess: (newNewsItem) => {
            showSnackbar('Nyheten ble opprettet', 'success');
            goToNews(newNewsItem.id);
          },
          onError: (err) => {
            showSnackbar(err.detail, 'error');
          },
        });
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <TextField formState={formState} label='Tittel' {...register('title', { required: 'Feltet er påkrevd' })} required />
          <TextField formState={formState} label='Header' {...register('header', { required: 'Feltet er påkrevd' })} required />
          <ImageUpload formState={formState} label='Bilde' {...register('image')} />
          <TextField formState={formState} label='Bildealt' {...register('image_alt')} />
          <UserSearch formState={formState} label='Opprettet av' {...register('creator')} />
          <MarkdownEditor formState={formState} {...register('body', { required: 'Feltet er påkrevd' })} required />
          <FormControlLabel
            control={<Checkbox {...register('allowEmojis')} />}
            label='Tillat emojis'
          />
          <SubmitButton formState={formState} className={classes.margin}>
            {newsId ? 'Oppdater' : 'Opprett'}
          </SubmitButton>
        </Grid>
      </form>
      {newsId && (
        <VerifyDialog
          onClose={() => {}}
          onConfirm={remove}
          title='Slett nyhet'
          description='Er du sikker på at du vil slette denne nyheten? Dette vil også slette alle kommentarene tilknyttet nyheten.'
        >
          Slett
        </VerifyDialog>
      )}
    </>
  );
};

export default NewsEditor;
