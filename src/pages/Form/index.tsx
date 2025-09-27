import { useStore } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { authClientWithRedirect } from '~/api/auth';
import { useAppForm, useFieldContext } from '~/components/forms/AppForm';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { MultiCheckbox } from '~/components/ui/multicheckbox';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { formByIdQuery, useCreateSubmission, validateSubmissionInput, validateSubmissionTextInput } from '~/hooks/Form';
import { useAnalytics } from '~/hooks/Utils';
import { cn } from '~/lib/utils';
import Http404 from '~/pages/Http404';
import { getQueryClient } from '~/queryClient';
import type { FormFieldVariants, SelectFieldSubmission, Submission, TextFieldSubmission } from '~/types';
import { EventFormType, FormFieldType, FormResourceType } from '~/types/Enums';
import URLS from '~/URLS';
import { assertNever, formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { href, Link, redirect, useNavigate } from 'react-router';
import { toast } from 'sonner';
import z from 'zod';

import { Route } from './+types';

export async function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);

  const id = params.id;

  let form = null;
  try {
    form = await getQueryClient().ensureQueryData(formByIdQuery(id));
  } catch (e) {
    const message = e instanceof Error ? e.message : (e as { detail?: string }).detail ?? 'Noe gikk galt';
    toast.error('Kunne ikke hente spørreskjema: ' + message);
    throw redirect(href('/'));
  }
  if (form == null) {
    toast.error('Fant ikke spørreskjema');
    throw redirect(href('/'));
  }

  return {
    id,
    form,
  };
}

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

type FormValues = z.infer<typeof formSchema>;

