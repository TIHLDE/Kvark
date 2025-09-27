import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGroupLaw } from '~/hooks/Group';
import type { Group, RequestResponse } from '~/types';
import { parseLawParagraphNumber } from '~/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddLawDialogProps = {
  groupSlug: Group['slug'];
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

const AddLawDialog = ({ groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const createLaw = useCreateGroupLaw(groupSlug);

  const form = useAppForm({
    validators: { onBlur: formSchema, onChange: formSchema, onSubmit: formSchema },
    defaultValues: {
      amount: '1',
      description: '',
      paragraph: '1',
      title: '',
    } as FormValues,
    async onSubmit({ value }) {
      const data = {
        amount: Number(value.amount),
        description: value.description || '',
        paragraph: parseLawParagraphNumber(value.paragraph),
        title: value.title,
      };
      await toast.promise(createLaw.mutateAsync(data), {
        loading: 'Oppretter lovparagrafen...',
        success: 'Lovparagrafen ble opprettet',
        error: (e) => `Kunne ikke opprette lovparagrafen: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
      });
      form.reset();
    },
  });

  return (
    <ResponsiveDialog
      description='Opprett en ny lovparagraf for gruppen'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Ny lovparagraf'
      trigger={
        <Button className='w-full'>
          <Plus className='w-5 h-5 mr-2' />
          Ny lovparagraf
        </Button>
      }>
      <ScrollArea className='h-[60vh]'>
        <form className='space-y-6 pb-6 px-2' onSubmit={handleFormSubmit(form)}>
          <form.AppField name='paragraph'>{(field) => <field.InputField type='number' label='Paragraf' placeholder='Skriv her...' />}</form.AppField>
          <form.AppField name='title'>{(field) => <field.InputField label='Tittel' placeholder='Skriv her...' />}</form.AppField>
          <form.AppField name='description'>
            {(field) => <field.TextareaField label='Beskrivelse' description='La stå tom for å ikke kunne velges ved botgivning' />}
          </form.AppField>
          <form.AppField name='amount'>
            {(field) => <field.InputField type='number' label='Veiledende antall bøter' placeholder='Skriv her...' />}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton className='w-full' loading='Oppretter...' type='submit'>
              Opprett
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default AddLawDialog;
