import { useMutation } from '@tanstack/react-query';
import API from '~/api/api';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useAnalytics } from '~/hooks/Utils';
import { addMonths } from 'date-fns';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  bedrift: z.string().min(1, { message: 'Feltet er påkrevd' }),
  kontaktperson: z.string().min(1, { message: 'Feltet er påkrevd' }),
  epost: z.string().email({ message: 'Ugyldig e-post' }),
  time: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Du må velge minst ett semester',
  }),
  type: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Du må velge minst en type arrangement',
  }),
  comment: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const CompaniesForm = () => {
  const { event } = useAnalytics();

  const sendEmailMutation = useMutation({
    mutationFn: API.emailForm,
  });

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        if (sendEmailMutation.isPending) throw new Error('Du har en melding som venter på å bli sendt inn');

        await sendEmailMutation.mutateAsync(
          {
            info: {
              bedrift: value.bedrift,
              kontaktperson: value.kontaktperson,
              epost: value.epost,
            },
            time: value.time,
            type: value.type,
            comment: value.comment || '',
          },
          {
            onSuccess: () => {
              event('submit-form', 'companies', `Company: ${value.bedrift}`);
              toast.success('Meldingen er sendt inn');
            },
            onError: (error: unknown) => {
              event('submit-form-error', 'companies', 'Company: ' + value.bedrift);
              if (error instanceof Error) toast.error(error.message ?? 'Noe gikk galt');
              if ((error as { detail?: string })?.detail) toast.error((error as { detail?: string })?.detail);
            },
          },
        );
      },
    },
    defaultValues: {
      bedrift: '',
      kontaktperson: '',
      epost: '',
      time: [] as string[],
      type: [] as string[],
      comment: '',
    } as FormSchema,
  });

  const getSemester = (semester: number) => {
    const date = addMonths(new Date(), 1);
    let dateMonth = date.getMonth() + semester * 6;
    let dateYear = date.getFullYear();
    while (dateMonth > 11) {
      dateMonth -= 12;
      dateYear++;
    }
    const returnMonth = dateMonth > 5 ? 'Høst' : 'Vår';
    return `${returnMonth} ${dateYear}`;
  };

  const semesters = useMemo(() => [...Array(4).keys()].map(getSemester), []);
  const types = ['Bedriftspresentasjon', 'Kurs/Workshop', 'Bedriftsbesøk', 'Annonse', 'Insta-takeover', 'Bedriftsekskursjon', 'Annet'];

  return (
    <Card>
      <CardContent className='p-4'>
        <form className='space-y-8' onSubmit={handleFormSubmit(form)}>
          <div className='space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:space-x-4'>
            <form.AppField name='bedrift'>{(field) => <field.InputField label='Bedrift' required />}</form.AppField>
            <form.AppField name='kontaktperson'>{(field) => <field.InputField label='Kontaktperson' required />}</form.AppField>
            <form.AppField name='epost'>{(field) => <field.InputField label='Epost' required type='email' />}</form.AppField>
          </div>

          <Separator />

          <div className='space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:space-x-4'>
            <form.AppField name='time'>{(field) => <field.MultiCheckboxField items={semesters} label='Semester' required />}</form.AppField>

            <form.AppField name='type'>{(field) => <field.MultiCheckboxField items={types} label='Arrangementer' required />}</form.AppField>
          </div>

          <form.AppField name='comment'>{(field) => <field.TextareaField label='Kommentar' />}</form.AppField>

          <form.AppForm>
            <form.SubmitButton className='w-full' disabled={sendEmailMutation.isPending}>
              {sendEmailMutation.isPending ? 'Sender inn...' : 'Send inn'}
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompaniesForm;