export default function FormPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { event: GAEvent } = useAnalytics();
  const id = loaderData.id;
  const { data: form, isError } = useQuery({
    ...formByIdQuery(loaderData.id),
    initialData: loaderData.form,
  });
  const fieldsWithId = useMemo(() => form.fields.filter((field) => Boolean(field.id)), [form.fields]);
  const createSubmission = useCreateSubmission(id);

  const submitForm = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    defaultValues: {
      answers: fieldsWithId.map((field) => ({
        field: { id: field.id! },
        answer_text: field.type === FormFieldType.TEXT_ANSWER ? '' : undefined,
        selected_options: [FormFieldType.MULTIPLE_SELECT, FormFieldType.SINGLE_SELECT].includes(field.type) ? [] : undefined,
      })),
    } as FormValues,

    async onSubmit({ value }) {
      const data: Submission = {
        answers: value.answers
          .map((answer) => {
            const formField = form.fields.find((field) => field.id === answer.field.id);
            if (!formField) return [];
            if (formField.type === FormFieldType.TEXT_ANSWER) {
              return [
                {
                  type: 'text-field',
                  field: { id: answer.field.id },
                  answer_text: answer.answer_text ?? '',
                } satisfies TextFieldSubmission,
              ];
            }
            return [
              {
                type: 'select-field',
                field: { id: answer.field.id },
                selected_options: answer.selected_options?.map((option) => ({ id: option })) ?? [],
              } satisfies SelectFieldSubmission,
            ];
          })
          .flat(),
      };
      try {
        validateSubmissionTextInput(data, form);
        validateSubmissionInput(data, form);
      } catch {
        toast.error('Du må velge ett eller flere alternativ');
        return;
      }

      await createSubmission.mutateAsync(data, {
        onSuccess: () => {
          toast.success('Innsendingen var vellykket');
          GAEvent('submitted', 'forms', `Submitted submission for form: ${form.title}`);
          navigate(-1);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    },
  });

  const formData = useStore(submitForm.store, (state) => state.values);

  const isEventFormButNotEvaluation = Boolean(form && form.resource_type === FormResourceType.EVENT_FORM && form.type !== EventFormType.EVALUATION);

  if (isError || isEventFormButNotEvaluation) {
    return <Http404 />;
  }

  const canAnswerForm = Boolean(form && (!form.viewer_has_answered || (form.resource_type === FormResourceType.GROUP_FORM && form.can_submit_multiple)));

  return (
    <Page className='max-w-5xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>
            {form ? (form.resource_type === FormResourceType.EVENT_FORM && form.type === EventFormType.EVALUATION ? 'Evaluering' : form.title) : ''}
          </CardTitle>
          <CardDescription>
            {form?.resource_type === FormResourceType.EVENT_FORM && (
              <>
                Arrangøren av <Link to={`${URLS.events}${form.event.id}/`}>{`"${form.event.title}"`}</Link>, som ble holdt
                {formatDate(parseISO(form.event.start_date)).toLowerCase()} på {form.event.location}, ønsker at du svarer på følgende spørsmål:
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {form ? (
            <>
              {form.description && <p>{form.description}</p>}
              <Separator className='my-2' />
              {canAnswerForm ? (
                <>
                  <div className='space-y-6'>
                    <submitForm.Field name='answers' mode='array'>
                      {(questionFields) =>
                        questionFields.state.value.map((_, i) => (
                          <submitForm.AppField
                            key={i}
                            name={`answers[${i}]`}
                            validators={{
                              onBlur: ({ value }) => {
                                const formField = form.fields.find((v) => v.id === value.field.id);
                                if (!formField) return undefined;
                                return validateField(formField, value);
                              },
                              onSubmit: ({ value }) => {
                                const formField = form.fields.find((v) => v.id === value.field.id);
                                if (!formField) return undefined;
                                return validateField(formField, value);
                              },
                            }}>
                            {(field) => {
                              const formField = form.fields.find((v) => v.id === field.state.value.field.id);
                              if (!formField) return null;
                              return <FieldShell formField={formField} />;
                            }}
                          </submitForm.AppField>
                        ))
                      }
                    </submitForm.Field>
                  </div>
                  <submitForm.AppForm>
                    <submitForm.FormErrors />
                    <submitForm.SubmitButton className='w-full' loading='Sender inn...'>
                      Send inn
                    </submitForm.SubmitButton>
                  </submitForm.AppForm>
                </>
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

          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </CardContent>
      </Card>
    </Page>
  );
}

function validateField(formField: FormFieldVariants, value: FormValues['answers'][number]) {
  if (!formField.required) return undefined;

  if (formField.type === FormFieldType.TEXT_ANSWER && (!value.answer_text || value.answer_text.length === 0)) {
    return 'Må fylles ut';
  }
  if (formField.type === FormFieldType.MULTIPLE_SELECT && (!value.selected_options || value.selected_options.length === 0)) {
    return 'Må velge ett eller flere alternativ';
  }
  if (formField.type === FormFieldType.SINGLE_SELECT && (!value.selected_options || value.selected_options.length === 0)) {
    return 'Må velge ett alternativ';
  }
}

function FieldShell({ formField }: { formField: FormFieldVariants }) {
  const field = useFieldContext<FormValues['answers'][number]>();

  const errors = useStore(field.store, (state) => [...new Set(state.meta.errors)]);
  const hasErrors = errors.length > 0;

  const value = formField.type === FormFieldType.TEXT_ANSWER ? field.state.value.answer_text ?? '' : field.state.value.selected_options ?? [];
  const onChange = (newValue: string | string[]) => {
    if (formField.type === FormFieldType.TEXT_ANSWER && typeof newValue === 'string') {
      field.handleChange((prev) => ({
        ...prev,
        answer_text: newValue,
      }));
    } else if (Array.isArray(newValue)) {
      field.handleChange((prev) => ({
        ...prev,
        selected_options: newValue,
      }));
    }
  };

  return (
    <div className='space-y-2'>
      <label className={cn('text-base font-medium', hasErrors && 'text-destructive')}>
        {formField.title} {formField.required && <span className='text-red-300'>*</span>}
      </label>
      <FieldInput field={formField} value={value} onChange={onChange} />
      <div>
        {errors.map((error, i) => (
          <p key={i} className='text-destructive text-sm'>
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}

type FieldInputProps = {
  field: FormFieldVariants;
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

function FieldInput({ field, value, onChange }: FieldInputProps) {
  const fieldType = field.type;
  const fieldCtx = useFieldContext();

  switch (fieldType) {
    case FormFieldType.TEXT_ANSWER:
      return <Textarea value={value} onChange={(e) => onChange(e.target.value)} onBlur={fieldCtx.handleBlur} placeholder='Skriv svar her...' />;
    case FormFieldType.MULTIPLE_SELECT:
      return (
        <>
          <MultiCheckbox
            items={field.options.map((option, index) => ({
              value: option.id ?? `unknown-id-${index}`,
              label: option.title,
            }))}
            value={value as string[]}
            onChange={(newValue) => {
              onChange(newValue);
              fieldCtx.handleBlur();
            }}
            className='text-sm'
          />
        </>
      );
    case FormFieldType.SINGLE_SELECT:
      return (
        <>
          <RadioGroup
            value={value[0] ?? ''}
            onValueChange={(value) => {
              onChange([value]);
              fieldCtx.handleBlur();
            }}>
            {field.options.map((option, index) => (
              <Label key={option.id ?? `unknown-id-${index}`} className='flex gap-2'>
                <RadioGroupItem value={option.id ?? `unknown-id-${index}`} />
                {option.title}
              </Label>
            ))}
          </RadioGroup>
        </>
      );
    default:
      return assertNever(fieldType, { override: <></> });
  }
}
