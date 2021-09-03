import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { JobPost } from 'types/Types';
import { useJobPostById, useCreateJobPost, useUpdateJobPost, useDeleteJobPost } from 'api/hooks/JobPost';
import { useSnackbar } from 'api/hooks/Snackbar';
import { EMAIL_REGEX } from 'constant';
import { parseISO } from 'date-fns';

// Material-UI
import { makeStyles } from '@mui/styles';
import { Button, Grid, LinearProgress } from '@mui/material';

// Project components
import JobPostRenderer from 'containers/JobPostDetails/components/JobPostRenderer';
import Dialog from 'components/layout/Dialog';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import Bool from 'components/inputs/Bool';
import DatePicker from 'components/inputs/DatePicker';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import RendererPreview from 'components/miscellaneous/RendererPreview';

const useStyles = makeStyles((theme) => ({
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

export type EventEditorProps = {
  jobpostId: number | null;
  goToJobPost: (newJobPost: number | null) => void;
};

type FormValues = Pick<JobPost, 'body' | 'company' | 'email' | 'ingress' | 'image' | 'image_alt' | 'link' | 'location' | 'title' | 'is_continuously_hiring'> & {
  deadline: Date;
};

const JobPostEditor = ({ jobpostId, goToJobPost }: EventEditorProps) => {
  const classes = useStyles();
  const { data, isLoading, isError } = useJobPostById(jobpostId || -1);
  const createJobPost = useCreateJobPost();
  const updateJobPost = useUpdateJobPost(jobpostId || -1);
  const deleteJobPost = useDeleteJobPost(jobpostId || -1);
  const showSnackbar = useSnackbar();
  const [deleteJobPostDialogOpen, setDeleteJobPostDialogOpen] = useState(false);
  const { handleSubmit, control, register, formState, getValues, reset, setValue, watch } = useForm<FormValues>();
  const isUpdating = useMemo(
    () => createJobPost.isLoading || updateJobPost.isLoading || deleteJobPost.isLoading,
    [createJobPost.isLoading, updateJobPost.isLoading, deleteJobPost.isLoading],
  );

  useEffect(() => {
    !isError || goToJobPost(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: JobPost | null) => {
      reset({
        body: newValues?.body || '',
        company: newValues?.company || '',
        deadline: newValues?.deadline ? parseISO(newValues?.deadline) : new Date(),
        email: newValues?.email || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        ingress: newValues?.ingress || '',
        is_continuously_hiring: newValues?.is_continuously_hiring || false,
        link: newValues?.link || '',
        location: newValues?.location || '',
        title: newValues?.title || '',
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

  const getJobPostPreview = () => {
    return {
      ...getValues(),
      created_at: new Date().toJSON(),
      id: 1,
      expired: false,
      updated_at: new Date().toJSON(),
      deadline: getValues().deadline.toJSON(),
    };
  };

  const remove = async () => {
    deleteJobPost.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setDeleteJobPostDialogOpen(false);
        goToJobPost(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    if (jobpostId) {
      await updateJobPost.mutate(
        { ...data, deadline: data.deadline.toJSON() },
        {
          onSuccess: () => {
            showSnackbar('Annonsen ble oppdatert', 'success');
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    } else {
      await createJobPost.mutate(
        { ...data, deadline: data.deadline.toJSON() },
        {
          onSuccess: (newJobPost) => {
            showSnackbar('Annonsen ble opprettet', 'success');
            goToJobPost(newJobPost.id);
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
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
          <div className={classes.grid}>
            <TextField formState={formState} label='Tittel' {...register('title', { required: 'En tittel er påkrevd' })} required />
            <TextField formState={formState} label='Sted' {...register('location', { required: 'Et sted er påkrevd' })} required />
          </div>
          <TextField formState={formState} label='Ingress' {...register('ingress')} />
          <MarkdownEditor formState={formState} {...register('body', { required: 'Gi annonsen en beskrivelse' })} required />
          <Bool control={control} formState={formState} label='Fortløpende opptak?' name='is_continuously_hiring' type='checkbox' />
          <div className={classes.grid}>
            <DatePicker
              control={control}
              formState={formState}
              label='Utløpsdato'
              name='deadline'
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='date-time'
            />
            <TextField formState={formState} label='Link' {...register('link')} />
          </div>
          <ImageUpload formState={formState} label='Velg logo' ratio={21 / 9} register={register('image')} setValue={setValue} watch={watch} />
          <TextField formState={formState} label='Alternativ bildetekst' {...register('image_alt')} />
          <div className={classes.grid}>
            <TextField formState={formState} label='Bedrift' {...register('company', { required: 'Du må oppgi en bedrift' })} required />
            <TextField
              formState={formState}
              label='E-post'
              {...register('email', {
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Ugyldig e-post',
                },
              })}
              type='email'
            />
          </div>
          <RendererPreview className={classes.margin} getContent={getJobPostPreview} renderer={JobPostRenderer} />
          <SubmitButton className={classes.margin} disabled={isUpdating} formState={formState}>
            {jobpostId ? 'Oppdater annonse' : 'Opprett annonse'}
          </SubmitButton>
          {Boolean(jobpostId) && (
            <Button className={classes.margin} color='error' disabled={isUpdating} onClick={() => setDeleteJobPostDialogOpen(true)} variant='outlined'>
              Slett
            </Button>
          )}
        </Grid>
      </form>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Sletting av annonser kan ikke reverseres.'
        onClose={() => setDeleteJobPostDialogOpen(false)}
        onConfirm={remove}
        open={deleteJobPostDialogOpen}
        titleText='Er du sikker?'
      />
    </>
  );
};

export default JobPostEditor;
