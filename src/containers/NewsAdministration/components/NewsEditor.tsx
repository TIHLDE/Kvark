import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSnackbar } from 'api/hooks/Snackbar';
import { SubmitHandler, useForm } from 'react-hook-form';
import { News } from 'types/Types';
import classNames from 'classnames';

// API and store imports
import { useUpdateNews, useCreateNews, useDeleteNews, useNewsById } from 'api/hooks/News';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

// Project components
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import Dialog from 'components/layout/Dialog';
import TextField from 'components/inputs/TextField';
import RendererPreview from 'components/miscellaneous/RendererPreview';
import NewsRenderer from 'containers/NewsDetails/components/NewsRenderer';
import SubmitButton from 'components/inputs/SubmitButton';
import FileUpload from 'components/inputs/FileUpload';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridGap: 0,
      gridTemplateColumns: '1fr',
    },
  },
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  red: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
}));

export type NewsEditorProps = {
  newsId: number | null;
  goToNews: (newNews: number | null) => void;
};

type FormValues = Pick<News, 'title' | 'header' | 'body' | 'image' | 'image_alt'>;

const NewsEditor = ({ newsId, goToNews }: NewsEditorProps) => {
  const showSnackbar = useSnackbar();
  const classes = useStyles();
  const { handleSubmit, register, errors, getValues, reset } = useForm<FormValues>();
  const [deleteNewsDialogOpen, setDeleteNewsDialogOpen] = useState(false);
  const { data, isError, isLoading } = useNewsById(newsId || -1);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(newsId || -1);
  const deleteNews = useDeleteNews(newsId || -1);
  const isUpdating = useMemo(() => createNews.isLoading || updateNews.isLoading || deleteNews.isLoading, [
    createNews.isLoading,
    updateNews.isLoading,
    deleteNews.isLoading,
  ]);

  useEffect(() => {
    !isError || goToNews(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: News | null) => {
      reset({
        title: newValues?.title || '',
        header: newValues?.header || '',
        body: newValues?.body || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
      });
    },
    [reset],
  );

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const getNewsPreview = () => {
    return {
      ...getValues(),
      created_at: new Date().toISOString().substring(0, 16),
      id: 1,
      updated_at: new Date().toISOString().substring(0, 16),
    };
  };
  const remove = async () => {
    deleteNews.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setDeleteNewsDialogOpen(false);
        goToNews(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };
  const submit: SubmitHandler<FormValues> = async (data) => {
    newsId
      ? await updateNews.mutate(data, {
          onSuccess: () => {
            showSnackbar('Nyheten ble oppdatert', 'success');
          },
          onError: (err) => {
            showSnackbar(err.detail, 'error');
          },
        })
      : await createNews.mutate(data, {
          onSuccess: (newNewsItem) => {
            showSnackbar('Nyheten ble opprettet', 'success');
            goToNews(newNewsItem.id);
          },
          onError: (err) => {
            showSnackbar(err.detail, 'error');
          },
        });
  };

  const onImageUpload = async (url: string) => {
    if (data && newsId) {
      // console.log(url);
      await updateNews.mutate(
        { ...data, image: url },
        {
          onSuccess: () => {
            showSnackbar('Lastet opp bildet', 'success');
            Promise.resolve();
          },
          onError: (err) => {
            showSnackbar(err.detail, 'error');
            Promise.resolve();
          },
        },
      );
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }
  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <TextField errors={errors} label='Tittel' name='title' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
          <TextField errors={errors} label='Header' name='header' register={register} required rules={{ required: 'Feltet er påkrevd' }} />

          {newsId && <FileUpload label='Velg bilde' onUpload={onImageUpload} requiredRatio={21 / 9} url={data?.image} />}

          <MarkdownEditor
            error={Boolean(errors.body)}
            helperText={Boolean(errors.body) && 'Gi nyheten et innhold'}
            inputRef={register({ required: true })}
            label='Innhold'
            name='body'
          />
          <TextField errors={errors} label='Bilde url' name='image' register={register} />
          <TextField errors={errors} label='Alternativ bildetekst' name='image_alt' register={register} />
          <RendererPreview className={classes.margin} getContent={getNewsPreview} renderer={NewsRenderer} />
          <SubmitButton className={classes.margin} disabled={isUpdating} errors={errors}>
            {newsId ? 'Oppdater nyhet' : 'Opprett nyhet'}
          </SubmitButton>
          {Boolean(newsId) && (
            <Button className={classNames(classes.margin, classes.red)} disabled={isUpdating} onClick={() => setDeleteNewsDialogOpen(true)} variant='outlined'>
              Slett
            </Button>
          )}
        </Grid>
      </form>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Sletting av nyheten kan ikke reverseres.'
        onClose={() => setDeleteNewsDialogOpen(false)}
        onConfirm={remove}
        open={deleteNewsDialogOpen}
        titleText='Er du sikker?'
      />
    </>
  );
};

export default NewsEditor;
