import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Submission, EventForm } from 'types';
import { useFormById, useCreateSubmission, validateSubmissionInput } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { useForm } from 'react-hook-form';
import { useGoogleAnalytics } from 'hooks/Utils';
import { formatDate } from 'utils';
import { parseISO } from 'date-fns';

// Material UI Components
import { Divider, Button, Typography } from '@mui/material';

// Project Components
import Http404 from 'pages/Http404';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import FormView from 'components/forms/FormView';
import { FormResourceType, FormType } from 'types/Enums';

const FormPage = () => {
  const { event: GAEvent } = useGoogleAnalytics();
  const { id } = useParams();
  const { data: form, isError } = useFormById(id);
  const createSubmission = useCreateSubmission(id);
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const title = useMemo(() => (form?.type === FormType.EVALUATION ? 'Evaluering' : 'Spørreskjema'), [form]);
  const subtitle = useMemo(
    () =>
      form?.resource_type === FormResourceType.EVENT_FORM
        ? `"${(form as EventForm).event.title}", ${formatDate(parseISO((form as EventForm).event.start_date))} på ${(form as EventForm).event.location}`
        : '',
    [form],
  );

  const { register, handleSubmit, formState, setError, getValues, control } = useForm<Form['fields']>();

  const submitDisabled = isLoading || createSubmission.isLoading || !form;

  const submit = async (data: Submission) => {
    if (submitDisabled || !form) {
      return;
    }
    setIsLoading(true);
    try {
      validateSubmissionInput(data, form);
    } catch (e) {
      setError(e.message, { message: 'Du må velge ett eller flere alternativ' });
      setIsLoading(false);
      return;
    }
    createSubmission.mutate(data, {
      onSuccess: () => {
        showSnackbar('Innsendingen var vellykket', 'success');
        GAEvent('submitted', 'forms', `Submitted submission for form: ${form.title}`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  // Only allow users to view form if it's an evaluation-form
  if (isError || (form && form.type !== FormType.EVALUATION)) {
    return <Http404 />;
  }

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: `${form?.title || 'Laster spørreskjema...'} - Spørreskjema` }}>
      <Paper
        sx={{
          maxWidth: (theme) => theme.breakpoints.values.md,
          margin: 'auto',
          position: 'relative',
          left: 0,
          right: 0,
          top: -60,
        }}>
        <Typography align='center' variant='h2'>
          {title}
        </Typography>
        <Typography align='center' variant='subtitle2'>
          {subtitle}
        </Typography>
        <Typography align='center' variant='subtitle2'>
          Arrangøren ønsker at du svarer på følgende spørsmål
        </Typography>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit(submit)}>
          {form && <FormView control={control} disabled={submitDisabled} form={form} formState={formState} getValues={getValues} register={register} />}
          <Button disabled={submitDisabled} fullWidth sx={{ mt: 2 }} type='submit' variant='contained'>
            Send inn svar
          </Button>
        </form>
      </Paper>
    </Page>
  );
};

export default FormPage;
