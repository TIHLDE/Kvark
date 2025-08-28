import { zodResolver } from '@hookform/resolvers/zod';
import API from '~/api/api';
import { useAnalytics } from '~/hooks/Utils';
import type { CompaniesEmail } from '~/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  bedrift: z.string().min(1, { message: 'Bedriftsnavn er påkrevd' }),
  kontaktperson: z.string().min(1, { message: 'Kontaktperson er påkrevd' }),
  epost: z.string().email({ message: 'Ugyldig e-postadresse' }),
  telefon: z.string().optional(),
  comment: z.string().min(1, { message: 'Beskrivelse er påkrevd' }),
});

export default function CompanyInterest() {
  const { event } = useAnalytics();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bedrift: '',
      kontaktperson: '',
      epost: '',
      telefon: '',
      comment: '',
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
        time: [],
        type: ['Bedriftspresentasjon'],
        comment: `${values.comment}${values.telefon ? `\n\nTelefon: ${values.telefon}` : ''}`,
      };
      const response = await API.emailForm(companyData);
      event('submit-form', 'company-interest', `Company: ${values.bedrift}`);
      toast.success(response.detail);
      form.reset();
    } catch (e) {
      form.setError('bedrift', { message: e.detail || 'Noe gikk galt' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative bg-white dark:bg-background'>
      <div className='lg:absolute lg:inset-0 lg:left-1/2'>
        <div className='relative h-64 w-full sm:h-80 lg:absolute lg:h-full'>
          <img alt='Bedriftspresentasjon' className='h-full w-full object-cover' src='/bedpres.jpg' />
          <div className='absolute inset-0 bg-black/20'></div>
        </div>
      </div>
      <div className='pt-16 pb-24 sm:pt-24 sm:pb-32 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32'>
        <div className='px-6 lg:px-8'>
          <div className='mx-auto max-w-xl lg:mx-0 lg:max-w-lg'>
            <h2 className='text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl'>Meld interesse for samarbeid</h2>
            <p className='mt-2 text-lg/8 text-muted-foreground'>
              Dette skjemaet brukes til å melde interesse for samarbeid med TIHLDE. Vi tar kontakt så fort som mulig.
            </p>
            <form className='mt-16' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
                <div>
                  <label className='block text-sm/6 font-semibold text-foreground' htmlFor='bedrift'>
                    Bedriftsnavn *
                  </label>
                  <div className='mt-2.5'>
                    <input
                      {...form.register('bedrift')}
                      className='block w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      id='bedrift'
                      type='text'
                    />
                    {form.formState.errors.bedrift && <p className='mt-1 text-sm text-destructive'>{form.formState.errors.bedrift.message}</p>}
                  </div>
                </div>
                <div>
                  <label className='block text-sm/6 font-semibold text-foreground' htmlFor='kontaktperson'>
                    Kontaktperson *
                  </label>
                  <div className='mt-2.5'>
                    <input
                      {...form.register('kontaktperson')}
                      className='block w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      id='kontaktperson'
                      type='text'
                    />
                    {form.formState.errors.kontaktperson && <p className='mt-1 text-sm text-destructive'>{form.formState.errors.kontaktperson.message}</p>}
                  </div>
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-sm/6 font-semibold text-foreground' htmlFor='epost'>
                    E-postadresse *
                  </label>
                  <div className='mt-2.5'>
                    <input
                      {...form.register('epost')}
                      className='block w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      id='epost'
                      type='email'
                    />
                    {form.formState.errors.epost && <p className='mt-1 text-sm text-destructive'>{form.formState.errors.epost.message}</p>}
                  </div>
                </div>
                <div className='sm:col-span-2'>
                  <div className='flex justify-between text-sm/6'>
                    <label className='block font-semibold text-foreground' htmlFor='telefon'>
                      Telefonnummer
                    </label>
                    <p className='text-muted-foreground' id='telefon-description'>
                      Valgfritt
                    </p>
                  </div>
                  <div className='mt-2.5'>
                    <input
                      {...form.register('telefon')}
                      aria-describedby='telefon-description'
                      className='block w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      id='telefon'
                      type='tel'
                    />
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <div className='flex justify-between text-sm/6'>
                    <label className='block text-sm/6 font-semibold text-foreground' htmlFor='comment'>
                      Beskriv hva dere er interessert i *
                    </label>
                    <p className='text-muted-foreground' id='comment-description'>
                      Max 500 tegn
                    </p>
                  </div>
                  <div className='mt-2.5'>
                    <textarea
                      {...form.register('comment')}
                      aria-describedby='comment-description'
                      className='block w-full rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      id='comment'
                      maxLength={500}
                      placeholder='Fortell oss om hvilke type arrangementer dere ønsker å arrangere, eller andre henvendelser...'
                      rows={4}
                    />
                    {form.formState.errors.comment && <p className='mt-1 text-sm text-destructive'>{form.formState.errors.comment.message}</p>}
                  </div>
                </div>
              </div>
              <div className='mt-10 flex justify-end border-t border-border pt-8'>
                <button
                  className='rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={isLoading}
                  type='submit'>
                  {isLoading ? 'Sender inn...' : 'Meld interesse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
