import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import URLS from 'URLS';
import { formatDate } from 'utils';
import { z } from 'zod';

import { SelectFieldSubmission, Submission, TextFieldSubmission } from 'types';
import { EventFormType, FormResourceType } from 'types/Enums';

import { useCreateSubmission, useFormById, validateSubmissionInput, validateSubmissionTextInput } from 'hooks/Form';
import { useAnalytics } from 'hooks/Utils';

import Http404 from 'pages/Http404';

import FormView from 'components/forms/FormView';
import Page from 'components/navigation/Page';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Form } from 'components/ui/form';
import { Separator } from 'components/ui/separator';

const formSchema = z.object({
  answers: z.array(
    z.object({
      field: z.object({
        id: z.string(),
      }),
      answer_text: z.string().optional(),
      selected_options: z.array(z.string()).optional(),
    }),
  ),
});

const FormPage = () => {
  const navigate = useNavigate();
  const { event: GAEvent } = useAnalytics();
  const { id } = useParams<'id'>();
  const { data: form, isError } = useFormById(id || '-');
  const createSubmission = useCreateSubmission(id || '-');
  const [isLoading, setIsLoading] = useState(false);
  const title = useMemo(
    () => (form ? (form.resource_type === FormResourceType.EVENT_FORM && form.type === EventFormType.EVALUATION ? 'Evaluering' : form.title) : ''),
    [form],
  );
  const subtitle = useMemo(
    () => (
      <>
        {form?.resource_type === FormResourceType.EVENT_FORM && (
          <>
            {`Arrangøren av `}
            <Link to={`${URLS.events}${form.event.id}/`}>{`"${form.event.title}"`}</Link>
            {`, som ble holdt ${formatDate(parseISO(form.event.start_date)).toLowerCase()} på ${
              form.event.location
            },  ønsker at du svarer på følgende spørsmål:`}
          </>
        )}
      </>
    ),
    [form],
  );

  const submitForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { answers: [] },
  });

  const submitDisabled = isLoading || createSubmission.isLoading || !form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: Submission = {
      answers: values.answers.map((answer) => {
        if ('selected_options' in answer) {
          return {
            field: { id: answer.field.id },
            selected_options: answer.selected_options?.map((option) => ({ id: option })) || [],
            type: 'select-field',
          } satisfies SelectFieldSubmission;
        }

        return {
          field: { id: answer.field.id },
          answer_text: answer.answer_text || '',
          type: 'text-field',
        } satisfies TextFieldSubmission;
      }),
    };
    if (submitDisabled || !form) {
      return;
    }
    setIsLoading(true);
    data.answers = data.answers || [];
    try {
      validateSubmissionTextInput(data, form);
      validateSubmissionInput(data, form);
    } catch (e) {
      submitForm.setError(e.message, { message: 'Du må velge ett eller flere alternativ' });
      setIsLoading(false);
      return;
    }
    createSubmission.mutate(data, {
      onSuccess: () => {
        toast.success('Innsendingen var vellykket');
        GAEvent('submitted', 'forms', `Submitted submission for form: ${form.title}`);
        navigate(-1);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const isEventFormButNotEvaluation = Boolean(form && form.resource_type === FormResourceType.EVENT_FORM && form.type !== EventFormType.EVALUATION);

  if (isError || isEventFormButNotEvaluation) {
    return <Http404 />;
  }

  const canAnswerForm = Boolean(form && (!form.viewer_has_answered || (form.resource_type === FormResourceType.GROUP_FORM && form.can_submit_multiple)));

  return (
    <Page className='max-w-5xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {form ? (
            <>
              {form.description && <p>{form.description}</p>}
              <Separator className='my-2' />
              {canAnswerForm ? (
                <Form {...submitForm}>
                  <form className='space-y-4' onSubmit={submitForm.handleSubmit(onSubmit)}>
                    {form && <FormView disabled={submitDisabled} form={form} submitForm={submitForm} />}
                    <Button className='w-full' disabled={submitDisabled} type='submit'>
                      {createSubmission.isLoading ? 'Sender inn...' : 'Send inn'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <>
                  <h1 className='text-center'>Du har allerede svart på dette spørreskjemaet, takk!</h1>
                  <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2 mt-4'>
                    <Button asChild className='w-full text-black dark:text-white' variant='outline'>
                      <Link to={URLS.landing}>Gå til forsiden</Link>
                    </Button>
                    <Button asChild className='w-full text-black dark:text-white' variant='outline'>
                      <Link to={URLS.profile}>Gå til profilen din</Link>
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <h1 className='text-center'>Laster spørreskjema...</h1>
          )}
        </CardContent>
      </Card>
    </Page>
  );
};

export default FormPage;
