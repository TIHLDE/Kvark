import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateToddel } from '~/hooks/Toddel';
import { cn } from '~/lib/utils';
import { format, formatISO9075, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  edition: z.number().min(1, { message: 'Feltet er påkrevd' }),
  title: z.string().min(1, { message: 'Feltet er påkrevd' }),
  published_at: z.date({
    required_error: 'Dato er påkrevd',
  }),
  image: z.string().min(1, { message: 'Feltet er påkrevd' }),
  pdf: z.string().min(1, { message: 'Feltet er påkrevd' }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateToddelDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createToddel = useCreateToddel();
  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
      async onSubmitAsync({ value }) {
        createToddel.mutate(
          {
            ...value,
            published_at: formatISO9075(typeof value.published_at === 'string' ? parseISO(value.published_at) : (value.published_at as unknown as Date), {
              representation: 'date',
            }),
          },
          {
            onSuccess: () => {
              toast.success('Publikasjonen ble opprettet');
              setDialogOpen(false);
              form.reset();
            },
            onError: (e) => {
              toast.error(e.detail);
            },
          },
        );
      },
    },
    defaultValues: {
      edition: 0,
      title: '',
      published_at: new Date(),
      image: '',
      pdf: '',
    } as FormValues,
  });

  return (
    <ResponsiveDialog
      description='Opprett en ny utgave'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Opprett ny publikasjon'
      trigger={
        <Button>
          <Plus className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px] mr-2' />
          Publiser
        </Button>
      }>
      <ScrollArea className='h-[70vh]'>
        <form className='space-y-6 px-2' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='edition'>
            {(field) => (
              <FormItem>
                <FormLabel>
                  Utgave <span className='text-red-300'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Skriv nummer her...'
                    value={Number(field.state.value ?? 0)}
                    onChange={(event) => field.handleChange(parseInt(event.target.value))}
                    type='number'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <form.AppField name='title'>
            {(field) => (
              <FormItem>
                <FormLabel>
                  Tittel <span className='text-red-300'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <form.AppField name='published_at'>
            {(field) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  Publiseringsdato <span className='text-red-300'>*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button className={cn('w-full pl-3 text-left font-normal', !field.state.value && 'text-muted-foreground')} variant='outline'>
                        {field.state.value ? format(field.state.value as Date, 'PPP', { locale: nb }) : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-auto p-0'>
                    <Calendar
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                      mode='single'
                      onSelect={(day) => field.handleChange(day ?? new Date())}
                      selected={field.state.value as Date}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg bilde *' />}</form.AppField>

          <form.AppField name='pdf'>{(field) => <field.FileUploadField accept='application/pdf' label='Velg PDF *' />}</form.AppField>

          <form.AppForm>
            <form.SubmitButton className='w-full' disabled={createToddel.isPending} type='submit'>
              {createToddel.isPending ? 'Oppretter...' : 'Opprett'}
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateToddelDialog;
