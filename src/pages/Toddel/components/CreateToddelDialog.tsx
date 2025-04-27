import { zodResolver } from '@hookform/resolvers/zod';
import { FormFileUpload, FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
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
import { useForm } from 'react-hook-form';
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

const CreateToddelDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createToddel = useCreateToddel();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edition: 0,
      title: '',
      published_at: new Date(),
      image: '',
      pdf: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createToddel.mutate(
      {
        ...values,
        published_at: formatISO9075(typeof values.published_at === 'string' ? parseISO(values.published_at) : (values.published_at as unknown as Date), {
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
  };

  const CreateButton = (
    <Button>
      <Plus className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px] mr-2' />
      Publiser
    </Button>
  );

  return (
    <ResponsiveDialog description='Opprett en ny utgave' onOpenChange={setDialogOpen} open={dialogOpen} title='Opprett ny publikasjon' trigger={CreateButton}>
      <ScrollArea className='h-[70vh]'>
        <Form {...form}>
          <form className='space-y-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='edition'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Utgave <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv nummer her...' {...field} onChange={(event) => field.onChange(parseInt(event.target.value))} type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tittel <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='published_at'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>
                    Publiseringsdato <span className='text-red-300'>*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} variant='outline'>
                          {field.value ? format(field.value, 'PPP', { locale: nb }) : <span>Pick a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='w-auto p-0'>
                      <Calendar
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                        mode='single'
                        onSelect={field.onChange}
                        selected={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormImageUpload form={form} label='Velg bilde *' name='image' />

            <FormFileUpload accept='application/pdf' form={form} label='Velg PDF *' name='pdf' />

            <Button className='w-full' disabled={createToddel.isPending} type='submit'>
              {createToddel.isPending ? 'Oppretter...' : 'Opprett'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default CreateToddelDialog;
