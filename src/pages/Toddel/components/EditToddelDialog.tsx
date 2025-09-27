import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
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
import { toast } from 'sonner';
import { z } from 'zod';

type EditToddelDialogProps = {
  toddel: Toddel;
};

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

const EditToddelDialog = ({ toddel }: EditToddelDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateToddel = useUpdateToddel(toddel.edition);
  const deleteToddel = useDeleteToddel(toddel.edition);

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
      async onSubmitAsync({ value }) {
        await updateToddel.mutateAsync(
          {
            ...value,
            published_at: formatISO9075(typeof value.published_at === 'string' ? parseISO(value.published_at) : (value.published_at as unknown as Date), {
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
      },
    },
    defaultValues: {
      edition: toddel.edition,
      title: toddel.title,
      published_at: new Date(toddel.published_at),
      image: toddel.image,
      pdf: toddel.pdf,
    } as FormValues,
  });

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

  return (
    <ResponsiveDialog
      description='Endre informasjonen om publikasjonen'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Rediger publikasjon'
      trigger={
        <Button size='icon' variant='ghost'>
          <EllipsisVertical className='w-5 h-5' />
        </Button>
      }>
      <ScrollArea className='h-[70vh] space-y-6'>
        <form className='space-y-6 px-2' onSubmit={handleFormSubmit(form)}>
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
                      <Button
                        className={cn('w-full pl-3 text-left font-normal', !(field.state.value as Date | undefined) && 'text-muted-foreground')}
                        variant='outline'>
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
            <form.SubmitButton className='w-full' disabled={updateToddel.isPending} type='submit'>
              {updateToddel.isPending ? 'Oppdaterer...' : 'Oppdater'}
            </form.SubmitButton>
          </form.AppForm>
        </form>

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
