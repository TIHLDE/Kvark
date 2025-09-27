import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useUpdateGroupFine } from '~/hooks/Group';
import type { GroupFine, RequestResponse } from '~/types';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type EditFineProps = {
  groupSlug: string;
  fine: GroupFine;
};

const formSchema = z.object({
  reason: z.string().min(1, { message: 'Beskrivelsen kan ikke være tom' }),
  amount: z
    .string()
    .min(1, { message: 'Beløpet kan ikke være tomt' })
    .refine((v) => !Number.isNaN(Number(v)), { message: 'Beløpet må være et gyldig tall' }),
});

type FormValues = z.infer<typeof formSchema>;

const EditFine = ({ groupSlug, fine }: EditFineProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const editFine = useUpdateGroupFine(groupSlug, fine.id);

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      reason: fine.reason ?? '',
      amount: fine.amount.toString() ?? '',
    } as FormValues,
    async onSubmit({ value }) {
      const data = {
        reason: value.reason,
        amount: Number(value.amount),
      };
      await toast.promise(
        editFine.mutateAsync(data, {
          onSuccess: () => setIsOpen(false),
        }),
        {
          loading: 'Oppdaterer boten...',
          success: 'Boten ble oppdatert',
          error: (e) => `Kunne ikke oppdatere boten: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
        },
      );
    },
  });

  return (
    <ResponsiveDialog
      description='Her kan du redigere boten'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Rediger bot'
      trigger={
        <Button className='w-full' variant='outline'>
          <Pencil className='mr-2 w-5 h-5' />
          Rediger bot
        </Button>
      }>
      <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='reason'>{(field) => <field.TextareaField label='Beskrivelse' required />}</form.AppField>
        <form.AppField name='amount'>{(field) => <field.InputField type='number' label='Beløp' placeholder='Skriv her...' required />}</form.AppField>
        <form.AppForm>
          <form.SubmitButton className='w-full' loading='Oppdaterer...' type='submit'>
            Oppdater
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default EditFine;
