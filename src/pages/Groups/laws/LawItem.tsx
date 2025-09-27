import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useDeleteGroupLaw, useUpdateGroupLaw } from '~/hooks/Group';
import type { Group, GroupLaw, RequestResponse } from '~/types';
import { formatLawHeader, parseLawParagraphNumber } from '~/utils';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type LawItemProps = {
  groupSlug: Group['slug'];
  law: GroupLaw;
  isAdmin?: boolean;
};

const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: 'Kan ikke være tom' })
    .refine((v) => !Number.isNaN(Number(v)), { message: 'Må være et gyldig tall' }),
  description: z.string().optional(),
  paragraph: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Paragraf må være et tall med opptil to desimaler' }),
  title: z.string().min(1, { message: 'Tittel er påkrevd' }),
});

type FormValues = z.infer<typeof formSchema>;

const LawItem = ({ law, groupSlug, isAdmin = false }: LawItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const deleteLaw = useDeleteGroupLaw(groupSlug, law.id);
  const updateLaw = useUpdateGroupLaw(groupSlug, law.id);

  const form = useAppForm({
    validators: { onBlur: formSchema, onChange: formSchema, onSubmit: formSchema },
    defaultValues: {
      amount: law.amount.toString(),
      description: law.description || '',
      paragraph: law.paragraph.toString(),
      title: law.title,
    } as FormValues,
    async onSubmit({ value }) {
      const data = {
        amount: Number(value.amount),
        description: value.description || '',
        paragraph: parseLawParagraphNumber(value.paragraph),
        title: value.title,
      };
      await toast.promise(updateLaw.mutateAsync(data), {
        loading: 'Oppdaterer lovparagrafen...',
        success: 'Lovparagrafen ble oppdatert',
        error: (e) => `Kunne ikke oppdatere lovparagrafen: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
      });
    },
  });

  const handleDeleteLaw = () =>
    deleteLaw.mutate(null, {
      onSuccess: () => {
        toast.success('Lovparagrafen ble slettet');
        setEditOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  return (
    <div className='w-full flex justify-between items-center'>
      <div>
        <h1 className={`${law.paragraph % 1 === 0 ? 'text-xl font-bold' : ''}`}>{formatLawHeader(law)}</h1>

        {Boolean(law.description) && (
          <h1 className='break-words text-sm text-muted-foreground'>
            {law.description}
            <br />
            <i>Bøter: {law.amount}</i>
          </h1>
        )}
      </div>

      {isAdmin && (
        <ResponsiveDialog
          description='Endre en lovparagraf for gruppen'
          onOpenChange={setEditOpen}
          open={editOpen}
          title='Endre lovparagraf'
          trigger={
            <Button size='icon' variant='ghost'>
              <Pencil className='w-5 h-5' />
            </Button>
          }>
          <ScrollArea className='h-[60vh]'>
            <form className='space-y-6 pb-6 px-2' onSubmit={handleFormSubmit(form)}>
              <form.AppField name='paragraph'>
                {(field) => (
                  <FormItem>
                    <FormLabel>Paragraf</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Skriv her...'
                        type='number'
                        value={String(field.state.value ?? '')}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              </form.AppField>
              <form.AppField name='title'>{(field) => <field.InputField label='Tittel' placeholder='Skriv her...' />}</form.AppField>
              <form.AppField name='description'>
                {(field) => <field.TextareaField label='Beskrivelse' description='La stå tom for å ikke kunne velges ved botgivning' />}
              </form.AppField>
              <form.AppField name='amount'>
                {(field) => <field.InputField type='number' label='Veiledende antall bøter' placeholder='Skriv her...' />}
              </form.AppField>
              <form.AppForm>
                <form.SubmitButton className='w-full' loading='Oppdaterer...' type='submit'>
                  Oppdater
                </form.SubmitButton>
              </form.AppForm>

              <ResponsiveAlertDialog
                action={handleDeleteLaw}
                description='Er du sikker på at du vil slette denne lovparagrafen?'
                title='Slett lovparagrafen?'
                trigger={
                  <Button className='w-full' variant='destructive'>
                    Slett lovparagraf
                  </Button>
                }
              />
            </form>
          </ScrollArea>
        </ResponsiveDialog>
      )}
    </div>
  );
};

export default LawItem;
