import { zodResolver } from '@hookform/resolvers/zod';
import { addMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import API from '~/api/api';
import FormInput from '~/components/inputs/Input';
import FormMultiCheckbox from '~/components/inputs/MultiCheckbox';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { Separator } from '~/components/ui/separator';
import { useAnalytics } from '~/hooks/Utils';
import type { CompaniesEmail } from '~/types';

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

const CompaniesForm = () => {
  const { event } = useAnalytics();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bedrift: '',
      kontaktperson: '',
      epost: '',
      time: [],
      type: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const companyData: CompaniesEmail = {
        info: {
          bedrift: values.bedrift,
          kontaktperson: values.kontaktperson,
          epost: values.epost,
        },
        time: values.time,
        type: values.type,
        comment: values.comment || '',
      };
      const response = await API.emailForm(companyData);
      event('submit-form', 'companies', `Company: ${values.bedrift}`);
      toast.success(response.detail);
      form.reset();
    } catch (e) {
      form.setError('bedrift', { message: e.detail || 'Noe gikk galt' });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4 lg:space-y-0 lg:flex lg:space-x-4'>
              <FormInput form={form} label='Bedrift' name='bedrift' required />
              <FormInput form={form} label='Kontaktperson' name='kontaktperson' required />
              <FormInput form={form} label='Epost' name='epost' required type='email' />
            </div>

            <Separator />

            <div className='space-y-4 lg:space-y-0 lg:flex lg:space-x-4'>
              <FormMultiCheckbox form={form} items={semesters} label='Semester' name='time' required />

              <FormMultiCheckbox form={form} items={types} label='Arrangementer' name='type' required />
            </div>

            <FormTextarea form={form} label='Kommentar' name='comment' />

            <Button className='w-full' disabled={isLoading}>
              {isLoading ? 'Sender inn...' : 'Send inn'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompaniesForm;
