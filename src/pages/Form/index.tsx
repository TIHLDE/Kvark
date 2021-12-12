import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Form, Submission, EventForm } from 'types';
import { useFormById, useCreateSubmission, validateSubmissionInput } from 'hooks/Form';
import { useSnackbar } from 'hooks/Snackbar';
import { useForm } from 'react-hook-form';
import { useGoogleAnalytics } from 'hooks/Utils';
import { formatDate } from 'utils';
import { parseISO } from 'date-fns';
import URLS from 'URLS';

// Material UI Components
import { Button, Divider, Stack, Typography } from '@mui/material';

// Project Components
import Http404 from 'pages/Http404';
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import FormView from 'components/forms/FormView';
import SubmitButton from 'components/inputs/SubmitButton';
import { FormResourceType, FormType } from 'types/Enums';

const FormPage = () => {
  const { event: GAEvent } = useGoogleAnalytics();
  const { id } = useParams<'id'>();
  const { data: form, isError } = useFormById(id || '-');
  const createSubmission = useCreateSubmission(id || '-');
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const title = useMemo(() => (form?.type === FormType.EVALUATION ? 'Evaluering' : 'Spørreskjema'), [form]);
  const subtitle = useMemo(
    () => (
      <>
        {form?.resource_type === FormResourceType.EVENT_FORM && (
          <>
            {`Arrangøren av `}
            <Link to={`${URLS.events}${(form as EventForm).event.id}/`}>{`"${(form as EventForm).event.title}"`}</Link>
            {`, som ble holdt ${formatDate(parseISO((form as EventForm).event.start_date)).toLowerCase()} på ${
              (form as EventForm).event.location
            },  ønsker at du svarer på følgende spørsmål:`}
          </>
        )}
      </>
    ),
    [form],
  );

  const { register, handleSubmit, formState, setError, getValues, control } = useForm<Form['fields']>();

  const submitDisabled = isLoading || createSubmission.isLoading || !form;

  const submit = async (data: Submission) => {
    if (submitDisabled || !form) {
      return;
    }
    setIsLoading(true);
    data.answers = data.answers || [];
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

  const isEventFormButNotEvaluation = Boolean(form && form.resource_type === FormResourceType.EVENT_FORM && form.type !== FormType.EVALUATION);

  if (isError || isEventFormButNotEvaluation) {
    return <Http404 />;
  }

  const canAnswerForm = Boolean(form && (!form.viewer_has_answered || form.resource_type === FormResourceType.GROUP_FORM));

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
        {form ? (
          <>
            <Typography align='center' variant='h2'>
              {title}
            </Typography>
            <Typography align='center' variant='subtitle2'>
              {subtitle}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {canAnswerForm ? (
              <form onSubmit={handleSubmit(submit)}>
                {form && (
                  <FormView
                    alignText='center'
                    control={control}
                    disabled={submitDisabled}
                    form={form}
                    formState={formState}
                    getValues={getValues}
                    register={register}
                  />
                )}
                <SubmitButton disabled={submitDisabled} formState={formState} sx={{ mt: 2 }}>
                  Send inn svar
                </SubmitButton>
              </form>
            ) : (
              <>
                <Typography align='center' variant='body2'>
                  Du har allerede svart på dette spørreskjemaet, takk!
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={1} sx={{ mt: 2 }}>
                  <Button component={Link} fullWidth to={URLS.landing} variant='outlined'>
                    Gå til forsiden
                  </Button>
                  <Button component={Link} fullWidth to={URLS.profile} variant='outlined'>
                    Gå til profilen
                  </Button>
                </Stack>
              </>
            )}
          </>
        ) : (
          <Typography align='center' variant='h2'>
            Laster spørreskjema...
          </Typography>
        )}
      </Paper>
    </Page>
  );
};

export default FormPage;
