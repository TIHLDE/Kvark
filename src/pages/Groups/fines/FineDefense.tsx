import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useUpdateGroupFineDefense } from '~/hooks/Group';
import { RequestResponse } from '~/types';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type FineDefenseProps = {
  groupSlug: string;
  fineId: string;
  defense?: string;
};

const formSchema = z.object({
  defense: z.string().min(1, 'Et forsvar er påkrevd'),
});

type FromValues = z.infer<typeof formSchema>;

const FineDefense = ({ groupSlug, fineId, defense }: FineDefenseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateFineDefense = useUpdateGroupFineDefense(groupSlug, fineId);

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      defense: defense ?? '',
    } as FromValues,
    async onSubmit({ value }) {
      await toast.promise(
        updateFineDefense.mutateAsync(value, {
          onSuccess: () => setIsOpen(false),
        }),
        {
          loading: 'Oppdaterer forsvar...',
          success: 'Forsvar av boten ble oppdatert',
          error: (e) => `Kunne ikke oppdatere forsvaret: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
        },
      );
    },
  });

  return (
    <ResponsiveDialog
      description='Skriv inn et forsvar for boten'
      onOpenChange={setIsOpen}
      open={isOpen}
      title={defense ? 'Endre forsvar' : 'Legg til forsvar'}
      trigger={
        <Button className='w-full' variant='outline'>
          <Shield className='w-5 h-5 mr-2' />
          {defense ? 'Endre forsvar' : 'Legg til forsvar'}
        </Button>
      }>
      <form className='space-y-6 px-2 pb-6' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='defense'>{(field) => <field.TextareaField label='Forsvar' required />}</form.AppField>
        <form.AppForm>
          <form.SubmitButton className='w-full' loading='Lagrer...' type='submit'>
            Lagre
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default FineDefense;
