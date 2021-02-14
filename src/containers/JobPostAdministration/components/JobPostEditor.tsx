import { useCallback, useMemo, useState, useEffect } from 'react';
import classnames from 'classnames';
import { useForm, SubmitHandler } from 'react-hook-form';
import { JobPost } from 'types/Types';
import { useJobPostById, useCreateJobPost, useUpdateJobPost, useDeleteJobPost } from 'api/hooks/JobPost';
import { useSnackbar } from 'api/hooks/Snackbar';
import { EMAIL_REGEX } from 'constant';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Project components
import JobPostRenderer from 'containers/JobPostDetails/components/JobPostRenderer';
import Dialog from 'components/layout/Dialog';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import RendererPreview from 'components/miscellaneous/RendererPreview';

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

export type EventEditorProps = {
  jobpostId: number | null;
  goToJobPost: (newJobPost: number | null) => void;
};

type FormValues = Pick<
  JobPost,
  'body' | 'company' | 'deadline' | 'email' | 'ingress' | 'image' | 'image_alt' | 'link' | 'location' | 'title' | 'is_continuously_hiring'
>;

const JobPostEditor = ({ jobpostId, goToJobPost }: EventEditorProps) => {
  const classes = useStyles();
  const [isContinuouslyHiring, setIsContinuouslyHiring] = useState(false);
  const { data, isLoading, isError } = useJobPostById(jobpostId || -1);
  const createJobPost = useCreateJobPost();
  const updateJobPost = useUpdateJobPost(jobpostId || -1);
  const deleteJobPost = useDeleteJobPost(jobpostId || -1);
  const showSnackbar = useSnackbar();
  const [deleteJobPostDialogOpen, setDeleteJobPostDialogOpen] = useState(false);
  const { handleSubmit, register, errors, getValues, reset } = useForm<FormValues>();
  const isUpdating = useMemo(() => createJobPost.isLoading || updateJobPost.isLoading || deleteJobPost.isLoading, [
    createJobPost.isLoading,
    updateJobPost.isLoading,
    deleteJobPost.isLoading,
  ]);

  useEffect(() => {
    !isError || goToJobPost(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: JobPost | null) => {
      setIsContinuouslyHiring(newValues?.is_continuously_hiring || false);
      reset({
        body: newValues?.body || '',
        company: newValues?.company || '',
        deadline: newValues?.deadline.substring(0, 16) || new Date().toISOString().substring(0, 16),
        email: newValues?.email || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        ingress: newValues?.ingress || '',
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
      created_at: new Date().toISOString().substring(0, 16),
      is_continuously_hiring: isContinuouslyHiring,
      id: 1,
      expired: false,
      updated_at: new Date().toISOString().substring(0, 16),
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
        { ...data, is_continuously_hiring: isContinuouslyHiring },
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
        { ...data, is_continuously_hiring: isContinuouslyHiring },
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
            <TextField errors={errors} label='Tittel' name='title' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
            <TextField errors={errors} label='Sted' name='location' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
          </div>
          <TextField errors={errors} label='Ingress' name='ingress' register={register} />
          <MarkdownEditor
            error={Boolean(errors.body)}
            helperText={Boolean(errors.body) && 'Gi annonsen en beskrivelse'}
            inputRef={register({ required: true })}
            name='body'
          />
          <FormControlLabel
            control={<Checkbox checked={isContinuouslyHiring} onChange={(e) => setIsContinuouslyHiring(e.target.checked)} />}
            label={'Fortløpende opptak?'}
          />
          <div className={classes.grid}>
            <TextField
              errors={errors}
              InputLabelProps={{ shrink: true }}
              label='Utløpsdato'
              name='deadline'
              register={register}
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='datetime-local'
            />
            <TextField errors={errors} label='Link' name='link' register={register} />
            <TextField errors={errors} label='Logo bilde-url' name='image' register={register} />
            <TextField errors={errors} label='Alternativ bildetekst' name='image_alt' register={register} />
            <TextField errors={errors} label='Bedrift' name='company' register={register} required rules={{ required: 'Du må oppgi en bedrift' }} />
            <TextField
              errors={errors}
              label='E-post'
              name='email'
              register={register}
              rules={{
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Ugyldig e-post',
                },
              }}
              type='email'
            />
          </div>
          <div className={classes.grid}>
            <TextField errors={errors} label='Bilde-url' name='image' register={register} />
            <TextField errors={errors} label='Bildetekst' name='image_alt' register={register} />
          </div>
          <RendererPreview className={classes.margin} getContent={getJobPostPreview} renderer={JobPostRenderer} />
          <SubmitButton className={classes.margin} disabled={isUpdating} errors={errors}>
            {jobpostId ? 'Oppdater annonse' : 'Opprett annonse'}
          </SubmitButton>
          {Boolean(jobpostId) && (
            <Button
              className={classnames(classes.margin, classes.red)}
              disabled={isUpdating}
              onClick={() => setDeleteJobPostDialogOpen(true)}
              variant='outlined'>
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
