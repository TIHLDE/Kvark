import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { createSubmissionMutation, getFormByIdQuery } from '~/api/queries/forms';
import FormView from '~/components/forms/FormView';
import Page from '~/components/navigation/Page';
import Http404 from '~/components/shells/Http404';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { Separator } from '~/components/ui/separator';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { formatDate, urlEncode } from '~/utils';
import { parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add auth protection — previously used authClientWithRedirect()

export const Route = createFileRoute('/_MainLayout/sporreskjema/$id')({
  component: FormPage,
});

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

type FormAnswers = z.infer<typeof formSchema>['answers'];
type FormField = { id: string; type: string; required: boolean };

function validateRequiredAnswers(answers: FormAnswers, fields: FormField[]) {
  for (const answer of answers) {
    const field = fields.find((f) => f.id === answer.field.id);
    if (!field?.required) continue;

    if (field.type === 'multiple_select' && (!answer.selected_options || answer.selected_options.length === 0)) {
      throw new Error(`Du må velge minst ett alternativ for "${field.id}"`);
    }
    if (field.type === 'text_answer' && !answer.answer_text) {
      throw new Error(`Du må fylle ut tekstfeltet for "${field.id}"`);
    }
  }
}

// The SDK FormDetail type doesn't include event-form-specific fields.
// This helper narrows to the event sub-shape when resource_type confirms it.
type EventFormLike = { event: { id: string; title: string; start_date: string; location: string }; type: string };
function asEventForm(form: Record<string, unknown>): EventFormLike | null {
  if (form.resource_type === 'EventForm' && 'event' in form) {
    return form as unknown as EventFormLike;
  }
  return null;
}

function FormPage() {
  const router = useRouter();
  const { event: GAEvent } = useAnalytics();
  const { id } = Route.useParams();
  const canGoBack = useCanGoBack();

  const { data: form } = useSuspenseQuery(getFormByIdQuery(id));
  const submitMutation = useMutation(createSubmissionMutation);

  const eventForm = asEventForm(form as Record<string, unknown>);
  const isEvaluation = eventForm?.type === 'evaluation';
  const title = isEvaluation ? 'Evaluering' : form.title;

  const subtitle = eventForm ? (
    <>
      {`Arrangøren av `}
      <Link
        to='/arrangementer/$id/{-$urlTitle}'
        params={{ id: String(eventForm.event.id), urlTitle: urlEncode(eventForm.event.title) }}
      >
        {`"${eventForm.event.title}"`}
      </Link>
      {`, som ble holdt ${formatDate(parseISO(eventForm.event.start_date)).toLowerCase()} på ${eventForm.event.location},  ønsker at du svarer på følgende spørsmål:`}
    </>
  ) : null;

  const submitForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { answers: [] },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (submitMutation.isPending) return;

    const answers = values.answers.map((answer) => ({
      field: { id: answer.field.id },
      answer_text: answer.answer_text,
      selected_options: answer.selected_options?.map((optionId) => ({ id: optionId })),
    }));

    try {
      validateRequiredAnswers(values.answers, form.fields);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `Det oppstod en feil: ${String(e)}`);
      return;
    }

    submitMutation.mutate(
      { formId: id, data: { answers } },
      {
        onSuccess: () => {
          toast.success('Innsendingen var vellykket');
          GAEvent('submitted', 'forms', `Submitted submission for form: ${form.title}`);
          router.history.go(-1);
        },
        onError: (e) => {
          toast.error(e instanceof Error ? e.message : 'Det oppstod en feil ved innsending');
        },
      },
    );
  };

  // Event forms that aren't evaluations shouldn't be accessible directly
  if (eventForm && !isEvaluation) {
    return <Http404 />;
  }

  const canAnswerForm = !form.viewer_has_answered ||
    (form.resource_type === 'GroupForm' && 'can_submit_multiple' in form && (form as Record<string, unknown>).can_submit_multiple);

  return (
    <Page className='max-w-5xl mx-auto'>
      {canGoBack ? (
        <Button variant='outline' onClick={() => router.history.back()} aria-label='Gå tilbake' className='flex items-center gap-2'>
          <ArrowLeft className='size-4' />
          Tilbake
        </Button>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          {form.description && <p>{form.description}</p>}
          <Separator className='my-2' />
          {canAnswerForm ? (
            <Form {...submitForm}>
              <form className='space-y-4' onSubmit={submitForm.handleSubmit(onSubmit)}>
                {/* TODO: FormView expects the old Form type from ~/types — adapt when shared components are migrated */}
                <FormView disabled={submitMutation.isPending} form={form as never} submitForm={submitForm} />
                <Button className='w-full' disabled={submitMutation.isPending} type='submit'>
                  {submitMutation.isPending ? 'Sender inn...' : 'Send inn'}
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
                  <Link to='/profil/{-$userId}'>Gå til profilen din</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
