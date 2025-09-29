import { zodResolver } from '@hookform/resolvers/zod';
import { FormFileUpload, FormImageUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useDeleteToddel, useUpdateToddel } from '~/hooks/Toddel';
import { cn } from '~/lib/utils';
import type { Toddel } from '~/types';
import { format, formatISO9075, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { CalendarIcon, EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type EditToddelDialogProps = {
  toddel: Toddel;
};

const formSchema = z.object({
  edition: z.number().min(1, {
    error: 'Feltet er påkrevd',
  }),
  title: z.string().min(1, {
    error: 'Feltet er påkrevd',
  }),
  published_at: z.date({
    error: (issue) => (issue.input === undefined ? 'Dato er påkrevd' : undefined),
  }),
  image: z.string().min(1, {
    error: 'Feltet er påkrevd',
  }),
  pdf: z.string().min(1, {
    error: 'Feltet er påkrevd',
  }),
});

const EditToddelDialog = ({ toddel }: EditToddelDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateToddel = useUpdateToddel(toddel.edition);
  const deleteToddel = useDeleteToddel(toddel.edition);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edition: toddel.edition,
      title: toddel.title,
      published_at: new Date(toddel.published_at),
      image: toddel.image,
      pdf: toddel.pdf,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    updateToddel.mutate(
      {
        ...values,
        published_at: formatISO9075(typeof values.published_at === 'string' ? parseISO(values.published_at) : (values.published_at as unknown as Date), {
          representation: 'date',
        }),
      },
      {
        onSuccess: () => {
          toast.success('Publikasjonen ble oppdatert');
          setIsOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );

  const remove = () =>
    deleteToddel.mutate(undefined, {
      onSuccess: () => {
        toast.success('Publikasjonen ble slettet');
        setIsOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const EditButton = (
    <Button size='icon' variant='ghost'>
      <EllipsisVertical className='w-5 h-5' />
    </Button>
  );

  return (
    <ResponsiveDialog
      description='Endre informasjonen om publikasjonen'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Rediger publikasjon'
      trigger={EditButton}>
      <ScrollArea className='h-[70vh] space-y-6'>
        <Form {...form}>
          <form className='space-y-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button className='w-full' disabled={updateToddel.isPending} type='submit'>
              {updateToddel.isPending ? 'Oppdaterer...' : 'Oppdater'}
            </Button>
          </form>
        </Form>

        <div className='px-2 mt-8'>
          <Button className='w-full' onClick={remove} variant='destructive'>
            Slett
          </Button>
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default EditToddelDialog;
